import type { ProductListResponse, ProductDetailData } from '@/types/catalogue';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export async function fetchProducts(query?: string, category?: string): Promise<ProductListResponse> {
  try {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (category) params.set('category', category);

    const res = await fetch(`${API_BASE_URL}/products?${params.toString()}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(`[ApiClient] API error status: ${res.status}`);
      return { data: [], meta: { total: 0, limit: 24, nextCursor: null } };
    }

    return await res.json();
  } catch (error) {
    console.error('[ApiClient] Unable to fetch catalogue from API server:', error);
    return { data: [], meta: { total: 0, limit: 24, nextCursor: null } };
  }
}

export async function fetchProductBySlug(slug: string): Promise<ProductDetailData | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${slug}`, {
      next: { revalidate: 60 },
    });

    if (res.status === 404) return null;
    if (!res.ok) {
      console.error(`[ApiClient] API error status for slug '${slug}': ${res.status}`);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error(`[ApiClient] Unable to fetch slug '${slug}' from API server:`, error);
    return null;
  }
}
