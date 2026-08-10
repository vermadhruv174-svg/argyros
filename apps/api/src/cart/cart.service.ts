import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { randomBytes } from 'crypto';

export interface FormattedCartItem {
  id: string;
  variantId: string;
  sku: string;
  title: string;
  size: string | null;
  productName: string;
  productSlug: string;
  imageUrl: string | null;
  metalPurity: string;
  unitPriceCents: number;
  quantity: number;
  lineTotalCents: number;
  inStock: boolean;
  maxStock: number;
}

export interface FormattedCart {
  id: string;
  token: string;
  items: FormattedCartItem[];
  itemCount: number;
  totalQuantity: number;
  subtotalCents: number;
  updatedAt: Date;
}

const CART_INCLUDE = {
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
    orderBy: { id: 'asc' as const },
  },
};

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  generateToken(): string {
    return `cart_${randomBytes(16).toString('hex')}`;
  }

  async getOrCreateCart(token?: string): Promise<FormattedCart> {
    if (token) {
      const existingCart = await this.prisma.cart.findUnique({
        where: { sessionId: token },
        include: CART_INCLUDE,
      });

      if (existingCart) {
        return this.formatCart(existingCart);
      }
    }

    const newToken = token || this.generateToken();
    const newCart = await this.prisma.cart.create({
      data: { sessionId: newToken },
      include: CART_INCLUDE,
    });

    return this.formatCart(newCart);
  }

  async addItem(token: string | undefined, dto: AddToCartDto): Promise<FormattedCart> {
    this.validateQuantity(dto.quantity);

    const variant = await this.prisma.productVariant.findUnique({
      where: { id: dto.variantId },
      include: { product: true },
    });

    if (!variant) {
      throw new NotFoundException('Product variant not found');
    }

    if (variant.product.status !== 'ACTIVE' || variant.product.deletedAt !== null) {
      throw new BadRequestException('Product is currently inactive or unavailable');
    }

    if (variant.stock <= 0) {
      throw new BadRequestException('Product variant is out of stock');
    }

    const cartData = await this.getOrCreateCart(token);
    const cartId = cartData.id;
    const cartToken = cartData.token;

    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_variantId: {
          cartId,
          variantId: dto.variantId,
        },
      },
    });

    const targetQuantity = existingItem ? existingItem.quantity + dto.quantity : dto.quantity;

    if (targetQuantity > variant.stock) {
      throw new BadRequestException(`Requested quantity (${targetQuantity}) exceeds available stock (${variant.stock})`);
    }

    await this.prisma.$transaction(async (tx) => {
      if (existingItem) {
        await tx.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: targetQuantity },
        });
      } else {
        await tx.cartItem.create({
          data: {
            cartId,
            variantId: dto.variantId,
            quantity: dto.quantity,
          },
        });
      }

      await tx.cart.update({
        where: { id: cartId },
        data: { updatedAt: new Date() },
      });
    });

    return this.getOrCreateCart(cartToken);
  }

  async updateItem(token: string, itemId: string, dto: UpdateCartItemDto): Promise<FormattedCart> {
    if (!token) {
      throw new BadRequestException('Cart token is required');
    }

    this.validateQuantity(dto.quantity);

    const cart = await this.prisma.cart.findUnique({
      where: { sessionId: token },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
      include: {
        variant: {
          include: { product: true },
        },
      },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    if (item.variant.product.status !== 'ACTIVE' || item.variant.product.deletedAt !== null) {
      throw new BadRequestException('Product is currently inactive or unavailable');
    }

    if (dto.quantity > item.variant.stock) {
      throw new BadRequestException(`Requested quantity (${dto.quantity}) exceeds available stock (${item.variant.stock})`);
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.cartItem.update({
        where: { id: itemId },
        data: { quantity: dto.quantity },
      });

      await tx.cart.update({
        where: { id: cart.id },
        data: { updatedAt: new Date() },
      });
    });

    return this.getOrCreateCart(token);
  }

  async removeItem(token: string, itemId: string): Promise<FormattedCart> {
    if (!token) {
      throw new BadRequestException('Cart token is required');
    }

    const cart = await this.prisma.cart.findUnique({
      where: { sessionId: token },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.cartItem.delete({
        where: { id: itemId },
      });

      await tx.cart.update({
        where: { id: cart.id },
        data: { updatedAt: new Date() },
      });
    });

    return this.getOrCreateCart(token);
  }

  async clearCart(token: string): Promise<FormattedCart> {
    if (!token) {
      throw new BadRequestException('Cart token is required');
    }

    const cart = await this.prisma.cart.findUnique({
      where: { sessionId: token },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      await tx.cart.update({
        where: { id: cart.id },
        data: { updatedAt: new Date() },
      });
    });

    return this.getOrCreateCart(token);
  }

  private validateQuantity(quantity: number): void {
    if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity <= 0) {
      throw new BadRequestException('Quantity must be a positive integer');
    }
  }

  private formatCart(cart: any): FormattedCart {
    const items: FormattedCartItem[] = (cart.items || []).map((item: any) => {
      const variant = item.variant;
      const product = variant?.product;
      const primaryImg = product?.images?.[0]?.url || null;
      const unitPriceCents = variant?.priceCents || 0;
      const lineTotalCents = unitPriceCents * item.quantity;
      const stock = variant?.stock || 0;

      return {
        id: item.id,
        variantId: item.variantId,
        sku: variant?.sku || '',
        title: variant?.title || '',
        size: variant?.size || null,
        productName: product?.name || '',
        productSlug: product?.slug || '',
        imageUrl: primaryImg,
        metalPurity: product?.metalPurity || '925 Sterling Silver',
        unitPriceCents,
        quantity: item.quantity,
        lineTotalCents,
        inStock: stock > 0,
        maxStock: stock,
      };
    });

    const subtotalCents = items.reduce((sum, item) => sum + item.lineTotalCents, 0);
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      id: cart.id,
      token: cart.sessionId || '',
      items,
      itemCount: items.length,
      totalQuantity,
      subtotalCents,
      updatedAt: cart.updatedAt,
    };
  }
}
