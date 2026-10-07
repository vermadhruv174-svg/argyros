import { Injectable, BadRequestException } from '@nestjs/common';
import Stripe from 'stripe';
import Razorpay = require('razorpay');
import { createHmac } from 'crypto';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;
  private readonly razorpay: any;

  constructor(private readonly db: PrismaService) {
    this.stripe = new Stripe(process.env['STRIPE_SECRET_KEY'] ?? 'sk_test_placeholder', {
      apiVersion: '2025-02-24.acacia',
    });
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret_placeholder',
    });
  }

  async createPaymentIntent(
    orderNumber: string,
  ): Promise<{ clientSecret: string; paymentIntentId: string }> {
    const order = await this.db.order.findUniqueOrThrow({
      where: { number: orderNumber },
    });

    if (order.status !== 'PENDING') {
      throw new BadRequestException('Order is not in a payable state.');
    }

    // Use idempotency key = orderNumber to prevent double-charging
    const intent = await this.stripe.paymentIntents.create(
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
    const webhookSecret = process.env['STRIPE_WEBHOOK_SECRET'] ?? '';

    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch {
      throw new BadRequestException('Webhook signature verification failed.');
    }

    if (event.type === 'payment_intent.succeeded') {
      const intent = event.data.object as Stripe.PaymentIntent;
      const orderNumber = intent.metadata['orderNumber'];

      if (orderNumber) {
        const order = await this.db.order.findUnique({ where: { number: orderNumber } });
        if (order) {
          await this.db.order.update({
            where: { id: order.id },
            data: { status: 'PAID' },
          });
          await this.db.payment.updateMany({
            where: { providerRef: intent.id },
            data: { status: 'SUCCEEDED' },
          });
          await this.db.orderEvent.create({
            data: {
              orderId: order.id,
              type: 'PAYMENT_SUCCEEDED',
              payload: { intentId: intent.id, amount: intent.amount },
            },
          });
        }
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

    const amountInPaise = order.totalCents;
    
    const rzpOrder = await this.razorpay.orders.create({
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
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    };
  }

  async verifyRazorpayPayment(razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string, orderNumber: string) {
    const secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret_placeholder';
    const expectedSignature = createHmac('sha256', secret)
      .update(razorpayOrderId + '|' + razorpayPaymentId)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      throw new BadRequestException('Invalid signature');
    }

    const order = await this.db.order.findUniqueOrThrow({ where: { number: orderNumber } });

    await this.db.order.update({
      where: { id: order.id },
      data: { status: 'PAID' },
    });

    await this.db.payment.updateMany({
      where: { providerRef: razorpayOrderId },
      data: { status: 'SUCCEEDED' },
    });

    await this.db.orderEvent.create({
      data: {
        orderId: order.id,
        type: 'PAYMENT_SUCCEEDED',
        payload: { razorpayOrderId, razorpayPaymentId, method: 'razorpay' },
      },
    });

    return { success: true };
  }
}
