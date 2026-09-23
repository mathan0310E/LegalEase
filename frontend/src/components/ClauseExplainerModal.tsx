import React, { useState, useEffect } from 'react';
import { X, Sparkles, AlertCircle, CheckCircle2, HelpCircle, ShieldAlert, Loader2 } from 'lucide-react';
import { aiApi } from '../services/api';
import { ExplainClauseResponse } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  clauseTitle: string;
  clauseContent: string;
}

export const ClauseExplainerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  clauseTitle,
  clauseContent,
}) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ExplainClauseResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && clauseTitle && clauseContent) {
      setLoading(true);
      setError(null);
      aiApi
        .explainClause({
          clause_title: clauseTitle,
          clause_content: clauseContent,
        })
        .then((res) => {
          setData(res);
        })
        .catch((err) => {
          console.error('Failed to explain clause:', err);
          setError('AI service is temporarily unavailable. Please try again.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, clauseTitle, clauseContent]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl rounded-2xl glass-panel border border-slate-700 shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-brand-500 flex items-center justify-center shadow-glow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">AI Clause Explainer</h3>
              <p className="text-xs text-slate-400">Plain-language legal obligation analysis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto py-4 space-y-4 pr-1">
          {/* Target Clause Preview */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Analyzing Clause
            </span>
            <h4 className="text-sm font-semibold text-brand-300">{clauseTitle}</h4>
            <p className="text-xs text-slate-300 mt-1 line-clamp-3 italic">
              "{clauseContent}"
            </p>
          </div>

          {loading && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
              <p className="text-xs text-slate-300">
                Gemini AI is analyzing contractual obligations and conditions...
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!loading && data && (
            <div className="space-y-4">
              {/* Summary */}
              <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20">
                <h5 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Plain Language Meaning</span>
                </h5>
                <p className="text-xs leading-relaxed text-slate-200">{data.summary}</p>
              </div>

              {/* Obligations */}
              {data.obligations && data.obligations.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <h5 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-brand-400" />
                    <span>What Obligations Does This Create?</span>
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                    {data.obligations.map((item, idx) => (
                      <li key={idx} className="leading-relaxed">{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Conditions */}
              {data.key_conditions && data.key_conditions.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <h5 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                    Key Conditions & Exceptions
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                    {data.key_conditions.map((item, idx) => (
                      <li key={idx} className="leading-relaxed">{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Review Considerations */}
              {data.review_considerations && data.review_considerations.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20">
                  <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                    <span>Areas to Review With Legal Counsel</span>
                  </h5>
                  <ul className="space-y-1.5 text-xs text-amber-200/90 list-disc list-inside">
                    {data.review_considerations.map((item, idx) => (
                      <li key={idx} className="leading-relaxed">{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Disclaimer */}
              <p className="text-[10px] text-slate-400 italic text-center pt-2">
                {data.disclaimer}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
