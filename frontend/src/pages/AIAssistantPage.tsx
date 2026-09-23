import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  CheckCircle2,
  HelpCircle,
  ShieldAlert,
  Loader2,
  AlertCircle,
  FileText,
  Send
} from 'lucide-react';
import { aiApi } from '../services/api';
import { ExplainClauseResponse } from '../types';
import { LegalDisclaimerBanner } from '../components/LegalDisclaimerBanner';

export const AIAssistantPage: React.FC = () => {
  const [clauseTitle, setClauseTitle] = useState('');
  const [clauseContent, setClauseContent] = useState('');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExplainClauseResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sampleClauses = [
    {
      title: 'Mutual Indemnification Clause',
      content:
        'Each party shall defend, indemnify, and hold harmless the other party and its officers, directors, and employees from and against any third-party claims, liabilities, losses, damages, and reasonable legal costs arising out of any material breach of this Agreement, gross negligence, or willful misconduct.',
      context: 'B2B Software Vendor Agreement',
    },
    {
      title: 'Post-Termination Non-Compete',
      content:
        'For a period of twelve (12) months following the termination of Employee’s employment for any reason, Employee shall not directly or indirectly engage in, perform services for, invest in, or operate any enterprise that competes with Employer within the geographical territory.',
      context: 'Executive Employment Agreement',
    },
    {
      title: 'Limitation of Liability & Consequential Damages Waiver',
      content:
        'In no event shall either party be liable to the other for any indirect, incidental, special, exemplary, or consequential damages, including loss of profits, revenue, or business interruption, whether in contract or tort, even if advised of the possibility thereof.',
      context: 'Cloud Infrastructure Master Services Agreement',
    },
  ];

  const handleSelectSample = (sample: (typeof sampleClauses)[0]) => {
    setClauseTitle(sample.title);
    setClauseContent(sample.content);
    setContext(sample.context);
    setError(null);
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clauseContent.trim()) {
      setError('Please enter or paste the clause text to analyze.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await aiApi.explainClause({
        clause_title: clauseTitle.trim() || 'Contract Clause',
        clause_content: clauseContent.trim(),
        context: context.trim() || undefined,
      });
      setResult(res);
    } catch (err: any) {
      console.error('AI Explanation error:', err);
      setError('Failed to analyze clause. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-brand-400 text-xs font-semibold mb-1">
          <Bot className="w-4 h-4" />
          <span>AI Contract Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          AI Clause Explainer & Risk Analyzer
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Paste any complex contractual clause below. Gemini AI will break it down into plain English obligations, operational conditions, and key review considerations.
        </p>
      </div>

      <LegalDisclaimerBanner />

      {/* Preset Clause Pills */}
      <div>
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
          Or Try A Standard Commercial Clause
        </span>
        <div className="flex flex-wrap gap-2">
          {sampleClauses.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectSample(sample)}
              className="px-3 py-1.5 rounded-xl text-xs bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-colors flex items-center space-x-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-brand-400" />
              <span>{sample.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleAnalyze} className="glass-panel p-6 rounded-2xl border border-slate-700 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Clause Name / Heading (Optional)
            </label>
            <input
              type="text"
              value={clauseTitle}
              onChange={(e) => setClauseTitle(e.target.value)}
              placeholder="e.g. Section 8.2 Indemnification"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Agreement Context (Optional)
            </label>
            <input
              type="text"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g. Consulting Agreement, Lease Agreement"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-1">
            Clause Text to Explain <span className="text-rose-400">*</span>
          </label>
          <textarea
            required
            rows={5}
            value={clauseContent}
            onChange={(e) => setClauseContent(e.target.value)}
            placeholder="Paste the full paragraph or clause text here..."
            className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 leading-relaxed font-serif focus:outline-none focus:border-brand-500 transition-colors resize-y"
          />
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-glow transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing Clause Obligations...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Explain Clause</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Explanation Result */}
      {result && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-700 space-y-6 animate-in fade-in duration-200 shadow-card">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <h3 className="text-base font-bold text-white">
                Analysis: {result.clause_title}
              </h3>
            </div>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-300 border border-brand-500/20 font-medium">
              Gemini Reasoning Engine
            </span>
          </div>

          {/* Plain Meaning */}
          <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 space-y-1">
            <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Plain-English Meaning</span>
            </h4>
            <p className="text-xs leading-relaxed text-slate-200">{result.summary}</p>
          </div>

          {/* Grid of Obligations and Conditions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Obligations */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-brand-400" />
                <span>Contractual Obligations Created</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                {result.obligations?.map((item, i) => (
                  <li key={i} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            </div>

            {/* Conditions */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Conditions & Exceptions
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                {result.key_conditions?.map((item, i) => (
                  <li key={i} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Review Considerations */}
          {result.review_considerations && result.review_considerations.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20 space-y-2">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center space-x-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Review Considerations & Potential Risks</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-amber-200/90 list-disc list-inside">
                {result.review_considerations.map((item, i) => (
                  <li key={i} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-[10px] text-slate-400 italic text-center pt-2">
            {result.disclaimer}
          </p>
        </div>
      )}
    </div>
  );
};
