import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private readonly prisma: PrismaService) {}

  async getWishlist(userId: string) {
    const items = await this.prisma.wishlistItem.findMany({
      where: { userId },
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
      orderBy: { createdAt: 'desc' },
    });

    return items.map(item => ({
      id: item.id,
      variantId: item.variantId,
      productName: item.variant.product.name,
      variantTitle: item.variant.title,
      priceCents: item.variant.priceCents,
      imageUrl: item.variant.product.images[0]?.url || null,
      slug: item.variant.product.slug,
      metalPurity: item.variant.product.metalPurity,
    }));
  }

  async toggleWishlistItem(userId: string, variantId: string) {
    const existing = await this.prisma.wishlistItem.findUnique({
      where: {
        userId_variantId: { userId, variantId },
      },
    });

    if (existing) {
      await this.prisma.wishlistItem.delete({
        where: { id: existing.id },
      });
      return { added: false };
    } else {
      await this.prisma.wishlistItem.create({
        data: { userId, variantId },
      });
      return { added: true };
    }
  }
}
