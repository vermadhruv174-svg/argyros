import { Injectable, BadRequestException, ServiceUnavailableException } from '@nestjs/common';
import Stripe from 'stripe';
import Razorpay = require('razorpay');
import { createHmac, timingSafeEqual } from 'crypto';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe | null;
  private readonly razorpay: any | null;

  constructor(private readonly db: PrismaService) {
    const stripeSecret = process.env['STRIPE_SECRET_KEY'];
    this.stripe = stripeSecret
      ? new Stripe(stripeSecret, { apiVersion: '2025-02-24.acacia' })
      : null;

    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
    this.razorpay = razorpayKeyId && razorpayKeySecret
      ? new Razorpay({ key_id: razorpayKeyId, key_secret: razorpayKeySecret })
      : null;
  }

  async createPaymentIntent(
    orderNumber: string,
  ): Promise<{ clientSecret: string; paymentIntentId: string }> {
    const order = await this.db.order.findUniqueOrThrow({
      where: { number: orderNumber },
    });

    if (order.status !== 'PENDING' && order.status !== 'CONFIRMED') {
      throw new BadRequestException('Order is not in a payable state.');
    }

    const stripe = this.requireStripe();

    // Use idempotency key = orderNumber to prevent double-charging
    const intent = await stripe.paymentIntents.create(
      {
        amount: order.totalCents,
        currency: order.currency.toLowerCase(),
        metadata: { orderNumber, orderId: order.id },
      },
      { idempotencyKey: `pi-${orderNumber}` },
    );

    // Record the payment attempt in DB
    await this.db.payment.upsert({
      where: { providerRef: intent.id },
      create: {
        orderId: order.id,
        provider: 'stripe',
        providerRef: intent.id,
        status: 'PENDING',
        amountCents: order.totalCents,
      },
      update: {},
    });

    return { clientSecret: intent.client_secret!, paymentIntentId: intent.id };
  }

  async handleWebhook(rawBody: Buffer, signature: string): Promise<{ received: boolean }> {
    const stripe = this.requireStripe();
    const webhookSecret = process.env['STRIPE_WEBHOOK_SECRET'];
    if (!webhookSecret) {
      throw new ServiceUnavailableException('Stripe webhook verification is not configured.');
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch {
      throw new BadRequestException('Webhook signature verification failed.');
    }

    if (event.type === 'payment_intent.succeeded') {
      const intent = event.data.object as Stripe.PaymentIntent;
      const orderNumber = intent.metadata['orderNumber'];

      if (orderNumber) {
        const order = await this.db.order.findUnique({ where: { number: orderNumber } });
        if (!order) return { received: true };

        const payment = await this.db.payment.findUnique({
          where: { providerRef: intent.id },
        });
        if (
          intent.status !== 'succeeded' ||
          intent.amount !== order.totalCents ||
          intent.currency.toUpperCase() !== order.currency.toUpperCase() ||
          !payment ||
          payment.orderId !== order.id ||
          payment.provider !== 'stripe' ||
          payment.amountCents !== order.totalCents
        ) {
          throw new BadRequestException('Stripe payment does not match the order.');
        }

        await this.settlePayment(payment.id, order.id, {
          intentId: intent.id,
          amount: intent.amount,
          currency: intent.currency,
          provider: 'stripe',
        });
      }
    }

    if (event.type === 'payment_intent.payment_failed') {
      const intent = event.data.object as Stripe.PaymentIntent;
      await this.db.payment.updateMany({
        where: { providerRef: intent.id },
        data: { status: 'FAILED' },
      });
    }

    return { received: true };
  }

  async createRazorpayOrder(orderNumber: string) {
    const order = await this.db.order.findUniqueOrThrow({
      where: { number: orderNumber },
    });

    if (order.status !== 'PENDING' && order.status !== 'CONFIRMED') {
      throw new BadRequestException('Order is not in a payable state.');
    }

    const razorpay = this.requireRazorpay();
    const keyId = this.requireRazorpayKeyId();

    const pendingPayment = await this.db.payment.findFirst({
      where: {
        orderId: order.id,
        provider: 'razorpay',
        status: 'PENDING',
      },
      orderBy: { createdAt: 'desc' },
    });
    if (pendingPayment?.providerRef) {
      return {
        razorpayOrderId: pendingPayment.providerRef,
        amount: pendingPayment.amountCents,
        currency: order.currency,
        keyId,
      };
    }

    const amountInPaise = order.totalCents;

    const rzpOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: orderNumber,
    });

    await this.db.payment.upsert({
      where: { providerRef: rzpOrder.id },
      create: {
        orderId: order.id,
        provider: 'razorpay',
        providerRef: rzpOrder.id,
        status: 'PENDING',
        amountCents: amountInPaise,
      },
      update: {},
    });

    return {
      razorpayOrderId: rzpOrder.id,
      amount: amountInPaise,
      currency: order.currency,
      keyId,
    };
  }

  async verifyRazorpayPayment(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
    orderNumber: string,
  ) {
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !orderNumber) {
      throw new BadRequestException('Complete payment verification details are required.');
    }

    const razorpay = this.requireRazorpay();
    const secret = this.requireRazorpaySecret();
    const expectedSignature = createHmac('sha256', secret)
      .update(razorpayOrderId + '|' + razorpayPaymentId)
      .digest('hex');

    const expected = Buffer.from(expectedSignature, 'hex');
    const provided = Buffer.from(razorpaySignature, 'hex');
    if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
      throw new BadRequestException('Invalid signature');
    }

    const order = await this.db.order.findUnique({ where: { number: orderNumber } });
    if (!order) throw new BadRequestException('Order not found.');

    const payment = await this.db.payment.findUnique({
      where: { providerRef: razorpayOrderId },
    });
    if (
      !payment ||
      payment.orderId !== order.id ||
      payment.provider !== 'razorpay' ||
      payment.amountCents !== order.totalCents
    ) {
      throw new BadRequestException('Payment order does not match the order.');
    }

    if (payment.status === 'SUCCEEDED' && order.status === 'PAID') {
      return { success: true, alreadyProcessed: true };
    }

    let providerOrder: any;
    let providerPayment: any;
    try {
      [providerOrder, providerPayment] = await Promise.all([
        razorpay.orders.fetch(razorpayOrderId),
        razorpay.payments.fetch(razorpayPaymentId),
      ]);
    } catch {
      throw new BadRequestException('Unable to verify payment settlement with Razorpay.');
    }

    if (
      providerOrder?.id !== razorpayOrderId ||
      Number(providerOrder?.amount) !== order.totalCents ||
      String(providerOrder?.currency).toUpperCase() !== order.currency.toUpperCase() ||
      String(providerOrder?.status).toLowerCase() !== 'paid' ||
      providerPayment?.id !== razorpayPaymentId ||
      providerPayment?.order_id !== razorpayOrderId ||
      Number(providerPayment?.amount) !== order.totalCents ||
      String(providerPayment?.currency).toUpperCase() !== order.currency.toUpperCase() ||
      String(providerPayment?.status).toLowerCase() !== 'captured'
    ) {
      throw new BadRequestException('Payment settlement does not match the order.');
    }

    await this.settlePayment(payment.id, order.id, {
      razorpayOrderId,
      razorpayPaymentId,
      amount: order.totalCents,
      currency: order.currency,
      provider: 'razorpay',
    });

    return { success: true };
  }

  private requireStripe(): Stripe {
    if (!this.stripe) {
      throw new ServiceUnavailableException('Stripe payments are not configured.');
    }
    return this.stripe;
  }

  private requireRazorpay(): any {
    if (!this.razorpay) {
      throw new ServiceUnavailableException('Razorpay payments are not configured.');
    }
    return this.razorpay;
  }

  private requireRazorpayKeyId(): string {
    const keyId = process.env.RAZORPAY_KEY_ID;
    if (!keyId) {
      throw new ServiceUnavailableException('Razorpay payments are not configured.');
    }
    return keyId;
  }

  private requireRazorpaySecret(): string {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      throw new ServiceUnavailableException('Razorpay payments are not configured.');
    }
    return secret;
  }

  private async settlePayment(
    paymentId: string,
    orderId: string,
    payload: Record<string, unknown>,
  ): Promise<void> {
    await this.db.$transaction(async (tx: any) => {
      const paymentUpdate = await tx.payment.updateMany({
        where: { id: paymentId, status: 'PENDING' },
        data: { status: 'SUCCEEDED' },
      });

      if (paymentUpdate.count === 0) {
        const currentPayment = await tx.payment.findUnique({ where: { id: paymentId } });
        if (currentPayment?.status === 'SUCCEEDED') return;
        throw new BadRequestException('Payment is no longer payable.');
      }

      const orderUpdate = await tx.order.updateMany({
        where: { id: orderId, status: { not: 'PAID' } },
        data: { status: 'PAID' },
      });
      if (orderUpdate.count === 0) {
        const currentOrder = await tx.order.findUnique({ where: { id: orderId } });
        if (currentOrder?.status !== 'PAID') {
          throw new BadRequestException('Order is no longer payable.');
        }
      }

      await tx.orderEvent.create({
        data: {
          orderId,
          type: 'PAYMENT_SUCCEEDED',
          payload,
        },
      });
    });
  }
}
