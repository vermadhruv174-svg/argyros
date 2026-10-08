import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { PrismaService } from '../database/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';

describe('OrderService', () => {
  let service: OrderService;
  let prisma: any;

  const mockProductActive = {
    id: 'prod-1',
    name: 'Celeste Halo Ring',
    slug: 'celeste-halo-ring',
    status: 'ACTIVE',
    deletedAt: null,
    metalPurity: '925 Sterling Silver',
    images: [{ url: 'https://example.com/ring.jpg', position: 0 }],
  };

  const mockProductInactive = {
    id: 'prod-2',
    name: 'Archived Ring',
    slug: 'archived-ring',
    status: 'ARCHIVED',
    deletedAt: null,
    metalPurity: '925 Sterling Silver',
    images: [],
  };

  const mockVariant1 = {
    id: 'var-1',
    sku: 'CHR-SZ6',
    title: 'Size 6',
    size: '6',
    priceCents: 350000, // ₹3,500 (> ₹2,999 threshold for free shipping)
    stock: 10,
    product: mockProductActive,
  };

  const mockVariantLowPrice = {
    id: 'var-2',
    sku: 'CHR-SZ5',
    title: 'Size 5',
    size: '5',
    priceCents: 100000, // ₹1,000 (< ₹2,999 threshold)
    stock: 5,
    product: mockProductActive,
  };

  const mockVariantOutOfStock = {
    id: 'var-out',
    sku: 'CHR-SZ7',
    title: 'Size 7',
    size: '7',
    priceCents: 200000,
    stock: 0,
    product: mockProductActive,
  };

  const mockVariantInactive = {
    id: 'var-inact',
    sku: 'AR-SZ6',
    title: 'Size 6',
    size: '6',
    priceCents: 100000,
    stock: 5,
    product: mockProductInactive,
  };

  const validCheckoutDto = {
    cartToken: 'cart_valid_123',
    customer: {
      email: 'customer@example.com',
      firstName: 'Aarav',
      lastName: 'Sharma',
      phone: '+919820012345',
    },
    shippingAddress: {
      line1: '123 MG Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560001',
      country: 'India',
    },
  };

  beforeEach(async () => {
    prisma = {
      cart: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      cartItem: {
        deleteMany: jest.fn(),
      },
      productVariant: {
        updateMany: jest.fn(),
      },
      order: {
        create: jest.fn(),
        findUnique: jest.fn(),
      },
      orderItem: {
        create: jest.fn(),
      },
      $transaction: jest.fn((callback) => callback(prisma)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('shipping rule', () => {
    it('10. should calculate free shipping (0) for subtotal >= ₹2,999 (299900 cents)', () => {
      expect(service.calculateShipping(299900)).toBe(0);
      expect(service.calculateShipping(350000)).toBe(0);
    });

    it('11. should calculate flat shipping (15000 cents / ₹150) for subtotal < ₹2,999', () => {
      expect(service.calculateShipping(298000)).toBe(15000);
      expect(service.calculateShipping(100000)).toBe(15000);
    });
  });

  describe('order number generation & uniqueness', () => {
    it('should generate order number in ARG-XXXXXXXX format with unambiguous characters', () => {
      const num = service.generateOrderNumber();
      expect(num).toMatch(/^ARG-[2-9A-HJ-NP-Z]{8}$/);
    });
  });

  describe('createOrder validation & behavior', () => {
    it('1. should reject empty cart', async () => {
      prisma.cart.findUnique.mockResolvedValue({ id: 'c-1', items: [] });
      await expect(service.createOrder(validCheckoutDto)).rejects.toThrow(BadRequestException);
    });

    it('2. should reject missing/invalid cart token', async () => {
      prisma.cart.findUnique.mockResolvedValue(null);
      await expect(service.createOrder({ ...validCheckoutDto, cartToken: 'invalid' })).rejects.toThrow(BadRequestException);
    });

    it('6. should reject inactive/deleted product in cart', async () => {
      prisma.cart.findUnique.mockResolvedValue({
        id: 'c-1',
        items: [{ variantId: 'v-inact', quantity: 1, variant: mockVariantInactive }],
      });
      await expect(service.createOrder(validCheckoutDto)).rejects.toThrow(BadRequestException);
    });

    it('7. should reject invalid variant reference in cart', async () => {
      prisma.cart.findUnique.mockResolvedValue({
        id: 'c-1',
        items: [{ variantId: 'v-null', quantity: 1, variant: null }],
      });
      await expect(service.createOrder(validCheckoutDto)).rejects.toThrow(BadRequestException);
    });

    it('8. should reject out-of-stock variant in cart', async () => {
      prisma.cart.findUnique.mockResolvedValue({
        id: 'c-1',
        items: [{ variantId: 'var-out', quantity: 1, variant: mockVariantOutOfStock }],
      });
      await expect(service.createOrder(validCheckoutDto)).rejects.toThrow(BadRequestException);
    });

    it('12-17. should create order successfully, create immutable snapshots, decrement stock, and clear cart', async () => {
      const mockCart = {
        id: 'c-1',
        sessionId: 'cart_valid_123',
        items: [{ id: 'ci-1', variantId: 'var-1', quantity: 1, variant: mockVariant1 }],
      };
      prisma.cart.findUnique.mockResolvedValue(mockCart);
      prisma.productVariant.updateMany.mockResolvedValue({ count: 1 });
      
      const createdOrderRecord = {
        id: 'ord-1',
        number: 'ARG-2026-ABCD1234',
        email: 'customer@example.com',
        firstName: 'Aarav',
        lastName: 'Sharma',
        phone: '+919820012345',
        status: OrderStatus.CONFIRMED,
        currency: 'INR',
        subtotalCents: 350000,
        shippingCents: 0,
        taxCents: 0,
        totalCents: 350000,
        shippingAddress: validCheckoutDto.shippingAddress,
        items: [
          {
            id: 'oi-1',
            orderId: 'ord-1',
            variantId: 'var-1',
            sku: 'CHR-SZ6',
            name: 'Celeste Halo Ring',
            variantTitle: 'Size 6',
            size: '6',
            metalPurity: '925 Sterling Silver',
            imageUrl: 'https://example.com/ring.jpg',
            quantity: 1,
            unitPriceCents: 350000,
            lineTotalCents: 350000,
          },
        ],
        createdAt: new Date(),
      };

      prisma.order.create.mockResolvedValue(createdOrderRecord);
      prisma.order.findUnique.mockResolvedValue(createdOrderRecord);

      const order = await service.createOrder(validCheckoutDto);

      // 9. Server-side price calculation check
      expect(order.subtotalCents).toBe(350000);
      expect(order.shippingCents).toBe(0);
      expect(order.totalCents).toBe(350000);

      // 13. Immutable OrderItem snapshots
      expect(order.items[0]?.sku).toBe('CHR-SZ6');
      expect(order.items[0]?.name).toBe('Celeste Halo Ring');
      expect(order.items[0]?.variantTitle).toBe('Size 6');
      expect(order.items[0]?.imageUrl).toBe('https://example.com/ring.jpg');

      // 17 & 19. Inventory decrement and cart clear
      expect(prisma.productVariant.updateMany).toHaveBeenCalledWith({
        where: { id: 'var-1', stock: { gte: 1 } },
        data: { stock: { decrement: 1 } },
      });
      expect(prisma.cartItem.deleteMany).toHaveBeenCalledWith({ where: { cartId: 'c-1' } });
    });

    it('18 & 20. should roll back transaction and preserve cart if inventory decrement fails', async () => {
      const mockCart = {
        id: 'c-1',
        sessionId: 'cart_valid_123',
        items: [{ id: 'ci-1', variantId: 'var-1', quantity: 2, variant: mockVariant1 }],
      };
      prisma.cart.findUnique.mockResolvedValue(mockCart);
      // Simulate concurrent stock change causing count = 0
      prisma.productVariant.updateMany.mockResolvedValue({ count: 0 });

      await expect(service.createOrder(validCheckoutDto)).rejects.toThrow(BadRequestException);
      expect(prisma.cartItem.deleteMany).not.toHaveBeenCalled();
    });
  });

  describe('getOrderByNumber', () => {
    it('should return formatted order if found', async () => {
      const orderRecord = {
        id: 'ord-1',
        number: 'ARG-2026-XYZ12345',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: null,
        status: OrderStatus.CONFIRMED,
        currency: 'INR',
        subtotalCents: 100000,
        shippingCents: 15000,
        taxCents: 0,
        totalCents: 115000,
        shippingAddress: {},
        items: [],
        createdAt: new Date(),
      };

      prisma.order.findUnique.mockResolvedValue(orderRecord);

      const order = await service.getOrderByNumber('ARG-2026-XYZ12345');
      expect(order.number).toBe('ARG-2026-XYZ12345');
      expect(order.totalCents).toBe(115000);
    });

    it('should throw NotFoundException if order number does not exist', async () => {
      prisma.order.findUnique.mockResolvedValue(null);
      await expect(service.getOrderByNumber('INVALID')).rejects.toThrow(NotFoundException);
    });
  });
});
