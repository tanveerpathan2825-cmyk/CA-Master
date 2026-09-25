import React from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  compact?: boolean;
}

export const LegalDisclaimerBanner: React.FC<Props> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="bg-amber-50/80 border-b border-amber-200/60 px-4 py-2 text-[11px] text-amber-900 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 truncate">
          <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span className="truncate">
            Independent educational aid. Not affiliated with ICAI. Verify tax & legal provisions from official ICAI publications.
          </span>
        </div>
        <span className="shrink-0 text-[10px] text-amber-700 font-medium">No pass guarantee</span>
      </div>
    );
  }

  return (
    <aside aria-label="Educational and Legal Disclaimer" className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600 space-y-1">
      <div className="flex items-center gap-2 font-medium text-slate-800">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
        <span>Educational & Legal Disclaimer</span>
      </div>
      <p className="leading-relaxed text-[11px] text-slate-500">
        This application is an independent educational and preparation tool. It is not affiliated with, endorsed by, or officially associated with the Institute of Chartered Accountants of India (ICAI) unless explicitly stated. Educational, tax, legal, accounting, and regulatory information may change. Students should verify current requirements and official notifications from authoritative sources. This app provides structured study assistance and does not guarantee passing examination results.
      </p>
    </aside>
  );
};
