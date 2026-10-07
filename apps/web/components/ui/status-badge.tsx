import React from 'react';

const statusConfig = {
  ACTIVE:      { label: 'Active',      className: 'bg-emerald-100 text-emerald-800' },
  DRAFT:       { label: 'Draft',       className: 'bg-amber-100 text-amber-800' },
  ARCHIVED:    { label: 'Archived',    className: 'bg-neutral-100 text-neutral-500' },
  PENDING:     { label: 'Pending',     className: 'bg-amber-100 text-amber-800' },
  PAID:        { label: 'Paid',        className: 'bg-blue-100 text-blue-800' },
  PROCESSING:  { label: 'Processing',  className: 'bg-purple-100 text-purple-800' },
  SHIPPED:     { label: 'Shipped',     className: 'bg-indigo-100 text-indigo-800' },
  DELIVERED:   { label: 'Delivered',   className: 'bg-emerald-100 text-emerald-800' },
  CANCELLED:   { label: 'Cancelled',   className: 'bg-red-100 text-red-800' },
  REFUNDED:    { label: 'Refunded',    className: 'bg-red-100 text-red-800' },
  RECEIVED:      { label: 'Received',      className: 'bg-amber-100 text-amber-800' },
  IN_DISCUSSION: { label: 'In Discussion', className: 'bg-blue-100 text-blue-800' },
  CAD_ESTIMATE:  { label: 'CAD & Estimate',className: 'bg-purple-100 text-purple-800' },
  IN_MAKING:     { label: 'In Making',     className: 'bg-amber-100 text-amber-900 border border-amber-300' },
  COMPLETED:     { label: 'Completed',     className: 'bg-emerald-100 text-emerald-800' },
  DECLINED:      { label: 'Declined',      className: 'bg-neutral-200 text-neutral-700' },
};

export function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status as keyof typeof statusConfig] ?? { label: status, className: 'bg-gray-100 text-gray-700' };
  return (
    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}
