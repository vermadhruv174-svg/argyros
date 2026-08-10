import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { PrismaService } from '../database/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('CartService', () => {
  let service: CartService;
  let prisma: any;

  const mockCart = {
    id: 'cart-1',
    sessionId: 'cart_token_123',
    userId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    items: [],
  };

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

  const mockVariantInStock = {
    id: 'var-1',
    productId: 'prod-1',
    sku: 'CHR-SZ6',
    title: 'Size 6',
    size: '6',
    priceCents: 289000,
    stock: 10,
    product: mockProductActive,
  };

  const mockVariantOutOfStock = {
    id: 'var-out',
    productId: 'prod-1',
    sku: 'CHR-SZ5',
    title: 'Size 5',
    size: '5',
    priceCents: 289000,
    stock: 0,
    product: mockProductActive,
  };

  const mockVariantInactive = {
    id: 'var-inact',
    productId: 'prod-2',
    sku: 'AR-SZ6',
    title: 'Size 6',
    size: '6',
    priceCents: 100000,
    stock: 5,
    product: mockProductInactive,
  };

  beforeEach(async () => {
    prisma = {
      cart: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      cartItem: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
      },
      productVariant: {
        findUnique: jest.fn(),
      },
      $transaction: jest.fn((callback) => callback(prisma)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // 1. Create / retrieve guest cart
  describe('getOrCreateCart', () => {
    it('1. should retrieve existing guest cart if valid token provided', async () => {
      prisma.cart.findUnique.mockResolvedValue(mockCart);

      const cart = await service.getOrCreateCart('cart_token_123');

      expect(prisma.cart.findUnique).toHaveBeenCalledWith({
        where: { sessionId: 'cart_token_123' },
        include: expect.any(Object),
      });
      expect(cart.token).toBe('cart_token_123');
      expect(cart.id).toBe('cart-1');
    });

    it('1. should create new guest cart if token missing or not found', async () => {
      prisma.cart.findUnique.mockResolvedValue(null);
      prisma.cart.create.mockResolvedValue(mockCart);

      const cart = await service.getOrCreateCart();

      expect(prisma.cart.create).toHaveBeenCalled();
      expect(cart.token).toBe('cart_token_123');
    });
  });

  // 2. Add valid variant
  describe('addItem', () => {
    it('2. should add valid variant to cart', async () => {
      prisma.productVariant.findUnique.mockResolvedValue(mockVariantInStock);
      prisma.cart.findUnique.mockResolvedValue(mockCart);
      prisma.cartItem.findUnique.mockResolvedValue(null);
      prisma.cartItem.create.mockResolvedValue({});

      const cart = await service.addItem('cart_token_123', {
        variantId: 'var-1',
        quantity: 2,
      });

      expect(prisma.cartItem.create).toHaveBeenCalledWith({
        data: {
          cartId: 'cart-1',
          variantId: 'var-1',
          quantity: 2,
        },
      });
      expect(cart).toBeDefined();
    });

    // 3. Reject invalid variant
    it('3. should reject non-existent variantId with NotFoundException', async () => {
      prisma.productVariant.findUnique.mockResolvedValue(null);

      await expect(
        service.addItem('cart_token_123', {
          variantId: 'non-existent',
          quantity: 1,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    // 4. Reject inactive / deleted product
    it('4. should reject inactive or soft-deleted product variant', async () => {
      prisma.productVariant.findUnique.mockResolvedValue(mockVariantInactive);

      await expect(
        service.addItem('cart_token_123', {
          variantId: 'var-inact',
          quantity: 1,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    // 5. Reject zero / negative / non-integer quantity
    it('5. should reject zero, negative, or non-integer quantity', async () => {
      await expect(
        service.addItem('cart_token_123', {
          variantId: 'var-1',
          quantity: 0,
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        service.addItem('cart_token_123', {
          variantId: 'var-1',
          quantity: -3,
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        service.addItem('cart_token_123', {
          variantId: 'var-1',
          quantity: 2.5,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    // 6. Prevent duplicate variant lines (upsert/increment quantity)
    it('6. should increment quantity for existing variant in cart instead of creating duplicate line', async () => {
      prisma.productVariant.findUnique.mockResolvedValue(mockVariantInStock);
      prisma.cart.findUnique.mockResolvedValue(mockCart);
      prisma.cartItem.findUnique.mockResolvedValue({
        id: 'item-1',
        cartId: 'cart-1',
        variantId: 'var-1',
        quantity: 2,
      });
      prisma.cartItem.update.mockResolvedValue({});

      await service.addItem('cart_token_123', {
        variantId: 'var-1',
        quantity: 3,
      });

      expect(prisma.cartItem.update).toHaveBeenCalledWith({
        where: { id: 'item-1' },
        data: { quantity: 5 },
      });
    });

    // 11. Reject out-of-stock variant
    it('11. should reject adding an out-of-stock variant', async () => {
      prisma.productVariant.findUnique.mockResolvedValue(mockVariantOutOfStock);

      await expect(
        service.addItem('cart_token_123', {
          variantId: 'var-out',
          quantity: 1,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // 7. Update quantity
  describe('updateItem', () => {
    it('7. should update quantity of existing cart item', async () => {
      prisma.cart.findUnique.mockResolvedValue(mockCart);
      prisma.cartItem.findFirst.mockResolvedValue({
        id: 'item-1',
        cartId: 'cart-1',
        variantId: 'var-1',
        quantity: 2,
        variant: mockVariantInStock,
      });
      prisma.cartItem.update.mockResolvedValue({});

      await service.updateItem('cart_token_123', 'item-1', { quantity: 5 });

      expect(prisma.cartItem.update).toHaveBeenCalledWith({
        where: { id: 'item-1' },
        data: { quantity: 5 },
      });
    });
  });

  // 8. Remove item
  describe('removeItem', () => {
    it('8. should remove item from cart', async () => {
      prisma.cart.findUnique.mockResolvedValue(mockCart);
      prisma.cartItem.findFirst.mockResolvedValue({
        id: 'item-1',
        cartId: 'cart-1',
      });
      prisma.cartItem.delete.mockResolvedValue({});

      await service.removeItem('cart_token_123', 'item-1');

      expect(prisma.cartItem.delete).toHaveBeenCalledWith({
        where: { id: 'item-1' },
      });
    });
  });

  // 9. Clear cart
  describe('clearCart', () => {
    it('9. should clear all items in cart', async () => {
      prisma.cart.findUnique.mockResolvedValue(mockCart);
      prisma.cartItem.deleteMany.mockResolvedValue({ count: 2 });

      await service.clearCart('cart_token_123');

      expect(prisma.cartItem.deleteMany).toHaveBeenCalledWith({
        where: { cartId: 'cart-1' },
      });
    });
  });

  // 10. Correct subtotal calculation
  describe('subtotal calculation', () => {
    it('10. should calculate correct line totals and cart subtotal from database prices', async () => {
      const cartWithItems = {
        ...mockCart,
        items: [
          {
            id: 'item-1',
            variantId: 'var-1',
            quantity: 2,
            variant: {
              ...mockVariantInStock,
              priceCents: 289000, // ₹2,890.00
            },
          },
          {
            id: 'item-2',
            variantId: 'var-2',
            quantity: 1,
            variant: {
              id: 'var-2',
              sku: 'LHE-M',
              title: 'Medium',
              priceCents: 269000, // ₹2,690.00
              stock: 10,
              product: mockProductActive,
            },
          },
        ],
      };

      prisma.cart.findUnique.mockResolvedValue(cartWithItems);

      const cart = await service.getOrCreateCart('cart_token_123');

      // item-1 line total: 2 * 289000 = 578000
      // item-2 line total: 1 * 269000 = 269000
      // subtotal: 578000 + 269000 = 847000 (₹8,470.00)
      expect(cart.items[0]?.lineTotalCents).toBe(578000);
      expect(cart.items[1]?.lineTotalCents).toBe(269000);
      expect(cart.subtotalCents).toBe(847000);
      expect(cart.totalQuantity).toBe(3);
      expect(cart.itemCount).toBe(2);
    });
  });
});
