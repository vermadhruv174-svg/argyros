import { Controller, Post, Param, Headers, Req, HttpCode, HttpStatus, Body } from '@nestjs/common';
import type { Request } from 'express';
import { PaymentsService } from './payments.service';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('intent/:orderNumber')
  @HttpCode(HttpStatus.CREATED)
  createIntent(@Param('orderNumber') orderNumber: string) {
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
  createRazorpayOrder(@Param('orderNumber') orderNumber: string) {
    return this.paymentsService.createRazorpayOrder(orderNumber);
  }

  @Post('razorpay/verify')
  @HttpCode(HttpStatus.OK)
  verifyRazorpayPayment(
    @Body() body: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string; orderNumber: string }
  ) {
    return this.paymentsService.verifyRazorpayPayment(
      body.razorpayOrderId,
      body.razorpayPaymentId,
      body.razorpaySignature,
      body.orderNumber
    );
  }
}
