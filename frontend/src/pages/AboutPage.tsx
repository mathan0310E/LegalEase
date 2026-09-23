import React from 'react';
import { Server, Database, Brain, Cpu, Cloud, Shield, Terminal } from 'lucide-react';
import { LegalDisclaimerBanner } from '../components/LegalDisclaimerBanner';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          About LegalEase & Architecture
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl mx-auto">
          An engineering showcase of enterprise Generative AI on Google Cloud, demonstrating structured prompting, automated terms extraction, and multi-format document compilation.
        </p>
      </div>

      <LegalDisclaimerBanner />

      {/* Architecture Breakdown */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-brand-400" />
          <span>System Architecture & Technology Stack</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-brand-400 font-bold">
              <Brain className="w-4 h-4" />
              <span>AI & Reasoning Layer</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Google Gemini 2.5 Flash via official <code className="text-brand-300">google-genai</code> SDK. Implements system instructions, JSON schema enforcement, and zero-hallucination factual guardrails. Resilient fallback generator handles offline environments and tests seamlessly.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-indigo-400 font-bold">
              <Server className="w-4 h-4" />
              <span>Backend & API Framework</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              FastAPI with asynchronous routing, Pydantic v2 data validation, JWT authentication with bcrypt password hashing, and clean service-layer design separating AI, document assembly, and exports.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-purple-400 font-bold">
              <Database className="w-4 h-4" />
              <span>Storage & Data Model</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              SQLAlchemy ORM with SQLite for instant local development and direct migration path to Cloud SQL (PostgreSQL). Schema maps Users, Documents, DocumentTerms, and Templates with full relational cascades.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <Cloud className="w-4 h-4" />
              <span>Document Compilation & Analytics</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              ReportLab flowable PDF engine, <code className="text-brand-300">python-docx</code> for Microsoft Word export, and NumPy & Matplotlib for computational analytics and dynamic charting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
