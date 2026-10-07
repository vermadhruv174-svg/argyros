'use client';

import { useEffect, useState } from 'react';
import { getAdminProducts, getLowStock, updateStock } from '@/lib/admin-api';

export default function InventoryPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      if (filterLowStock) {
        const result = await getLowStock(5);
        setData(result);
      } else {
        const result = await getAdminProducts(1, 100); // For demo, getting first 100 products
        // Flatten variants
        const variants = result.data.flatMap((p: any) => 
          p.variants.map((v: any) => ({ ...v, product: p }))
        );
        setData(variants);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filterLowStock]);

  const handleStockUpdate = async (variantId: string, newStock: number) => {
    if (newStock < 0) return;
    setUpdatingId(variantId);
    try {
      await updateStock(variantId, newStock);
      // Update local state without full reload
      setData(prev => prev.map(v => v.id === variantId ? { ...v, stock: newStock } : v));
    } catch (err: any) {
      alert(err.message || 'Failed to update stock');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-display text-4xl">Inventory</h1>
        <div className="flex items-center gap-2">
          <input 
            type="checkbox" 
            id="low-stock" 
            checked={filterLowStock} 
            onChange={e => setFilterLowStock(e.target.checked)} 
            className="w-4 h-4 text-gold focus:ring-gold"
          />
          <label htmlFor="low-stock" className="text-sm font-bold uppercase tracking-wider text-gray-700 cursor-pointer">
            Show Low Stock (≤ 5) Only
          </label>
        </div>
      </div>

      <div className="bg-white border border-line shadow-sm overflow-hidden rounded-lg">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading inventory...</div>
        ) : data.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No variants found.</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-6 py-3 font-semibold">Product</th>
                <th className="px-6 py-3 font-semibold">Variant SKU</th>
                <th className="px-6 py-3 font-semibold">Title</th>
                <th className="px-6 py-3 font-semibold">Current Stock</th>
                <th className="px-6 py-3 font-semibold">Update Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {data.map((item: any) => {
                const isLow = item.stock <= 5;
                return (
                  <tr key={item.id} className={`${isLow ? 'bg-red-50/50 hover:bg-red-50' : 'hover:bg-gray-50'}`}>
                    <td className="px-6 py-4 font-bold">{item.product?.name}</td>
                    <td className="px-6 py-4">{item.sku}</td>
                    <td className="px-6 py-4">{item.title}</td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${isLow ? 'text-red-600' : 'text-emerald-600'}`}>
                        {item.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 items-center">
                        <input 
                          type="number" 
                          min="0"
                          defaultValue={item.stock}
                          id={`stock-${item.id}`}
                          className="w-20 border border-line px-2 py-1 bg-white outline-none focus:border-gold"
                        />
                        <button 
                          disabled={updatingId === item.id}
                          onClick={() => {
                            const input = document.getElementById(`stock-${item.id}`) as HTMLInputElement;
                            handleStockUpdate(item.id, parseInt(input.value || '0', 10));
                          }}
                          className="bg-ink text-white px-3 py-1 text-xs font-bold uppercase tracking-wider hover:bg-gold transition-colors disabled:opacity-50"
                        >
                          {updatingId === item.id ? '...' : 'Update'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
