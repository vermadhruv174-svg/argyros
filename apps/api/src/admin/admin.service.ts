import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateProductDto, UpdateProductDto, TransitionOrderStatusDto, UpdateStockDto } from './dto/admin.dto';
import { ProductStatus, OrderStatus, Prisma } from '@prisma/client';
import { AeosService } from '../aeos/aeos.service';

@Injectable()
export class AdminService {
  constructor(
    private db: PrismaService,
    private readonly aeosService: AeosService,
  ) {}

  async getProducts(page: number, limit: number, status?: string) {
    const skip = (page - 1) * limit;
    const where = status ? { status: status as ProductStatus } : {};
    
    const [data, total] = await Promise.all([
      this.db.product.findMany({
        where,
        skip,
        take: limit,
        include: { variants: true, images: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.db.product.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async createProduct(dto: CreateProductDto) {
    return this.db.product.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description ?? '',
        metalPurity: dto.metalPurity ?? '925 Sterling Silver',
        category: dto.category,
        seoTitle: dto.seoTitle,
        seoDescription: dto.seoDescription,
        status: ProductStatus.DRAFT,
        variants: {
          create: dto.variants.map((v) => ({
            sku: v.sku,
            title: v.title,
            size: v.size,
            weightGrams: v.weightGrams,
            priceCents: v.priceCents,
            compareAtCents: v.compareAtCents,
            stock: v.stock,
          })),
        },
      },
      include: { variants: true, images: true },
    });
  }

  async updateProduct(id: string, dto: UpdateProductDto) {
    // Basic update for product info. For variants, typically done separately or more complexly.
    // For this mock we only update scalar fields.
    const data: any = { ...dto };
    delete data.variants;

    return this.db.product.update({
      where: { id },
      data,
      include: { variants: true, images: true },
    });
  }

  async archiveProduct(id: string) {
    return this.db.product.update({
      where: { id },
      data: { status: ProductStatus.ARCHIVED },
    });
  }

  async publishProduct(id: string) {
    return this.db.product.update({
      where: { id },
      data: { status: ProductStatus.ACTIVE },
    });
  }

  async getOrders(page: number, limit: number, status?: string) {
    const skip = (page - 1) * limit;
    const where = status ? { status: status as OrderStatus } : {};

    const [data, total] = await Promise.all([
      this.db.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { items: true },
      }),
      this.db.order.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async getOrderDetail(orderNumber: string) {
    const order = await this.db.order.findUnique({
      where: { number: orderNumber },
      include: { items: true, events: true, payments: true },
    });

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  private async executeOrderTransition(orderNumber: string, status: string, note?: string) {
    const order = await this.db.order.findUnique({ where: { number: orderNumber } });
    if (!order) throw new NotFoundException('Order not found');

    return this.db.$transaction(async (tx: Prisma.TransactionClient) => {
      const updated = await tx.order.update({
        where: { number: orderNumber },
        data: { status: status as OrderStatus },
      });

      await tx.orderEvent.create({
        data: {
          orderId: order.id,
          type: `STATUS_CHANGED_${status}`,
          payload: { note: note || `Status changed to ${status}` },
        },
      });

      return updated;
    });
  }

  async transitionOrderStatus(orderNumber: string, dto: TransitionOrderStatusDto, requestedBy: string = 'admin') {
    const order = await this.db.order.findUnique({ where: { number: orderNumber } });
    if (!order) throw new NotFoundException('Order not found');

    const REQUIRES_APPROVAL = [OrderStatus.CANCELLED.toString(), OrderStatus.REFUNDED.toString()];
    
    if (REQUIRES_APPROVAL.includes(dto.status)) {
      const gate = await this.aeosService.requestApproval({
        subject: `Order ${dto.status}: ${orderNumber}`,
        description: `Request to transition order ${orderNumber} from ${order.status} to ${dto.status}. ${dto.note ?? ''}`.trim(),
        requestedBy,
        correlationId: orderNumber,
        metadata: { orderNumber, currentStatus: order.status, requestedStatus: dto.status, note: dto.note },
        ttlMs: 24 * 60 * 60 * 1000,
      });
      
      return {
        pending: true,
        gateId: gate.id,
        message: `Order ${dto.status} requires approval. Gate ID: ${gate.id}`,
        order: { number: orderNumber, status: order.status },
      };
    }

    // Only allow specific transitions
    const validTransitions: Record<string, string[]> = {
      [OrderStatus.PENDING]: [OrderStatus.PAID],
      [OrderStatus.PAID]: [OrderStatus.PROCESSING],
      [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
    };

    const allowedNext = validTransitions[order.status] || [];
    if (!allowedNext.includes(dto.status) && dto.status !== order.status) {
       throw new BadRequestException(`Cannot transition from ${order.status} to ${dto.status}`);
    }

    return this.executeOrderTransition(orderNumber, dto.status, dto.note);
  }

  async getApprovalGate(gateId: string) {
    return this.aeosService.client.approvals.getApproval(gateId);
  }

  async resolveApprovalGate(gateId: string, decision: 'approved' | 'rejected', decidedBy: string, reason?: string) {
    const gate = await this.aeosService.client.approvals.resolveApproval(gateId, decision, decidedBy, reason);
    
    if (decision === 'approved' && gate.metadata?.['orderNumber'] && gate.metadata?.['requestedStatus']) {
      const orderNumber = gate.metadata['orderNumber'] as string;
      const requestedStatus = gate.metadata['requestedStatus'] as string;
      const note = gate.metadata['note'] as string | undefined;
      await this.executeOrderTransition(orderNumber, requestedStatus, note);
    }
    
    return gate;
  }

  async getLowStock(threshold: number) {
    return this.db.productVariant.findMany({
      where: { stock: { lte: threshold } },
      include: { product: true },
      orderBy: { stock: 'asc' },
    });
  }

  async updateStock(variantId: string, stock: number) {
    return this.db.productVariant.update({
      where: { id: variantId },
      data: { stock },
      include: { product: true },
    });
  }

  async getStats() {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [totalOrders, ordersToday, totalRevenueRes, pendingOrders, lowStockCount] = await Promise.all([
      this.db.order.count(),
      this.db.order.count({ where: { createdAt: { gte: startOfToday } } }),
      this.db.order.aggregate({
        _sum: { totalCents: true },
        where: { status: { notIn: [OrderStatus.CANCELLED, OrderStatus.REFUNDED] } },
      }),
      this.db.order.count({ where: { status: OrderStatus.PENDING } }),
      this.db.productVariant.count({ where: { stock: { lte: 5 } } }),
    ]);

    return {
      totalOrders,
      ordersToday,
      totalRevenueCents: totalRevenueRes._sum.totalCents || 0,
      pendingOrders,
      lowStockCount,
    };
  }
}
