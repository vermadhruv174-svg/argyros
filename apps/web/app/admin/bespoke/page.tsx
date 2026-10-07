'use client';

import { useEffect, useState } from 'react';
import { getBespokeInquiries, updateBespokeStatus } from '@/lib/admin-api';
import { StatusBadge } from '@/components/ui/status-badge';

interface BespokeInquiry {
  id: string;
  referenceNumber: string;
  fullName: string;
  email: string;
  phone: string;
  category: string;
  finish: string;
  budgetTier?: string | null;
  estimatedSize?: string | null;
  engraving?: string | null;
  targetDate?: string | null;
  description: string;
  imageUrls: string[];
  status: 'RECEIVED' | 'IN_DISCUSSION' | 'CAD_ESTIMATE' | 'IN_MAKING' | 'COMPLETED' | 'DECLINED';
  adminNotes?: string | null;
  createdAt: string;
  updatedAt: string;
}

const ALL_STATUSES = [
  'ALL',
  'RECEIVED',
  'IN_DISCUSSION',
  'CAD_ESTIMATE',
  'IN_MAKING',
  'COMPLETED',
  'DECLINED',
];

export default function AdminBespokePage() {
  const [inquiries, setInquiries] = useState<BespokeInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<BespokeInquiry | null>(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [notesInput, setNotesInput] = useState('');
  const [statusInput, setStatusInput] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    loadInquiries();
  }, []);

  async function loadInquiries() {
    setLoading(true);
    try {
      const data = await getBespokeInquiries();
      if (Array.isArray(data)) {
        setInquiries(data);
      }
    } catch (err) {
      console.error('Failed to load bespoke inquiries:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleSelect(inq: BespokeInquiry) {
    setSelectedInquiry(inq);
    setStatusInput(inq.status);
    setNotesInput(inq.adminNotes || '');
    setFeedbackMsg('');
  }

  async function handleStatusUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedInquiry) return;

    setUpdatingId(selectedInquiry.id);
    setFeedbackMsg('');
    try {
      const updated = await updateBespokeStatus(
        selectedInquiry.id,
        statusInput,
        notesInput.trim() || undefined
      );
      setFeedbackMsg('Commission status updated successfully.');
      
      // Update local state
      setInquiries((prev) =>
        prev.map((item) => (item.id === selectedInquiry.id ? { ...item, ...updated } : item))
      );
      setSelectedInquiry((prev) => (prev ? { ...prev, ...updated } : null));
    } catch (err: any) {
      setFeedbackMsg(err.message || 'Failed to update commission.');
    } finally {
      setUpdatingId(null);
    }
  }

  const filtered = inquiries.filter((inq) => {
    if (statusFilter === 'ALL') return true;
    return inq.status === statusFilter;
  });

  const stats = {
    total: inquiries.length,
    received: inquiries.filter((i) => i.status === 'RECEIVED').length,
    inDiscussion: inquiries.filter((i) => i.status === 'IN_DISCUSSION').length,
    inMaking: inquiries.filter((i) => i.status === 'IN_MAKING').length,
    completed: inquiries.filter((i) => i.status === 'COMPLETED').length,
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Page Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-gold font-bold">
            Concierge Management
          </span>
          <h1 className="font-display text-4xl text-ink mt-1">Bespoke Atelier Inquiries</h1>
          <p className="text-sm text-gray-600 mt-1">
            Track custom silver commissions, review sketch uploads, and update karigar crafting stages.
          </p>
        </div>
        <button
          onClick={loadInquiries}
          className="px-4 py-2 border border-line text-xs font-semibold uppercase tracking-wider hover:bg-gray-100 transition rounded"
        >
          ↻ Refresh List
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 border border-line rounded-lg">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Total Commissions</p>
          <p className="font-display text-3xl font-semibold mt-1">{stats.total}</p>
        </div>
        <div className="bg-white p-4 border border-line rounded-lg">
          <p className="text-xs text-amber-600 uppercase tracking-wider">New Inquiries</p>
          <p className="font-display text-3xl font-semibold mt-1 text-amber-600">{stats.received}</p>
        </div>
        <div className="bg-white p-4 border border-line rounded-lg">
          <p className="text-xs text-blue-600 uppercase tracking-wider">In Discussion</p>
          <p className="font-display text-3xl font-semibold mt-1 text-blue-600">{stats.inDiscussion}</p>
        </div>
        <div className="bg-white p-4 border border-line rounded-lg">
          <p className="text-xs text-amber-700 uppercase tracking-wider">At Karigar (In Making)</p>
          <p className="font-display text-3xl font-semibold mt-1 text-amber-700">{stats.inMaking}</p>
        </div>
        <div className="bg-white p-4 border border-line rounded-lg">
          <p className="text-xs text-emerald-600 uppercase tracking-wider">Completed</p>
          <p className="font-display text-3xl font-semibold mt-1 text-emerald-600">{stats.completed}</p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 border-b border-line overflow-x-auto pb-1">
        {ALL_STATUSES.map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`pb-2 px-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
              statusFilter === st
                ? 'border-b-2 border-gold text-ink'
                : 'text-gray-500 hover:text-ink'
            }`}
          >
            {st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Content Layout: Inquiries Table + Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Table Area */}
        <div className={`space-y-4 ${selectedInquiry ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
          <div className="bg-white border border-line rounded-lg shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-gray-500 font-sans">
                Loading atelier commissions...
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center text-gray-500 font-sans">
                No bespoke inquiries found for this filter.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50/75 border-b border-line text-xs uppercase tracking-wider text-gray-500 font-semibold">
                    <tr>
                      <th className="px-5 py-3">Reference</th>
                      <th className="px-5 py-3">Client</th>
                      <th className="px-5 py-3">Category / Finish</th>
                      <th className="px-5 py-3">Budget</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {filtered.map((inq) => {
                      const isSelected = selectedInquiry?.id === inq.id;
                      return (
                        <tr
                          key={inq.id}
                          onClick={() => handleSelect(inq)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? 'bg-gold/10' : 'hover:bg-gray-50'
                          }`}
                        >
                          <td className="px-5 py-4 font-mono font-bold text-xs text-ink">
                            {inq.referenceNumber}
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-semibold text-ink leading-tight">{inq.fullName}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{inq.phone}</p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-ink font-medium leading-tight">{inq.category}</p>
                            <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[140px]">{inq.finish}</p>
                          </td>
                          <td className="px-5 py-4 text-xs font-medium text-ink">
                            {inq.budgetTier || '—'}
                          </td>
                          <td className="px-5 py-4">
                            <StatusBadge status={inq.status} />
                          </td>
                          <td className="px-5 py-4 text-xs text-gray-500 whitespace-nowrap">
                            {new Date(inq.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Selected Commission Drawer */}
        {selectedInquiry && (
          <div className="lg:col-span-5 bg-white border border-line rounded-lg shadow-sm p-6 space-y-6">
            <div className="flex items-start justify-between border-b border-line pb-4">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-gold font-bold">
                  Commission Docket
                </span>
                <h2 className="font-display text-2xl text-ink leading-tight mt-0.5">
                  {selectedInquiry.referenceNumber}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Logged on {new Date(selectedInquiry.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="text-gray-400 hover:text-ink text-sm p-1 rounded"
              >
                ✕ Close
              </button>
            </div>

            {/* Client Info & Direct Fast-Track */}
            <div className="bg-paper p-4 rounded border border-line space-y-2">
              <h3 className="text-xs uppercase font-bold tracking-wider text-gray-600">Client Details</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">Name:</span>{' '}
                  <strong className="text-ink block">{selectedInquiry.fullName}</strong>
                </div>
                <div>
                  <span className="text-gray-500">Email:</span>{' '}
                  <a href={`mailto:${selectedInquiry.email}`} className="text-gold underline block truncate">
                    {selectedInquiry.email}
                  </a>
                </div>
                <div>
                  <span className="text-gray-500">Phone:</span>{' '}
                  <a href={`tel:${selectedInquiry.phone}`} className="text-ink font-mono block">
                    {selectedInquiry.phone}
                  </a>
                </div>
                <div>
                  <span className="text-gray-500">WhatsApp:</span>{' '}
                  <a
                    href={`https://wa.me/${selectedInquiry.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                      selectedInquiry.fullName
                    )},%20this%20is%20the%20Argyros%20925%20Bespoke%20Atelier%20team%20regarding%20your%20commission%20${selectedInquiry.referenceNumber}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-0.5 px-2 py-0.5 bg-emerald-600 text-white font-medium rounded text-[11px]"
                  >
                    Open Chat 💬
                  </a>
                </div>
              </div>
            </div>

            {/* Commission Specifications */}
            <div className="space-y-3">
              <h3 className="text-xs uppercase font-bold tracking-wider text-gray-600">Design Specifications</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-gray-50 rounded border border-line/60">
                  <span className="text-gray-500 block">Category</span>
                  <span className="font-semibold text-ink text-sm">{selectedInquiry.category}</span>
                </div>
                <div className="p-2.5 bg-gray-50 rounded border border-line/60">
                  <span className="text-gray-500 block">Silver Finish</span>
                  <span className="font-semibold text-ink text-sm">{selectedInquiry.finish}</span>
                </div>
                <div className="p-2.5 bg-gray-50 rounded border border-line/60">
                  <span className="text-gray-500 block">Budget Tier</span>
                  <span className="font-semibold text-ink text-sm">{selectedInquiry.budgetTier || 'Custom / Flexible'}</span>
                </div>
                <div className="p-2.5 bg-gray-50 rounded border border-line/60">
                  <span className="text-gray-500 block">Sizing / Measurements</span>
                  <span className="font-semibold text-ink text-sm">{selectedInquiry.estimatedSize || 'Not specified'}</span>
                </div>
              </div>

              {selectedInquiry.engraving && (
                <div className="p-2.5 bg-gold/5 rounded border border-gold/30 text-xs">
                  <span className="text-gold font-bold block uppercase tracking-wider text-[10px]">Requested Engraving</span>
                  <span className="font-serif italic text-sm text-ink font-semibold">"{selectedInquiry.engraving}"</span>
                </div>
              )}

              {selectedInquiry.targetDate && (
                <div className="text-xs text-gray-600">
                  <span className="font-semibold text-ink">Target Delivery:</span> {selectedInquiry.targetDate}
                </div>
              )}
            </div>

            {/* Design Brief Description */}
            <div className="space-y-1">
              <h3 className="text-xs uppercase font-bold tracking-wider text-gray-600">Client Vision & Brief</h3>
              <div className="p-3 bg-gray-50 rounded border border-line text-xs leading-relaxed text-ink whitespace-pre-wrap">
                {selectedInquiry.description}
              </div>
            </div>

            {/* Uploaded Reference Visuals */}
            {selectedInquiry.imageUrls && selectedInquiry.imageUrls.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs uppercase font-bold tracking-wider text-gray-600">
                  Reference Visuals & Sketches ({selectedInquiry.imageUrls.length})
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {selectedInquiry.imageUrls.map((url, i) => (
                    <div
                      key={i}
                      onClick={() => setPreviewImage(url)}
                      className="aspect-square bg-gray-100 rounded border border-line overflow-hidden cursor-pointer hover:opacity-85 transition relative group"
                    >
                      <img src={url} alt={`Sketch ${i + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-semibold">
                        View
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Atelier Workflow & Karigar Status Updater */}
            <form onSubmit={handleStatusUpdate} className="space-y-4 pt-4 border-t border-line">
              <h3 className="text-xs uppercase font-bold tracking-wider text-gray-600">
                Update Commission Stage
              </h3>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
                <select
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-line rounded bg-white focus:outline-none focus:border-gold"
                >
                  <option value="RECEIVED">RECEIVED (New Submission)</option>
                  <option value="IN_DISCUSSION">IN_DISCUSSION (Client Consultation)</option>
                  <option value="CAD_ESTIMATE">CAD_ESTIMATE (3D CAD & Formal Quote)</option>
                  <option value="IN_MAKING">IN_MAKING (Crafting at Karigar Workshop)</option>
                  <option value="COMPLETED">COMPLETED (Hallmarked & Delivered)</option>
                  <option value="DECLINED">DECLINED (Archived)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Atelier & Karigar Internal Notes
                </label>
                <textarea
                  rows={3}
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="e.g. Master Karigar Ramesh assigned. 925 casting complete, setting moissanite on Tuesday..."
                  className="w-full p-2.5 text-xs border border-line rounded bg-white focus:outline-none focus:border-gold"
                />
              </div>

              {feedbackMsg && (
                <p className="text-xs font-medium text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-200">
                  {feedbackMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={updatingId === selectedInquiry.id}
                className="w-full py-2.5 bg-ink text-white font-semibold text-xs uppercase tracking-wider hover:bg-gold transition rounded disabled:opacity-50"
              >
                {updatingId === selectedInquiry.id ? 'Updating Atelier Record...' : 'Save Status & Notes'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
        >
          <div className="relative max-w-3xl max-h-[90vh]">
            <img src={previewImage} alt="Reference Preview" className="max-w-full max-h-[85vh] object-contain rounded" />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-10 right-0 text-white text-sm font-semibold hover:text-gold"
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
