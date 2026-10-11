import type {
  ProductListResponse,
  ProductDetailData,
  CartData,
  CartItemData,
  CheckoutPayload,
  OrderData,
} from '@/types/catalogue';
import {
  FOUNDATION_PRODUCTS,
  FOUNDATION_COLLECTIONS,
  getProductSummary,
  type CollectionData,
} from './catalogue-data';

// On the browser, use relative /api
// On the server (SSR), use NEXT_PUBLIC_API_URL or fallback to localhost
const API_BASE_URL =
  typeof window !== 'undefined'
    ? '/api'
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// ─── Products Catalogue ───────────────────────────────────────────────────

export async function fetchProducts(
  query?: string,
  category?: string
): Promise<ProductListResponse> {
  try {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (category) params.set('category', category);

    const res = await fetch(`${API_BASE_URL}/products?${params.toString()}`, {
      next: { revalidate: 60 },
    });

    if (res.ok) {
      const json: ProductListResponse = await res.json();
      if (json.data && json.data.length > 0) {
        return json;
      }
    }
  } catch (error) {
    console.warn('[ApiClient] Remote API unreachable for fetchProducts, using Foundation catalogue fallback.');
  }

  // Graceful fallback: Filter Foundation Products
  let items = FOUNDATION_PRODUCTS;
  const q = query?.toLowerCase().trim();
  const cat = category?.toLowerCase().trim();

  if (cat) {
    items = items.filter(
      (p) =>
        p.category.toLowerCase() === cat ||
        (cat === 'bracelets' && p.category.toLowerCase().includes('bracelet'))
    );
  }

  if (q) {
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  const summaries = items.map(getProductSummary);

  return {
    data: summaries,
    meta: {
      total: summaries.length,
      limit: 24,
      nextCursor: null,
    },
  };
}

export async function fetchProductBySlug(slug: string): Promise<ProductDetailData | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${slug}`, {
      next: { revalidate: 60 },
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.warn(`[ApiClient] Remote API unreachable for fetchProductBySlug('${slug}'), using Foundation catalogue.`);
  }

  // Fallback to Foundation Product dataset
  const match = FOUNDATION_PRODUCTS.find((p) => p.slug === slug);
  return match ?? null;
}

// ─── Collections ──────────────────────────────────────────────────────────

export async function fetchCollections(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/collections`, {
      next: { revalidate: 60 },
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch {
    console.warn('[ApiClient] Remote API unreachable for fetchCollections, using Foundation collections fallback.');
  }

  return FOUNDATION_COLLECTIONS.map((c) => ({
    ...c,
    _count: {
      products: c.productCount,
    },
  }));
}

export async function fetchCollectionBySlug(slug: string): Promise<any | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/collections/${slug}`, {
      next: { revalidate: 60 },
    });

    if (res.ok) {
      return await res.json();
    }
  } catch {
    console.warn(`[ApiClient] Remote API unreachable for fetchCollectionBySlug('${slug}'), using Foundation fallback.`);
  }

  const col = FOUNDATION_COLLECTIONS.find((c) => c.slug === slug);
  if (!col) return null;

  let matchingProducts = FOUNDATION_PRODUCTS;
  if (slug !== 'the-first-edition') {
    matchingProducts = FOUNDATION_PRODUCTS.filter((p) =>
      p.collections.some((c) => c.slug === slug)
    );
  }

  return {
    ...col,
    products: matchingProducts.map((p) => ({
      product: p,
    })),
  };
}

// ─── Local Cart Fallback Helper ───────────────────────────────────────────

const LOCAL_CART_KEY = 'argyros_local_cart';

function getLocalCart(): CartData {
  if (typeof window === 'undefined') {
    return {
      id: 'cart-local',
      token: 'tok-local',
      items: [],
      itemCount: 0,
      totalQuantity: 0,
      subtotalCents: 0,
      updatedAt: new Date().toISOString(),
    };
  }

  try {
    const raw = localStorage.getItem(LOCAL_CART_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }

  const initial: CartData = {
    id: 'cart-local',
    token: 'tok-local',
    items: [],
    itemCount: 0,
    totalQuantity: 0,
    subtotalCents: 0,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(initial));
  return initial;
}

function saveLocalCart(cart: CartData): CartData {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
  }
  return cart;
}

// ─── Cart Operations ──────────────────────────────────────────────────────

export async function fetchCart(cartToken?: string): Promise<CartData | null> {
  try {
    const headers: Record<string, string> = {};
    if (cartToken) headers['x-cart-token'] = cartToken;

    const res = await fetch(`${API_BASE_URL}/cart`, {
      headers,
      cache: 'no-store',
    });

    if (res.ok) return await res.json();
  } catch {
    // fallback
  }

  return getLocalCart();
}

export async function addToCart(
  cartToken: string | undefined,
  variantId: string,
  quantity: number = 1
): Promise<CartData | null> {
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (cartToken) headers['x-cart-token'] = cartToken;

    const res = await fetch(`${API_BASE_URL}/cart/items`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ variantId, quantity }),
    });

    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback to local cart
  }

  // Find product & variant from Foundation catalogue
  let foundProduct: ProductDetailData | undefined;
  let foundVariant: any | undefined;

  for (const p of FOUNDATION_PRODUCTS) {
    const v = p.variants.find((vr) => vr.id === variantId);
    if (v) {
      foundProduct = p;
      foundVariant = v;
      break;
    }
  }

  const localCart = getLocalCart();
  const existingItemIndex = localCart.items.findIndex((item) => item.variantId === variantId);

  if (existingItemIndex > -1) {
    const current = localCart.items[existingItemIndex];
    const newQty = current.quantity + quantity;
    localCart.items[existingItemIndex] = {
      ...current,
      quantity: newQty,
      lineTotalCents: current.unitPriceCents * newQty,
    };
  } else if (foundProduct && foundVariant) {
    const newItem: CartItemData = {
      id: `ci-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      variantId: foundVariant.id,
      sku: foundVariant.sku,
      title: foundVariant.title,
      size: foundVariant.size,
      productName: foundProduct.name,
      productSlug: foundProduct.slug,
      imageUrl: foundProduct.images[0]?.url || null,
      metalPurity: foundProduct.metalPurity,
      unitPriceCents: foundVariant.priceCents,
      quantity,
      lineTotalCents: foundVariant.priceCents * quantity,
      inStock: true,
      maxStock: 99,
    };
    localCart.items.push(newItem);
  }

  localCart.totalQuantity = localCart.items.reduce((sum, it) => sum + it.quantity, 0);
  localCart.itemCount = localCart.items.length;
  localCart.subtotalCents = localCart.items.reduce((sum, it) => sum + it.lineTotalCents, 0);
  localCart.updatedAt = new Date().toISOString();

  return saveLocalCart(localCart);
}

export async function updateCartItem(
  cartToken: string,
  itemId: string,
  quantity: number
): Promise<CartData | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-cart-token': cartToken,
      },
      body: JSON.stringify({ quantity }),
    });

    if (res.ok) return await res.json();
  } catch {
    // fallback
  }

  const localCart = getLocalCart();
  const idx = localCart.items.findIndex((it) => it.id === itemId);

  if (idx > -1) {
    if (quantity <= 0) {
      localCart.items.splice(idx, 1);
    } else {
      localCart.items[idx].quantity = quantity;
      localCart.items[idx].lineTotalCents = localCart.items[idx].unitPriceCents * quantity;
    }
    localCart.totalQuantity = localCart.items.reduce((sum, it) => sum + it.quantity, 0);
    localCart.itemCount = localCart.items.length;
    localCart.subtotalCents = localCart.items.reduce((sum, it) => sum + it.lineTotalCents, 0);
    localCart.updatedAt = new Date().toISOString();
    return saveLocalCart(localCart);
  }

  return localCart;
}

export async function removeCartItem(cartToken: string, itemId: string): Promise<CartData | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
      method: 'DELETE',
      headers: { 'x-cart-token': cartToken },
    });

    if (res.ok) return await res.json();
  } catch {
    // fallback
  }

  const localCart = getLocalCart();
  localCart.items = localCart.items.filter((it) => it.id !== itemId);
  localCart.totalQuantity = localCart.items.reduce((sum, it) => sum + it.quantity, 0);
  localCart.itemCount = localCart.items.length;
  localCart.subtotalCents = localCart.items.reduce((sum, it) => sum + it.lineTotalCents, 0);
  localCart.updatedAt = new Date().toISOString();
  return saveLocalCart(localCart);
}

export async function clearCart(cartToken: string): Promise<CartData | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/cart`, {
      method: 'DELETE',
      headers: { 'x-cart-token': cartToken },
    });

    if (res.ok) return await res.json();
  } catch {
    // fallback
  }

  const emptyCart: CartData = {
    id: 'cart-local',
    token: 'tok-local',
    items: [],
    itemCount: 0,
    totalQuantity: 0,
    subtotalCents: 0,
    updatedAt: new Date().toISOString(),
  };
  return saveLocalCart(emptyCart);
}

// ─── Checkout & Order Tracking ─────────────────────────────────────────────

const ORDERS_KEY = 'argyros_local_orders';

export async function createOrder(payload: CheckoutPayload): Promise<OrderData> {
  try {
    const res = await fetch(`${API_BASE_URL}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback
  }

  const localCart = getLocalCart();
  const subtotalCents = localCart.subtotalCents || 289000;
  const shippingCents = subtotalCents >= 299900 ? 0 : 9900;
  const totalCents = subtotalCents + shippingCents;
  const orderNumber = `ARG-ORD-${Math.floor(100000 + Math.random() * 900000)}`;

  const orderData: OrderData = {
    id: `ord-${Date.now()}`,
    number: orderNumber,
    email: payload.customer.email,
    firstName: payload.customer.firstName,
    lastName: payload.customer.lastName,
    phone: payload.customer.phone || null,
    status: 'PAID',
    subtotalCents,
    shippingCents,
    taxCents: 0,
    totalCents,
    currency: 'INR',
    createdAt: new Date().toISOString(),
    shippingAddress: payload.shippingAddress,
    items: localCart.items.map((it) => ({
      id: it.id,
      variantId: it.variantId,
      sku: it.sku,
      name: it.productName,
      variantTitle: it.title,
      size: it.size,
      metalPurity: it.metalPurity,
      imageUrl: it.imageUrl,
      quantity: it.quantity,
      unitPriceCents: it.unitPriceCents,
      lineTotalCents: it.lineTotalCents,
    })),
  };

  // Clear local cart
  saveLocalCart({
    ...localCart,
    items: [],
    itemCount: 0,
    totalQuantity: 0,
    subtotalCents: 0,
  });

  // Store order in local storage for order confirmation lookup
  if (typeof window !== 'undefined') {
    try {
      const existingRaw = localStorage.getItem(ORDERS_KEY);
      const orders = existingRaw ? JSON.parse(existingRaw) : {};
      orders[orderNumber] = orderData;
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch {
      // ignore
    }
  }

  return orderData;
}

export async function fetchOrderByNumber(orderNumber: string): Promise<OrderData | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/${encodeURIComponent(orderNumber)}`, {
      cache: 'no-store',
    });

    if (res.ok) return await res.json();
  } catch {
    // fallback
  }

  if (typeof window !== 'undefined') {
    try {
      const existingRaw = localStorage.getItem(ORDERS_KEY);
      if (existingRaw) {
        const orders = JSON.parse(existingRaw);
        if (orders[orderNumber]) return orders[orderNumber];
      }
    } catch {
      // ignore
    }
  }

  return null;
}
