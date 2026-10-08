import React from 'react';
import { siteConfig } from '@argyros/config';
import { AlertCircle } from 'lucide-react';

export function LegalDraftBanner() {
  if (siteConfig.legal.status !== 'draft') {
    return null;
  }

  return (
    <div
      role="status"
      className="mb-8 p-4 bg-amber-50/90 border border-amber-300 rounded-[2px] text-amber-900 text-xs flex items-start gap-3 shadow-sm"
    >
      <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
      <div>
        <p className="font-bold uppercase tracking-wider text-[11px] text-amber-950">
          Draft Legal Document — Pending Owner Review
        </p>
        <p className="mt-1 leading-relaxed text-amber-800">
          This policy is currently in review status. Legal entity details, registered addresses, and statutory grievance designations contain placeholder values that will be finalized prior to live customer transactions.
        </p>
      </div>
    </div>
  );
}
