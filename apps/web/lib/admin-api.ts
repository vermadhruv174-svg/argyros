import { getAccessToken } from '@/lib/auth-context';

const API_BASE_URL =
  typeof window !== 'undefined'
    ? '/api'
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';


async function adminFetch(path: string, options: RequestInit = {}) {
  const token = getAccessToken();
  const headers = new Headers(options.headers);
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  headers.set('Content-Type', 'application/json');

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!res.ok) {
    let message = 'API request failed';
    try {
      const data = await res.json();
      message = data.message || message;
    } catch (e) {}
    throw new Error(message);
  }

  // Not all responses have JSON body (e.g. 204 No Content), but assuming most do
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return res.json();
  }
  return null;
}

export async function getAdminStats() {
  return adminFetch('/admin/stats');
}

export async function getAdminProducts(page: number = 1, limit: number = 20, status?: string) {
  const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
  if (status && status !== 'ALL') params.set('status', status);
  return adminFetch(`/admin/products?${params.toString()}`);
}

export async function createProduct(data: any) {
  return adminFetch('/admin/products', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function publishProduct(id: string) {
  return adminFetch(`/admin/products/${id}/publish`, { method: 'POST' });
}

export async function archiveProduct(id: string) {
  return adminFetch(`/admin/products/${id}/archive`, { method: 'POST' });
}

export async function getAdminOrders(page: number = 1, limit: number = 20, status?: string) {
  const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
  if (status && status !== 'ALL') params.set('status', status);
  return adminFetch(`/admin/orders?${params.toString()}`);
}

export async function getOrderDetail(orderNumber: string) {
  return adminFetch(`/admin/orders/${orderNumber}`);
}

export async function transitionOrderStatus(orderNumber: string, status: string, note?: string) {
  return adminFetch(`/admin/orders/${orderNumber}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, note }),
  });
}

export async function getLowStock(threshold: number = 5) {
  return adminFetch(`/admin/inventory/low-stock?threshold=${threshold}`);
}

export async function updateStock(variantId: string, stock: number) {
  return adminFetch(`/admin/inventory/variants/${variantId}/stock`, {
    method: 'PATCH',
    body: JSON.stringify({ stock }),
  });
}

export async function getBespokeInquiries() {
  return adminFetch('/bespoke/admin/all');
}

export async function updateBespokeStatus(id: string, status: string, adminNotes?: string) {
  return adminFetch(`/bespoke/admin/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, adminNotes }),
  });
}

