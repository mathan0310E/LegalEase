import React from 'react';
import { Link } from 'react-router-dom';
import {
  Scale,
  Sparkles,
  ShieldCheck,
  FileText,
  Download,
  ArrowRight,
  CheckCircle2,
  Lock,
  Zap,
  Layers,
  ChevronRight
} from 'lucide-react';
import { LegalDisclaimerBanner } from '../components/LegalDisclaimerBanner';

export const LandingPage: React.FC = () => {
  const documentTypes = [
    { title: 'Non-Disclosure Agreement', desc: 'Mutual & unilateral NDAs with robust IP protections and term periods.', type: 'nda' },
    { title: 'Employment Agreement', desc: 'Full-time HR contracts with IP assignment, compensation & non-solicitation.', type: 'employment_agreement' },
    { title: 'Commercial Lease', desc: 'Real estate agreements covering tenancy, deposits, and landlord covenants.', type: 'lease_agreement' },
    { title: 'Service Agreement', desc: 'Master services contracts with SLAs, milestone deliverables, and fee schedules.', type: 'service_agreement' },
    { title: 'Executive Offer Letter', desc: 'Formal compensation packages, start dates, and role expectations.', type: 'offer_letter' },
    { title: 'Partnership Agreement', desc: 'Capital contributions, profit-sharing ratios, and voting governance.', type: 'partnership_agreement' },
  ];

  return (
    <div className="space-y-24 py-12">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center pt-8">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold mb-8 animate-in fade-in duration-300">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>Powered by Google Gemini 2.5 Flash</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
          Draft Precise Legal Agreements{' '}
          <span className="bg-gradient-to-r from-brand-400 via-indigo-400 to-sky-300 bg-clip-text text-transparent">
            in Seconds with Generative AI
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          LegalEase eliminates drafting friction. Select standard legal templates, enter structured transaction terms, and let Gemini synthesize customized, editable contracts with instant key term extraction.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-500 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-glow flex items-center justify-center space-x-2 transition-all"
          >
            <span>Start Drafting Contract</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-all"
          >
            Sign In with Demo Account
          </Link>
        </div>

        {/* Legal Disclaimer */}
        <div className="max-w-2xl mx-auto mt-8">
          <LegalDisclaimerBanner />
        </div>

        {/* Interactive Studio Preview Card */}
        <div className="mt-16 relative max-w-5xl mx-auto rounded-2xl glass-panel p-2 sm:p-4 border border-slate-700/80 shadow-2xl">
          <div className="rounded-xl overflow-hidden bg-slate-900/90 border border-slate-800 p-6 text-left">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                <span className="text-xs text-slate-400 font-mono ml-2">Mutual_NDA_Draft.legalease</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-full border border-brand-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Structure Verified</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              {/* Left Column: Clauses */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Document Clauses</span>
                {['1. Preamble & Parties', '2. Confidentiality Scope', '3. Permitted Use', '4. Term & Duration', '5. Injunctive Remedies'].map((c, i) => (
                  <div key={i} className={`p-2.5 rounded-lg text-xs font-medium border flex items-center justify-between ${i === 1 ? 'bg-brand-600/20 text-brand-300 border-brand-500/40' : 'bg-slate-850 text-slate-300 border-slate-800'}`}>
                    <span>{c}</span>
                    {i === 1 && <span className="text-[10px] bg-brand-500/20 px-1.5 py-0.5 rounded text-brand-300">Active</span>}
                  </div>
                ))}
              </div>

              {/* Center Column: Text preview */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Clause Studio</span>
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed font-serif">
                  "Receiving Party agrees to safeguard Confidential Information using at least a reasonable standard of care. No trade secret shall be disclosed without prior written authorization."
                </div>
                <div className="flex gap-2 pt-1">
                  <span className="px-2.5 py-1 rounded bg-indigo-950/60 border border-indigo-500/30 text-[10px] text-indigo-300 flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Improve Clause</span>
                  </span>
                  <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-300">
                    Explain in Plain English
                  </span>
                </div>
              </div>

              {/* Right Column: Key Term Extraction */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Extracted Terms</span>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between border-b border-slate-800/80 pb-1">
                    <span className="text-slate-400">Duration:</span>
                    <span className="text-white font-mono">24 Months</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/80 pb-1">
                    <span className="text-slate-400">Governing Law:</span>
                    <span className="text-white font-mono">Tamil Nadu, IN</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/80 pb-1">
                    <span className="text-slate-400">Remedies:</span>
                    <span className="text-white font-mono">Injunctive Relief</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Export Ready:</span>
                    <span className="text-emerald-400 font-mono">PDF & DOCX</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase tracking-widest text-brand-400 font-bold mb-2">Capabilities</h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">
            Everything Required for Modern Legal Drafting
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600/20 text-brand-400 border border-brand-500/30 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Dynamic Form Synthesis</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every document template provides customized validation fields. Gemini generates strictly structured, un-hallucinated drafts preserving your exact dates and terms.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Modular Clause Studio</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Edit, reorder, add, or delete sections. Targeted clause refinement allows you to rewrite individual paragraphs without regenerating the entire agreement.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">ReportLab & Word Export</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Download presentation-grade PDF documents with custom running headers, page numbers, signature blocks, and editable Microsoft Word .docx files.
            </p>
          </div>
        </div>
      </section>

      {/* Document Types Showcase */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs uppercase tracking-widest text-indigo-400 font-bold mb-2">Supported Library</h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">
            8 Standardized Agreement Formats
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {documentTypes.map((doc, idx) => (
            <Link
              key={idx}
              to={`/create?type=${doc.type}`}
              className="glass-panel p-5 rounded-xl border border-slate-800 hover:border-brand-500/50 hover:bg-slate-850/60 transition-all group"
            >
              <div className="flex items-start justify-between">
                <FileText className="w-5 h-5 text-brand-400" />
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-brand-300 transition-colors" />
              </div>
              <h4 className="text-sm font-bold text-white mt-3 group-hover:text-brand-300 transition-colors">
                {doc.title}
              </h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{doc.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center pb-8">
        <div className="rounded-3xl glass-panel p-8 sm:p-12 border border-brand-500/30 relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Ready to Accelerate Your Legal Workflows?
            </h2>
            <p className="text-sm text-slate-300 max-w-xl mx-auto">
              Create an account in 10 seconds or sign in using pre-seeded demonstration data to explore all features.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <Link
                to="/register"
                className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm shadow-glow transition-all"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
