'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAdminProducts, publishProduct, archiveProduct } from '@/lib/admin-api';
import { StatusBadge } from '@/components/ui/status-badge';

export default function ProductsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await getAdminProducts(page, 20, statusFilter);
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, statusFilter]);

  const handleAction = async (id: string, action: 'publish' | 'archive') => {
    try {
      if (action === 'publish') await publishProduct(id);
      if (action === 'archive') await archiveProduct(id);
      await loadData();
    } catch (err) {
      console.error(err);
      alert('Action failed');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-display text-4xl">Products</h1>
        <Link href="/admin/products/new" className="bg-ink text-white px-4 py-2 text-sm font-bold uppercase tracking-wider hover:bg-gold transition-colors">
          Add Product
        </Link>
      </div>

      <div className="flex gap-4 border-b border-line">
        {['ALL', 'ACTIVE', 'DRAFT', 'ARCHIVED'].map(status => (
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
          <div className="p-8 text-center text-gray-500">Loading products...</div>
        ) : !data || data.data.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No products found.</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-6 py-3 font-semibold">Product</th>
                <th className="px-6 py-3 font-semibold">Category</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Stock</th>
                <th className="px-6 py-3 font-semibold">Price (From)</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {data.data.map((p: any) => {
                const totalStock = p.variants.reduce((acc: number, v: any) => acc + v.stock, 0);
                const minPrice = Math.min(...p.variants.map((v: any) => v.priceCents));
                
                return (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 flex items-center gap-3">
                      {p.images?.[0]?.url && (
                        <img src={p.images[0].url} alt={p.name} className="w-10 h-10 object-cover rounded bg-gray-100" />
                      )}
                      <div>
                        <div className="font-bold">{p.name}</div>
                        <div className="text-xs text-gray-500">{p.slug}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 capitalize">{p.category}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-6 py-4">{totalStock}</td>
                    <td className="px-6 py-4">₹{(minPrice / 100).toLocaleString()}</td>
                    <td className="px-6 py-4 text-right space-x-3 text-sm">
                      <Link href={`/admin/products/${p.id}`} className="text-gold hover:underline">Edit</Link>
                      {p.status === 'DRAFT' && (
                        <button onClick={() => handleAction(p.id, 'publish')} className="text-emerald-600 hover:underline">Publish</button>
                      )}
                      {p.status === 'ACTIVE' && (
                        <button onClick={() => handleAction(p.id, 'archive')} className="text-gray-500 hover:underline">Archive</button>
                      )}
                    </td>
                  </tr>
                );
              })}
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
