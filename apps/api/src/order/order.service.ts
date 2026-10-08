import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CheckoutDto } from './dto/checkout.dto';
import { randomBytes } from 'crypto';
import { OrderStatus } from '@prisma/client';

export interface FormattedOrderItem {
  id: string;
  variantId: string | null;
  sku: string;
  name: string;
  variantTitle: string | null;
  size: string | null;
  metalPurity: string | null;
  imageUrl: string | null;
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
}

export interface FormattedOrder {
  id: string;
  number: string;
  status: string;
  currency: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  shippingAddress: any;
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  items: FormattedOrderItem[];
  createdAt: Date;
}

const FREE_SHIPPING_THRESHOLD_CENTS = 299900; // ₹2,999
const STANDARD_SHIPPING_FEE_CENTS = 15000; // ₹150

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  calculateShipping(subtotalCents: number): number {
    return subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS
      ? 0
      : STANDARD_SHIPPING_FEE_CENTS;
  }

  generateOrderNumber(): string {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    const bytes = randomBytes(8);
    for (let i = 0; i < 8; i++) {
      code += chars[bytes[i]! % chars.length];
    }
    return `ARG-${code}`;
  }

  async createOrder(dto: CheckoutDto): Promise<FormattedOrder> {
    if (!dto.cartToken) {
      throw new BadRequestException('Cart token is required');
    }

    const cart = await this.prisma.cart.findUnique({
      where: { sessionId: dto.cartToken },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: {
                      where: { position: 0 },
                      take: 1,
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty or not found');
    }

    for (const item of cart.items) {
      if (!item.variant) {
        throw new BadRequestException('One or more items in cart no longer exist');
      }

      if (
        item.variant.product.status !== 'ACTIVE' ||
        item.variant.product.deletedAt !== null
      ) {
        throw new BadRequestException(
          `Product '${item.variant.product.name}' is currently inactive or unavailable`,
        );
      }

      if (item.variant.stock < item.quantity) {
        throw new BadRequestException(
          `Requested quantity for '${item.variant.product.name} (${item.variant.title})' exceeds available stock (${item.variant.stock})`,
        );
      }
    }

    const subtotalCents = cart.items.reduce(
      (sum, item) => sum + item.quantity * item.variant.priceCents,
      0,
    );
    const shippingCents = this.calculateShipping(subtotalCents);
    const taxCents = 0;
    const totalCents = subtotalCents + shippingCents + taxCents;

    let createdOrder: any = null;
    let attempts = 0;
    const maxAttempts = 3;

    while (!createdOrder && attempts < maxAttempts) {
      attempts++;
      const orderNumber = this.generateOrderNumber();

      try {
        createdOrder = await this.prisma.$transaction(async (tx) => {
          // 1. Concurrency-safe inventory decrement
          for (const item of cart.items) {
            const updateRes = await tx.productVariant.updateMany({
              where: {
                id: item.variantId,
                stock: { gte: item.quantity },
              },
              data: {
                stock: { decrement: item.quantity },
              },
            });

            if (updateRes.count === 0) {
              throw new BadRequestException(
                `Stock changed concurrently or is insufficient for '${item.variant.product.name} (${item.variant.title})'`,
              );
            }
          }

          // 2. Create Order
          const order = await tx.order.create({
            data: {
              number: orderNumber,
              email: dto.customer.email.toLowerCase().trim(),
              firstName: dto.customer.firstName.trim(),
              lastName: dto.customer.lastName.trim(),
              phone: dto.customer.phone?.trim() || null,
              status: OrderStatus.CONFIRMED,
              currency: 'INR',
              subtotalCents,
              shippingCents,
              taxCents,
              totalCents,
              shippingAddress: dto.shippingAddress as any,
            },
          });

          // 3. Create OrderItems with immutable snapshots
          for (const item of cart.items) {
            const lineTotalCents = item.quantity * item.variant.priceCents;
            const primaryImg = item.variant.product.images[0]?.url || null;

            await tx.orderItem.create({
              data: {
                orderId: order.id,
                variantId: item.variantId,
                sku: item.variant.sku,
                name: item.variant.product.name,
                variantTitle: item.variant.title,
                size: item.variant.size,
                metalPurity: item.variant.product.metalPurity,
                imageUrl: primaryImg,
                quantity: item.quantity,
                unitPriceCents: item.variant.priceCents,
                lineTotalCents,
              },
            });
          }

          // 4. Clear cart items
          await tx.cartItem.deleteMany({
            where: { cartId: cart.id },
          });

          await tx.cart.update({
            where: { id: cart.id },
            data: { updatedAt: new Date() },
          });

          return tx.order.findUnique({
            where: { id: order.id },
            include: { items: true },
          });
        });
      } catch (err: any) {
        if (err.code === 'P2002' && err.meta?.target?.includes('number')) {
          if (attempts >= maxAttempts) {
            throw new BadRequestException('Failed to generate a unique order number. Please try again.');
          }
          continue;
        }
        throw err;
      }
    }

    return this.formatOrder(createdOrder);
  }

  async getOrderByNumber(orderNumber: string): Promise<FormattedOrder> {
    if (!orderNumber) {
      throw new BadRequestException('Order number is required');
    }

    const order = await this.prisma.order.findUnique({
      where: { number: orderNumber },
      include: {
        items: {
          orderBy: { id: 'asc' as const },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order '${orderNumber}' not found`);
    }

    return this.formatOrder(order);
  }

  async trackOrder(orderNumber: string, email: string): Promise<FormattedOrder> {
    if (!orderNumber || !email) {
      throw new BadRequestException('Order number and email are required');
    }

    const order = await this.prisma.order.findFirst({
      where: {
        number: orderNumber.trim(),
        email: { equals: email.trim(), mode: 'insensitive' },
      },
      include: {
        items: {
          orderBy: { id: 'asc' as const },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order not found matching provided reference and email`);
    }

    return this.formatOrder(order);
  }

  async getOrdersByUserId(userId: string): Promise<FormattedOrder[]> {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          orderBy: { id: 'asc' as const },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map(order => this.formatOrder(order));
  }

  private formatOrder(order: any): FormattedOrder {
    const items: FormattedOrderItem[] = (order.items || []).map((item: any) => ({
      id: item.id,
      variantId: item.variantId,
      sku: item.sku,
      name: item.name,
      variantTitle: item.variantTitle,
      size: item.size,
      metalPurity: item.metalPurity,
      imageUrl: item.imageUrl,
      quantity: item.quantity,
      unitPriceCents: item.unitPriceCents,
      lineTotalCents: item.lineTotalCents,
    }));

    return {
      id: order.id,
      number: order.number,
      status: order.status,
      currency: order.currency,
      email: order.email,
      firstName: order.firstName,
      lastName: order.lastName,
      phone: order.phone,
      shippingAddress: order.shippingAddress,
      subtotalCents: order.subtotalCents,
      shippingCents: order.shippingCents,
      taxCents: order.taxCents,
      totalCents: order.totalCents,
      items,
      createdAt: order.createdAt,
    };
  }
}
