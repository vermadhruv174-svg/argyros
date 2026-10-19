import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { PaymentsService } from './payments.service';
import { SkipThrottle } from '@nestjs/throttler';
import { OrderService } from '../order/order.service';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly orderService: OrderService,
  ) {}

  @Post('intent/:orderNumber')
  @HttpCode(HttpStatus.CREATED)
  async createIntent(
    @Param('orderNumber') orderNumber: string,
    @Headers('x-order-access-token') accessToken?: string,
  ) {
    await this.authorizeOrder(orderNumber, accessToken);
    return this.paymentsService.createPaymentIntent(orderNumber);
  }

  // Stripe sends raw body — NestFactory rawBody: true is required
  @SkipThrottle()
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  webhook(
    @Req() req: Request & { rawBody?: Buffer },
    @Headers('stripe-signature') signature: string,
  ) {
    const rawBody = (req as Request & { rawBody: Buffer }).rawBody;
    return this.paymentsService.handleWebhook(rawBody, signature);
  }

  @Post('razorpay/order/:orderNumber')
  @HttpCode(HttpStatus.CREATED)
  async createRazorpayOrder(
    @Param('orderNumber') orderNumber: string,
    @Headers('x-order-access-token') accessToken?: string,
  ) {
    await this.authorizeOrder(orderNumber, accessToken);
    return this.paymentsService.createRazorpayOrder(orderNumber);
  }

  @Post('razorpay/verify')
  @HttpCode(HttpStatus.OK)
  verifyRazorpayPayment(
    @Body()
    body: {
      razorpayOrderId: string;
      razorpayPaymentId: string;
      razorpaySignature: string;
      orderNumber: string;
    },
    @Headers('x-order-access-token') accessToken?: string,
  ) {
    return this.authorizeOrder(body.orderNumber, accessToken).then(() =>
      this.paymentsService.verifyRazorpayPayment(
        body.razorpayOrderId,
        body.razorpayPaymentId,
        body.razorpaySignature,
        body.orderNumber,
      ),
    );
  }

  private async authorizeOrder(orderNumber: string, accessToken?: string): Promise<void> {
    if (!accessToken) {
      throw new UnauthorizedException('A valid order access token is required.');
    }
    await this.orderService.getOrderByNumber(orderNumber, accessToken);
  }
}
