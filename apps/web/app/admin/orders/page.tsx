'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAdminOrders } from '@/lib/admin-api';
import { StatusBadge } from '@/components/ui/status-badge';

export default function OrdersPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const result = await getAdminOrders(page, 20, statusFilter);
        setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [page, statusFilter]);

  const statuses = ['ALL', 'PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <h1 className="font-display text-4xl">Orders</h1>

      <div className="flex gap-4 border-b border-line">
        {statuses.map(status => (
          <button
            key={status}
            onClick={() => { setStatusFilter(status); setPage(1); }}
            className={`pb-2 px-1 text-sm font-bold uppercase tracking-wider ${
              statusFilter === status ? 'border-b-2 border-gold text-ink' : 'text-gray-500 hover:text-ink'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="bg-white border border-line shadow-sm overflow-hidden rounded-lg">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading orders...</div>
        ) : !data || data.data.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No orders found.</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-6 py-3 font-semibold">Order</th>
                <th className="px-6 py-3 font-semibold">Customer</th>
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Items</th>
                <th className="px-6 py-3 font-semibold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {data.data.map((o: any) => (
                <tr key={o.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => window.location.href = `/admin/orders/${o.number}`}>
                  <td className="px-6 py-4 font-bold">{o.number}</td>
                  <td className="px-6 py-4">
                    <div>{o.firstName} {o.lastName}</div>
                    <div className="text-xs text-gray-500">{o.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="px-6 py-4">{o.items?.length || 0}</td>
                  <td className="px-6 py-4 font-bold">₹{(o.totalCents / 100).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {data && data.total > data.limit && (
        <div className="flex gap-4 items-center justify-center pt-4">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 border border-line disabled:opacity-50 hover:bg-gray-50">Prev</button>
          <span>Page {page}</span>
          <button disabled={page * data.limit >= data.total} onClick={() => setPage(p => p + 1)} className="px-4 py-2 border border-line disabled:opacity-50 hover:bg-gray-50">Next</button>
        </div>
      )}
    </div>
  );
}
