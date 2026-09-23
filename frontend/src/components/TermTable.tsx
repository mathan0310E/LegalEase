import React from 'react';
import { ImportantTermItem } from '../types';
import { Bookmark, ShieldAlert, Calendar, DollarSign, Scale, Clock, Tag } from 'lucide-react';

interface Props {
  terms: ImportantTermItem[];
}

export const TermTable: React.FC<Props> = ({ terms }) => {
  if (!terms || terms.length === 0) {
    return (
      <div className="p-6 text-center text-slate-400 text-sm border border-slate-800 rounded-xl bg-slate-900/40">
        No specific terms extracted for this document.
      </div>
    );
  }

  const getCategoryIcon = (category?: string, term?: string) => {
    const lower = ((category || '') + ' ' + (term || '')).toLowerCase();
    if (lower.includes('date') || lower.includes('duration') || lower.includes('term')) {
      return <Calendar className="w-3.5 h-3.5 text-sky-400" />;
    }
    if (lower.includes('pay') || lower.includes('compensation') || lower.includes('fee') || lower.includes('money')) {
      return <DollarSign className="w-3.5 h-3.5 text-emerald-400" />;
    }
    if (lower.includes('law') || lower.includes('jurisdiction') || lower.includes('court')) {
      return <Scale className="w-3.5 h-3.5 text-purple-400" />;
    }
    if (lower.includes('notice') || lower.includes('termination')) {
      return <Clock className="w-3.5 h-3.5 text-amber-400" />;
    }
    if (lower.includes('injunct') || lower.includes('remedy') || lower.includes('indem')) {
      return <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />;
    }
    return <Tag className="w-3.5 h-3.5 text-slate-400" />;
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/50 shadow-md">
      <div className="px-4 py-3 bg-slate-850/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bookmark className="w-4 h-4 text-brand-400" />
          <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Extracted Key Legal Terms
          </h3>
        </div>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 font-medium">
          {terms.length} Parameters Identified
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/80">
              <th className="py-2.5 px-4 font-semibold w-1/3">Contract Parameter</th>
              <th className="py-2.5 px-4 font-semibold">Extracted Value</th>
              <th className="py-2.5 px-4 font-semibold w-24 text-right">Scope</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {terms.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-2.5 px-4 flex items-center space-x-2 font-medium text-slate-200">
                  <span className="p-1 rounded bg-slate-800/80 border border-slate-700/50">
                    {getCategoryIcon(item.category, item.term)}
                  </span>
                  <span>{item.term}</span>
                </td>
                <td className="py-2.5 px-4 text-slate-300 font-mono text-[11px] font-normal">
                  <span className="px-2 py-0.5 rounded bg-slate-800/60 border border-slate-700/60 inline-block max-w-md truncate">
                    {item.value}
                  </span>
                </td>
                <td className="py-2.5 px-4 text-right">
                  <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {item.category || 'General'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
