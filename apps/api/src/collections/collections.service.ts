import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class CollectionsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.collection.findMany({
      where: {
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
      orderBy: { displayOrder: 'asc' },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });
  }

  async findOne(slug: string) {
    const collection = await this.prisma.collection.findUnique({
      where: { slug },
      include: {
        products: {
          where: {
            product: { status: 'ACTIVE' }
          },
          include: {
            product: {
              include: {
                images: { orderBy: { position: 'asc' } },
                variants: true
              }
            }
          },
          orderBy: {
            product: { name: 'asc' }
          }
        }
      }
    });

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    return collection;
  }

  async trackView(collectionId: string, sessionId?: string, userId?: string) {
    try {
      await this.prisma.collectionView.create({
        data: {
          collectionId,
          sessionId,
          userId,
        }
      });
    } catch (error) {
      // fire and forget, log error if needed
      console.error('Failed to track collection view', error);
    }
  }

  async getStats(collectionId: string) {
    const totalViews = await this.prisma.collectionView.count({
      where: { collectionId }
    });

    // We can use groupBy to count distinct sessionIds/userIds, but simple unique counts:
    const uniqueVisitorsData = await this.prisma.collectionView.groupBy({
      by: ['sessionId', 'userId'],
      where: { collectionId },
    });
    const uniqueVisitors = uniqueVisitorsData.length;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const viewsLast7Days = await this.prisma.collectionView.count({
      where: { 
        collectionId,
        viewedAt: { gte: sevenDaysAgo }
      }
    });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const viewsLast30Days = await this.prisma.collectionView.count({
      where: { 
        collectionId,
        viewedAt: { gte: thirtyDaysAgo }
      }
    });

    const collection = await this.prisma.collection.findUnique({
      where: { id: collectionId },
      include: { _count: { select: { products: true } } }
    });

    // Top products by order count from OrderItems
    // First get product ids in this collection
    const productCollections = await this.prisma.productCollection.findMany({
      where: { collectionId },
      select: { productId: true }
    });
    
    const productIds = productCollections.map(pc => pc.productId);

    // Get order items for these variants
    const topProductsRaw = await this.prisma.orderItem.groupBy({
      by: ['sku'],
      where: {
        variant: {
          productId: { in: productIds }
        }
      },
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 5
    });

    const topProducts = await Promise.all(topProductsRaw.map(async (tp) => {
      const variant = await this.prisma.productVariant.findUnique({
        where: { sku: tp.sku },
        include: { product: true }
      });
      return {
        sku: tp.sku,
        name: variant?.product.name,
        orders: tp._count.id
      };
    }));

    return {
      totalViews,
      uniqueVisitors,
      viewsLast7Days,
      viewsLast30Days,
      productCount: collection?._count.products || 0,
      topProducts
    };
  }
}
