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

import type { CartData } from '@/types/catalogue';

export async function fetchCart(cartToken?: string): Promise<CartData | null> {
  try {
    const headers: Record<string, string> = {};
    if (cartToken) headers['x-cart-token'] = cartToken;

    const res = await fetch(`${API_BASE_URL}/cart`, {
      headers,
      cache: 'no-store',
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('[ApiClient] fetchCart failed:', error);
    return null;
  }
}

export async function addToCart(cartToken: string | undefined, variantId: string, quantity: number = 1): Promise<CartData | null> {
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (cartToken) headers['x-cart-token'] = cartToken;

    const res = await fetch(`${API_BASE_URL}/cart/items`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ variantId, quantity }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Failed to add item to bag');
    }

    return await res.json();
  } catch (error) {
    console.error('[ApiClient] addToCart error:', error);
    throw error;
  }
}

export async function updateCartItem(cartToken: string, itemId: string, quantity: number): Promise<CartData | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-cart-token': cartToken,
      },
      body: JSON.stringify({ quantity }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Failed to update item quantity');
    }

    return await res.json();
  } catch (error) {
    console.error('[ApiClient] updateCartItem error:', error);
    throw error;
  }
}

export async function removeCartItem(cartToken: string, itemId: string): Promise<CartData | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
      method: 'DELETE',
      headers: { 'x-cart-token': cartToken },
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('[ApiClient] removeCartItem error:', error);
    return null;
  }
}

export async function clearCart(cartToken: string): Promise<CartData | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/cart`, {
      method: 'DELETE',
      headers: { 'x-cart-token': cartToken },
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('[ApiClient] clearCart error:', error);
    return null;
  }
}

