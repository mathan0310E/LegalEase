import React, { useState } from 'react';
import { X, Sparkles, Loader2, ArrowRight, Check } from 'lucide-react';
import { documentApi } from '../services/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  documentId: number;
  sectionId: string;
  currentHeading: string;
  currentContent: string;
  onSuccess: (updatedHeading: string, updatedContent: string) => void;
}

export const RegenerateClauseModal: React.FC<Props> = ({
  isOpen,
  onClose,
  documentId,
  sectionId,
  currentHeading,
  currentContent,
  onSuccess,
}) => {
  const [instruction, setInstruction] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ updated_heading: string; updated_content: string; explanation: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickPrompts = [
    'Make obligations mutual and reciprocal',
    'Add specific 30-day cure period for breach',
    'Include strict injunctive relief for confidentiality breach',
    'Clarify intellectual property ownership rights',
    'Simplify phrasing without altering legal effect',
  ];

  const handleRegenerate = async (customInstruction?: string) => {
    const promptToUse = customInstruction || instruction;
    if (!promptToUse.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await documentApi.regenerateSection(documentId, {
        section_id: sectionId,
        current_heading: currentHeading,
        current_content: currentContent,
        instruction: promptToUse,
      });
      setResult(res);
    } catch (err) {
      console.error('Failed to regenerate section:', err);
      setError('Failed to refine clause. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (result) {
      onSuccess(result.updated_heading, result.updated_content);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl rounded-2xl glass-panel border border-slate-700 shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center shadow-glow">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Refine Clause with AI</h3>
              <p className="text-xs text-slate-400">Targeted clause rewrite & enhancement</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto py-4 space-y-4 pr-1">
          {/* Current Heading & Content */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Selected Section
            </span>
            <h4 className="text-xs font-semibold text-brand-300">{currentHeading}</h4>
            <p className="text-xs text-slate-300 mt-1 line-clamp-3">"{currentContent}"</p>
          </div>

          {/* Quick suggestions */}
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">
              Quick Suggestions
            </label>
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setInstruction(p);
                    handleRegenerate(p);
                  }}
                  className="px-2.5 py-1 rounded-full text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/80 transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Instruction Input */}
          <div>
            <label className="text-xs font-semibold text-slate-200 block mb-1">
              Custom Instruction
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder="e.g. Expand definition to cover proprietary neural network weights..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                onKeyDown={(e) => e.key === 'Enter' && handleRegenerate()}
              />
              <button
                type="button"
                disabled={loading || !instruction.trim()}
                onClick={() => handleRegenerate()}
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-glow shrink-0"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Refine</span>
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-rose-400 bg-rose-950/30 p-2.5 rounded-lg border border-rose-800/40">
              {error}
            </p>
          )}

          {/* Result Preview */}
          {result && (
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Proposed Revision</span>
                </span>
                <span className="text-[11px] text-slate-400 italic">{result.explanation}</span>
              </div>
              <h5 className="text-xs font-semibold text-white">{result.updated_heading}</h5>
              <div className="p-3 rounded-lg bg-slate-900/90 text-xs text-slate-200 leading-relaxed border border-slate-800 whitespace-pre-wrap">
                {result.updated_content}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          {result && (
            <button
              type="button"
              onClick={handleApply}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-glow transition-all"
            >
              <span>Accept & Apply to Document</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
