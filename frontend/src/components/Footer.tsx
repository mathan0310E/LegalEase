import React from 'react';
import { Scale, ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Col 1 */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <Scale className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">LegalEase</span>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            Enterprise-grade, AI-powered legal document generation platform built for modern business teams and legal professionals.
          </p>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
            <span>Google Cloud GenAI Powered</span>
          </div>
        </div>

        {/* Col 2 */}
        <div>
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Supported Documents</h4>
          <ul className="space-y-1.5 text-xs">
            <li><Link to="/create?type=nda" className="hover:text-white transition-colors">Non-Disclosure Agreement</Link></li>
            <li><Link to="/create?type=employment_agreement" className="hover:text-white transition-colors">Employment Agreement</Link></li>
            <li><Link to="/create?type=lease_agreement" className="hover:text-white transition-colors">Commercial Lease Agreement</Link></li>
            <li><Link to="/create?type=service_agreement" className="hover:text-white transition-colors">Master Service Agreement</Link></li>
            <li><Link to="/create?type=offer_letter" className="hover:text-white transition-colors">Executive Offer Letter</Link></li>
          </ul>
        </div>

        {/* Col 3 */}
        <div>
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Platform & AI</h4>
          <ul className="space-y-1.5 text-xs">
            <li><Link to="/features" className="hover:text-white transition-colors">Structured Prompting</Link></li>
            <li><Link to="/assistant" className="hover:text-white transition-colors">AI Clause Explainer</Link></li>
            <li><Link to="/features" className="hover:text-white transition-colors">Contract Term Extraction</Link></li>
            <li><Link to="/features" className="hover:text-white transition-colors">Multi-Format Export (PDF/DOCX/TXT)</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">Security & Isolation</Link></li>
          </ul>
        </div>

        {/* Col 4 */}
        <div>
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Legal Disclaimer</h4>
          <p className="text-[11px] leading-relaxed text-slate-400">
            LegalEase provides automated legal document drafting tools for informational and administrative purposes only. Generated drafts do not establish an attorney-client relationship. Always consult a qualified attorney for legal validation.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <div>
          &copy; {new Date().getFullYear()} LegalEase Inc. Engineered with Google Cloud & Gemini.
        </div>
        <div className="flex items-center space-x-1">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>for advanced legal engineering</span>
        </div>
      </div>
    </footer>
  );
};
