import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ListProductsDto } from './dto/list-products.dto';
import { Prisma } from '@prisma/client';

const PRODUCT_SUMMARY_SELECT = {
  id: true,
  slug: true,
  name: true,
  category: true,
  metalPurity: true,
  status: true,
  createdAt: true,
  images: {
    where: { position: 0 },
    select: { url: true, alt: true },
    take: 1,
  },
  variants: {
    select: { priceCents: true, compareAtCents: true, stock: true },
    orderBy: { priceCents: 'asc' as const },
  },
} satisfies Prisma.ProductSelect;

const PRODUCT_DETAIL_SELECT = {
  id: true,
  slug: true,
  name: true,
  description: true,
  category: true,
  metalPurity: true,
  brandId: true,
  seoTitle: true,
  seoDescription: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  images: {
    select: { id: true, url: true, alt: true, position: true },
    orderBy: { position: 'asc' as const },
  },
  variants: {
    select: {
      id: true,
      sku: true,
      title: true,
      size: true,
      weightGrams: true,
      priceCents: true,
      compareAtCents: true,
      stock: true,
    },
    orderBy: { priceCents: 'asc' as const },
  },
  collections: {
    select: {
      collection: { select: { id: true, slug: true, name: true } },
    },
  },
} satisfies Prisma.ProductSelect;

@Injectable()
export class CatalogueService {
  constructor(private readonly prisma: PrismaService) {}

  async listProducts(dto: ListProductsDto) {
    const limit = Math.min(dto.limit ?? 24, 48);

    const where: Prisma.ProductWhereInput = {
      status: 'ACTIVE',
      deletedAt: null,
      ...(dto.q ? { name: { contains: dto.q, mode: 'insensitive' } } : {}),
      ...(dto.category ? { category: { equals: dto.category, mode: 'insensitive' } } : {}),
    };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        select: PRODUCT_SUMMARY_SELECT,
        orderBy: { createdAt: dto.sortDir ?? 'desc' },
        take: limit + 1,
        ...(dto.cursor ? { cursor: { id: dto.cursor }, skip: 1 } : {}),
      }),
      this.prisma.product.count({ where }),
    ]);

    const hasMore = products.length > limit;
    const items = hasMore ? products.slice(0, limit) : products;
    const nextCursor = hasMore ? (items[items.length - 1]?.id ?? null) : null;

    return {
      data: items.map((p) => this.mapSummary(p)),
      meta: { total, limit, nextCursor },
    };
  }

  async getProductBySlug(slug: string) {
    const product = await this.prisma.product.findFirst({
      where: { slug, status: 'ACTIVE', deletedAt: null },
      select: PRODUCT_DETAIL_SELECT,
    });

    if (!product) {
      throw new NotFoundException(`Product '${slug}' not found`);
    }

    return this.mapDetail(product);
  }

  private mapSummary(p: Prisma.ProductGetPayload<{ select: typeof PRODUCT_SUMMARY_SELECT }>) {
    const prices = p.variants.map((v) => v.priceCents);
    const primaryImage = p.images[0] ?? null;
    const hasStock = p.variants.some((v) => v.stock > 0);
    const compareAtCents = p.variants[0]?.compareAtCents ?? null;

    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      category: p.category,
      metalPurity: p.metalPurity,
      primaryImage: primaryImage ? { url: primaryImage.url, alt: primaryImage.alt } : null,
      minPriceCents: prices.length > 0 ? Math.min(...prices) : 0,
      maxPriceCents: prices.length > 0 ? Math.max(...prices) : 0,
      compareAtCents,
      inStock: hasStock,
    };
  }

  private mapDetail(p: Prisma.ProductGetPayload<{ select: typeof PRODUCT_DETAIL_SELECT }>) {
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      description: p.description,
      category: p.category,
      metalPurity: p.metalPurity,
      brandId: p.brandId,
      seoTitle: p.seoTitle,
      seoDescription: p.seoDescription,
      images: p.images.map((img) => ({
        id: img.id,
        url: img.url,
        alt: img.alt,
        position: img.position,
      })),
      variants: p.variants.map((v) => ({
        id: v.id,
        sku: v.sku,
        title: v.title,
        size: v.size,
        weightGrams: Number(v.weightGrams),
        priceCents: v.priceCents,
        compareAtCents: v.compareAtCents,
        stock: v.stock,
        inStock: v.stock > 0,
      })),
      collections: p.collections.map((pc) => pc.collection),
    };
  }
}
