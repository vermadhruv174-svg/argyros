import { BadRequestException, ServiceUnavailableException } from '@nestjs/common';
import { createHmac } from 'crypto';
import { PaymentsService } from './payments.service';

describe('PaymentsService', () => {
  const order = {
    id: 'order-1',
    number: 'ARG-TEST-1',
    status: 'CONFIRMED',
    currency: 'INR',
    totalCents: 1000,
  };
  const payment = {
    id: 'payment-1',
    orderId: order.id,
    provider: 'razorpay',
    providerRef: 'order_rzp_1',
    status: 'PENDING',
    amountCents: order.totalCents,
  };

  let db: any;
  let service: PaymentsService;

  beforeEach(() => {
    process.env.RAZORPAY_KEY_ID = 'rzp_live_key';
    process.env.RAZORPAY_KEY_SECRET = 'rzp_live_secret';

    const transaction = {
      payment: {
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
        findUnique: jest.fn(),
      },
      order: {
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
        findUnique: jest.fn(),
      },
      orderEvent: {
        create: jest.fn().mockResolvedValue({}),
      },
    };

    db = {
      order: {
        findUnique: jest.fn().mockResolvedValue(order),
        findUniqueOrThrow: jest.fn().mockResolvedValue(order),
      },
      payment: {
        findUnique: jest.fn().mockResolvedValue(payment),
        findFirst: jest.fn(),
      },
      $transaction: jest.fn((callback) => callback(transaction)),
      transaction,
    };
    service = new PaymentsService(db);
  });

  afterEach(() => {
    delete process.env.RAZORPAY_KEY_ID;
    delete process.env.RAZORPAY_KEY_SECRET;
  });

  it('rejects a provider settlement whose amount, currency, or status does not match', async () => {
    const razorpay = (service as any).razorpay;
    jest.spyOn(razorpay.orders, 'fetch').mockResolvedValue({
      id: 'order_rzp_1',
      amount: 999,
      currency: 'INR',
      status: 'paid',
    });
    jest.spyOn(razorpay.payments, 'fetch').mockResolvedValue({
      id: 'pay_rzp_1',
      order_id: 'order_rzp_1',
      amount: 999,
      currency: 'INR',
      status: 'captured',
    });

    const signature = createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update('order_rzp_1|pay_rzp_1')
      .digest('hex');

    await expect(
      service.verifyRazorpayPayment('order_rzp_1', 'pay_rzp_1', signature, order.number),
    ).rejects.toThrow(BadRequestException);
    expect(db.transaction.order.updateMany).not.toHaveBeenCalled();
  });

  it('settles a verified payment once and treats an exact replay as idempotent', async () => {
    const razorpay = (service as any).razorpay;
    jest.spyOn(razorpay.orders, 'fetch').mockResolvedValue({
      id: 'order_rzp_1',
      amount: 1000,
      currency: 'INR',
      status: 'paid',
    });
    jest.spyOn(razorpay.payments, 'fetch').mockResolvedValue({
      id: 'pay_rzp_1',
      order_id: 'order_rzp_1',
      amount: 1000,
      currency: 'INR',
      status: 'captured',
    });

    const signature = createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update('order_rzp_1|pay_rzp_1')
      .digest('hex');

    await expect(
      service.verifyRazorpayPayment('order_rzp_1', 'pay_rzp_1', signature, order.number),
    ).resolves.toEqual({ success: true });
    expect(db.transaction.payment.updateMany).toHaveBeenCalledWith({
      where: { id: payment.id, status: 'PENDING' },
      data: { status: 'SUCCEEDED' },
    });
    expect(db.transaction.orderEvent.create).toHaveBeenCalledTimes(1);

    db.payment.findUnique.mockResolvedValue({ ...payment, status: 'SUCCEEDED' });
    db.order.findUnique.mockResolvedValue({ ...order, status: 'PAID' });
    await expect(
      service.verifyRazorpayPayment('order_rzp_1', 'pay_rzp_1', signature, order.number),
    ).resolves.toEqual({ success: true, alreadyProcessed: true });
    expect(db.transaction.orderEvent.create).toHaveBeenCalledTimes(1);
  });

  it('fails explicitly when Razorpay credentials are absent instead of using placeholders', async () => {
    delete process.env.RAZORPAY_KEY_ID;
    delete process.env.RAZORPAY_KEY_SECRET;
    service = new PaymentsService(db);

    await expect(service.createRazorpayOrder(order.number)).rejects.toThrow(ServiceUnavailableException);
  });
});
