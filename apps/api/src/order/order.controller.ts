import { Controller, Post, Get, Body, Param, HttpCode, HttpStatus, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrderService, FormattedOrder } from './order.service';
import { CheckoutDto } from './dto/checkout.dto';
import { Throttle } from '@nestjs/throttler';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('checkout')
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ short: { ttl: 60000, limit: 10 } })
  async checkout(@Body() dto: CheckoutDto): Promise<FormattedOrder> {
    return this.orderService.createOrder(dto);
  }

  @Get('orders/:orderNumber')
  async getOrder(@Param('orderNumber') orderNumber: string): Promise<FormattedOrder> {
    return this.orderService.getOrderByNumber(orderNumber);
  }

  @Get('orders/track')
  @Throttle({ short: { ttl: 900000, limit: 10 } }) // 10 per IP per 15 min
  async trackOrder(@Req() req: any): Promise<FormattedOrder> {
    const orderNumber = req.query?.orderNumber;
    const email = req.query?.email;
    if (!orderNumber || !email) {
      throw new BadRequestException('Both orderNumber and email are required to track.');
    }
    return this.orderService.trackOrder(String(orderNumber), String(email));
  }

  @Get('orders')
  @UseGuards(JwtAuthGuard)
  async getUserOrders(@Req() req: any): Promise<FormattedOrder[]> {
    return this.orderService.getOrdersByUserId(req.user.id);
  }
}
