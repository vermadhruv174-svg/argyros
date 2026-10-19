import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, ParseIntPipe, DefaultValuePipe, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AdminService } from './admin.service';
import { CreateProductDto, UpdateProductDto, TransitionOrderStatusDto, UpdateStockDto } from './dto/admin.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OwnerGuard, RecentOwnerAuthGuard } from './roles.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { JwtPayload } from '../auth/current-user.decorator';
import { AuditService, requestIdFrom, requestMetadata } from '../audit/audit.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, OwnerGuard)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly auditService: AuditService,
  ) {}

  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }

  @Get('audit')
  getAuditEvents(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('actor') actor?: string,
    @Query('action') action?: string,
    @Query('resource') resource?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.auditService.list({ page, limit, actor, action, resource, from, to });
  }

  @Get('products')
  getProducts(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: string,
  ) {
    return this.adminService.getProducts(page, limit, status);
  }

  @Post('products')
  @UseGuards(RecentOwnerAuthGuard)
  async createProduct(@Body() dto: CreateProductDto, @Req() req: Request, @CurrentUser() user: JwtPayload) {
    const product = await this.adminService.createProduct(dto);
    await this.auditService.record({
      actor: user.sub,
      action: 'product.create',
      resource: `product:${product.id}`,
      requestId: requestIdFrom(req),
      after: this.productAuditState(product),
      metadata: requestMetadata(req),
    });
    return product;
  }

  @Patch('products/:id')
  @UseGuards(RecentOwnerAuthGuard)
  async updateProduct(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @Req() req: Request,
    @CurrentUser() user: JwtPayload,
  ) {
    const before = await this.adminService.getProductAuditSnapshot(id);
    const product = await this.adminService.updateProduct(id, dto);
    await this.auditService.record({
      actor: user.sub,
      action: 'product.update',
      resource: `product:${id}`,
      requestId: requestIdFrom(req),
      before: this.productAuditState(before),
      after: this.productAuditState(product),
      metadata: requestMetadata(req, { fieldCount: Object.keys(dto).length }),
    });
    return product;
  }

  @Post('products/:id/publish')
  @UseGuards(RecentOwnerAuthGuard)
  async publishProduct(@Param('id') id: string, @Req() req: Request, @CurrentUser() user: JwtPayload) {
    const before = await this.adminService.getProductAuditSnapshot(id);
    const product = await this.adminService.publishProduct(id);
    await this.auditService.record({
      actor: user.sub,
      action: 'product.publish',
      resource: `product:${id}`,
      requestId: requestIdFrom(req),
      before: this.productAuditState(before),
      after: this.productAuditState(product),
      metadata: requestMetadata(req),
    });
    return product;
  }

  @Post('products/:id/archive')
  @UseGuards(RecentOwnerAuthGuard)
  async archiveProduct(@Param('id') id: string, @Req() req: Request, @CurrentUser() user: JwtPayload) {
    const before = await this.adminService.getProductAuditSnapshot(id);
    const product = await this.adminService.archiveProduct(id);
    await this.auditService.record({
      actor: user.sub,
      action: 'product.archive',
      resource: `product:${id}`,
      requestId: requestIdFrom(req),
      before: this.productAuditState(before),
      after: this.productAuditState(product),
      metadata: requestMetadata(req),
    });
    return product;
  }

  @Get('orders')
  getOrders(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: string,
  ) {
    return this.adminService.getOrders(page, limit, status);
  }

  @Get('orders/:orderNumber')
  getOrderDetail(@Param('orderNumber') orderNumber: string) {
    return this.adminService.getOrderDetail(orderNumber);
  }

  @Patch('orders/:orderNumber/status')
  @UseGuards(RecentOwnerAuthGuard)
  async transitionOrderStatus(
    @Param('orderNumber') orderNumber: string,
    @Body() dto: TransitionOrderStatusDto,
    @Req() req: Request,
    @CurrentUser() user: JwtPayload,
  ) {
    const before = await this.adminService.getOrderAuditSnapshot(orderNumber);
    const result = await this.adminService.transitionOrderStatus(orderNumber, dto, user.sub);
    const isPending = 'pending' in result && Boolean(result.pending);
    const after = isPending
      ? before
      : { ...before, status: 'status' in result ? result.status : dto.status };
    await this.auditService.record({
      actor: user.sub,
      action: isPending ? 'order.status.requested' : 'order.status',
      resource: `order:${orderNumber}`,
      requestId: requestIdFrom(req),
      before: this.orderAuditState(before),
      after: this.orderAuditState(after),
      reason: dto.note,
      metadata: requestMetadata(req, {
        requestedStatus: dto.status,
        pendingApproval: isPending,
      }),
    });
    return result;
  }

  @Get('approvals/:gateId')
  getApprovalGate(@Param('gateId') gateId: string) {
    return this.adminService.getApprovalGate(gateId);
  }

  @Post('approvals/:gateId/decide')
  @UseGuards(RecentOwnerAuthGuard)
  async resolveApprovalGate(
    @Param('gateId') gateId: string,
    @Body() body: { decision: 'approved' | 'rejected'; reason?: string },
    @Req() req: Request,
    @CurrentUser() user: JwtPayload,
  ) {
    const gateBefore = await this.adminService.getApprovalGate(gateId) as {
      metadata?: Record<string, unknown>;
    };
    const orderNumber = typeof gateBefore.metadata?.['orderNumber'] === 'string'
      ? gateBefore.metadata['orderNumber']
      : undefined;
    const orderBefore = orderNumber
      ? await this.adminService.getOrderAuditSnapshot(orderNumber)
      : undefined;
    const result = await this.adminService.resolveApprovalGate(gateId, body.decision, user.sub, body.reason);
    await this.auditService.record({
      actor: user.sub,
      action: 'approval.decision',
      resource: `approval:${gateId}`,
      requestId: requestIdFrom(req),
      before: { decision: 'pending' },
      after: { decision: body.decision },
      reason: body.reason,
      metadata: requestMetadata(req),
    });
    if (body.decision === 'approved' && orderNumber && orderBefore) {
      const orderAfter = await this.adminService.getOrderAuditSnapshot(orderNumber);
      await this.auditService.record({
        actor: user.sub,
        action: 'order.status',
        resource: `order:${orderNumber}`,
        requestId: requestIdFrom(req),
        before: this.orderAuditState(orderBefore),
        after: this.orderAuditState(orderAfter),
        reason: body.reason,
        metadata: requestMetadata(req, { approvalGateId: gateId }),
      });
    }
    return result;
  }

  @Get('inventory/low-stock')
  getLowStock(@Query('threshold', new DefaultValuePipe(5), ParseIntPipe) threshold: number) {
    return this.adminService.getLowStock(threshold);
  }

  @Patch('inventory/variants/:id/stock')
  @UseGuards(RecentOwnerAuthGuard)
  async updateStock(
    @Param('id') id: string,
    @Body() dto: UpdateStockDto,
    @Req() req: Request,
    @CurrentUser() user: JwtPayload,
  ) {
    const before = await this.adminService.getVariantAuditSnapshot(id);
    const variant = await this.adminService.updateStock(id, dto.stock);
    await this.auditService.record({
      actor: user.sub,
      action: 'stock.update',
      resource: `variant:${id}`,
      requestId: requestIdFrom(req),
      before: { id: before.id, productId: before.product.id, stock: before.stock },
      after: { id: variant.id, productId: variant.productId, stock: variant.stock },
      metadata: requestMetadata(req),
    });
    return variant;
  }

  private productAuditState(product: {
    id: string;
    slug: string;
    name: string;
    category: string;
    status: string;
    seoTitle?: string | null;
    seoDescription?: string | null;
    variants?: Array<{ id: string; sku: string; stock: number; priceCents: number }>;
  }) {
    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      category: product.category,
      status: product.status,
      seoTitle: product.seoTitle ?? null,
      seoDescription: product.seoDescription ?? null,
      variants: (product.variants ?? []).map((variant) => ({
        id: variant.id,
        sku: variant.sku,
        stock: variant.stock,
        priceCents: variant.priceCents,
      })),
    };
  }

  private orderAuditState(order: { id: string; number: string; status: string }) {
    return { id: order.id, number: order.number, status: order.status };
  }
}
