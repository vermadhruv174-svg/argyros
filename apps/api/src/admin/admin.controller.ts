import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateProductDto, UpdateProductDto, TransitionOrderStatusDto, UpdateStockDto } from './dto/admin.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StaffGuard } from './roles.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, StaffGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  getStats() {
    return this.adminService.getStats();
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
  createProduct(@Body() dto: CreateProductDto) {
    return this.adminService.createProduct(dto);
  }

  @Patch('products/:id')
  updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.adminService.updateProduct(id, dto);
  }

  @Post('products/:id/publish')
  publishProduct(@Param('id') id: string) {
    return this.adminService.publishProduct(id);
  }

  @Post('products/:id/archive')
  archiveProduct(@Param('id') id: string) {
    return this.adminService.archiveProduct(id);
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
  transitionOrderStatus(@Param('orderNumber') orderNumber: string, @Body() dto: TransitionOrderStatusDto) {
    return this.adminService.transitionOrderStatus(orderNumber, dto);
  }

  @Get('approvals/:gateId')
  getApprovalGate(@Param('gateId') gateId: string) {
    return this.adminService.getApprovalGate(gateId);
  }

  @Post('approvals/:gateId/decide')
  resolveApprovalGate(
    @Param('gateId') gateId: string,
    @Body() body: { decision: 'approved' | 'rejected'; decidedBy: string; reason?: string },
  ) {
    return this.adminService.resolveApprovalGate(gateId, body.decision, body.decidedBy, body.reason);
  }

  @Get('inventory/low-stock')
  getLowStock(@Query('threshold', new DefaultValuePipe(5), ParseIntPipe) threshold: number) {
    return this.adminService.getLowStock(threshold);
  }

  @Patch('inventory/variants/:id/stock')
  updateStock(@Param('id') id: string, @Body() dto: UpdateStockDto) {
    return this.adminService.updateStock(id, dto.stock);
  }
}
