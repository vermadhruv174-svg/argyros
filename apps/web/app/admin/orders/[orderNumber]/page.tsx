'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getOrderDetail, transitionOrderStatus } from '@/lib/admin-api';
import { StatusBadge } from '@/components/ui/status-badge';

export default function OrderDetailPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const router = useRouter();
  const { orderNumber } = use(params);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [nextStatus, setNextStatus] = useState('');
  const [note, setNote] = useState('');

  const loadData = async () => {
    try {
      const data = await getOrderDetail(orderNumber);
      setOrder(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [orderNumber]);

  const handleStatusUpdate = async () => {
    if (!nextStatus) return;
    try {
      await transitionOrderStatus(orderNumber, nextStatus, note);
      setNextStatus('');
      setNote('');
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  if (loading) return <div className="p-8">Loading order...</div>;
  if (!order) return <div className="p-8">Order not found.</div>;

  const validTransitions: Record<string, string[]> = {
    PENDING: ['PAID'],
    PAID: ['PROCESSING'],
    PROCESSING: ['SHIPPED'],
    SHIPPED: ['DELIVERED'],
  };
  const allowedNext = validTransitions[order.status] || [];

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="text-gray-500 hover:text-ink text-sm uppercase tracking-wider font-bold">
          ← Back
        </button>
        <h1 className="font-display text-4xl">Order {order.number}</h1>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white border border-line rounded-lg shadow-sm overflow-hidden">
            <h2 className="font-display text-2xl px-6 py-4 border-b border-line bg-[#f0ede6]">Items</h2>
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3 text-center">Qty</th>
                  <th className="px-6 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {order.items?.map((item: any) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 flex gap-4">
                      {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-cover rounded bg-gray-100" />}
                      <div>
                        <div className="font-bold">{item.name}</div>
                        <div className="text-gray-500 text-xs">{item.variantTitle}</div>
                        <div className="text-gray-500 text-xs">SKU: {item.sku}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">{item.quantity}</td>
                    <td className="px-6 py-4 text-right font-bold">₹{(item.lineTotalCents / 100).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {allowedNext.length > 0 && (
            <div className="bg-white border border-line p-6 rounded-lg shadow-sm space-y-4">
              <h2 className="font-display text-2xl">Update Status</h2>
              <div className="flex gap-4">
                <select 
                  value={nextStatus} 
                  onChange={e => setNextStatus(e.target.value)}
                  className="flex-1 border border-line px-3 py-2 bg-transparent outline-none focus:border-gold"
                >
                  <option value="">Select next status...</option>
                  {allowedNext.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <input 
                  type="text" 
                  placeholder="Optional note" 
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  className="flex-1 border border-line px-3 py-2 bg-transparent outline-none focus:border-gold"
                />
                <button 
                  onClick={handleStatusUpdate}
                  disabled={!nextStatus}
                  className="bg-ink text-white px-6 py-2 font-bold uppercase tracking-wider hover:bg-gold transition-colors disabled:opacity-50"
                >
                  Update
                </button>
              </div>
            </div>
          )}

          <div className="bg-white border border-line p-6 rounded-lg shadow-sm space-y-4">
            <h2 className="font-display text-2xl">Timeline</h2>
            <div className="space-y-4 border-l-2 border-line ml-2 pl-4">
              {order.events?.map((e: any) => (
                <div key={e.id} className="relative">
                  <div className="absolute w-3 h-3 bg-gold rounded-full -left-[1.35rem] top-1.5" />
                  <div className="text-xs text-gray-500 uppercase tracking-wider">{new Date(e.createdAt).toLocaleString()}</div>
                  <div className="font-bold">{e.type.replace('STATUS_CHANGED_', 'Moved to ')}</div>
                  {e.payload?.note && <div className="text-gray-600 mt-1">{e.payload.note}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white border border-line p-6 rounded-lg shadow-sm space-y-4">
            <h2 className="font-display text-2xl border-b border-line pb-2">Customer</h2>
            <div>
              <div className="font-bold">{order.firstName} {order.lastName}</div>
              <div className="text-blue-600 hover:underline"><a href={`mailto:${order.email}`}>{order.email}</a></div>
              {order.phone && <div>{order.phone}</div>}
            </div>
            
            <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 pt-4 border-t border-line">Shipping Address</h3>
            <div className="text-sm">
              <div>{order.shippingAddress?.name || `${order.firstName} ${order.lastName}`}</div>
              <div>{order.shippingAddress?.line1}</div>
              {order.shippingAddress?.line2 && <div>{order.shippingAddress.line2}</div>}
              <div>{order.shippingAddress?.city}, {order.shippingAddress?.region} {order.shippingAddress?.postalCode}</div>
              <div>{order.shippingAddress?.country}</div>
            </div>
          </div>

          <div className="bg-white border border-line p-6 rounded-lg shadow-sm space-y-3 text-sm">
            <h2 className="font-display text-2xl border-b border-line pb-2 mb-4">Financials</h2>
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span>₹{(order.subtotalCents / 100).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Shipping</span>
              <span>₹{(order.shippingCents / 100).toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-line mt-2">
              <span>Total</span>
              <span>₹{(order.totalCents / 100).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
