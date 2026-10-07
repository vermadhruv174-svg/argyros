'use client';

import { useEffect, useState } from 'react';
import { getAdminStats, getLowStock } from '@/lib/admin-api';
import { StatusBadge } from '@/components/ui/status-badge';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, stockData] = await Promise.all([
          getAdminStats(),
          getLowStock(5),
        ]);
        setStats(statsData);
        setLowStock(stockData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <h1 className="font-display text-4xl mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-line p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Total Orders</h3>
          <p className="text-3xl font-display">{stats?.totalOrders}</p>
        </div>
        <div className="bg-white border border-line p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Orders Today</h3>
          <p className="text-3xl font-display">{stats?.ordersToday}</p>
        </div>
        <div className="bg-white border border-line p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Total Revenue</h3>
          <p className="text-3xl font-display">₹{((stats?.totalRevenueCents || 0) / 100).toLocaleString()}</p>
        </div>
        <div className="bg-white border border-line p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Pending Orders</h3>
          <p className="text-3xl font-display">{stats?.pendingOrders}</p>
        </div>
      </div>

      <div className="bg-white border border-line rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-line bg-[#f0ede6] flex justify-between items-center">
          <h2 className="font-display text-2xl">Low Stock Alert</h2>
          <Link href="/admin/inventory" className="text-gold text-sm font-bold uppercase tracking-wider hover:underline">
            View All
          </Link>
        </div>
        {lowStock.length > 0 ? (
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-6 py-3 font-semibold">Product</th>
                <th className="px-6 py-3 font-semibold">Variant SKU</th>
                <th className="px-6 py-3 font-semibold">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {lowStock.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{item.product.name}</td>
                  <td className="px-6 py-4">{item.sku}</td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-red-600">{item.stock}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-6 text-gray-500">No low stock items.</div>
        )}
      </div>
    </div>
  );
}
