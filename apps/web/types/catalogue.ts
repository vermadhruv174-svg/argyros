export interface ProductSummary {
  id: string;
  slug: string;
  name: string;
  category: string;
  metalPurity: string;
  primaryImage: {
    url: string;
    alt: string;
  } | null;
  minPriceCents: number;
  maxPriceCents: number;
  compareAtCents?: number | null;
  inStock: boolean;
}

export interface ProductVariant {
  id: string;
  sku: string;
  title: string;
  size: string | null;
  weightGrams: number;
  priceCents: number;
  compareAtCents: number | null;
  stock: number;
  inStock: boolean;
}

export interface ProductDetailData {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  metalPurity: string;
  brandId: string;
  seoTitle: string | null;
  seoDescription: string | null;
  images: Array<{
    id: string;
    url: string;
    alt: string;
    position: number;
  }>;
  variants: ProductVariant[];
  collections: Array<{
    id: string;
    slug: string;
    name: string;
  }>;
}

export interface ProductListResponse {
  data: ProductSummary[];
  meta: {
    total: number;
    limit: number;
    nextCursor: string | null;
  };
}
