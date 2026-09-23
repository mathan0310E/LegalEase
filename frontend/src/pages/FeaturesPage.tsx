import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  FileCode,
  Download,
  Brain,
  Sliders,
  CheckCircle,
  FileCheck2,
  Workflow
} from 'lucide-react';
import { LegalDisclaimerBanner } from '../components/LegalDisclaimerBanner';

export const FeaturesPage: React.FC = () => {
  const features = [
    {
      icon: Sparkles,
      title: 'Gemini 2.5 Flash Structured Prompting',
      desc: 'LegalEase uses temperature-controlled, JSON-constrained prompting to enforce legal standards. Facts, dates, and amounts entered by users are strictly preserved without creative hallucination.',
    },
    {
      icon: Sliders,
      title: 'Modular Clause Editor',
      desc: 'Contracts are broken down into numbered clauses with headings. Reorder, edit, delete, or add clauses on the fly. Each clause can be individually regenerated using AI without altering surrounding sections.',
    },
    {
      icon: Brain,
      title: 'AI Clause Explainer',
      desc: 'Complex legal jargon demystified. With one click, LegalEase analyzes the selected clause to identify the obligations it creates, required conditions, and practical questions to review with legal counsel.',
    },
    {
      icon: FileCheck2,
      title: 'Automatic Legal Term Extraction',
      desc: 'Critical deal points (Parties, Effective Date, Duration, Payment Milestones, Governing Law, Termination Notice) are extracted from the text and presented in a clean summary table.',
    },
    {
      icon: Download,
      title: 'Presentation-Ready Multi-Format Exports',
      desc: 'Export contracts directly to PDF (typeset via ReportLab with running headers, footers, and page numbers), Microsoft Word (.docx via python-docx), and plain text (.txt).',
    },
    {
      icon: ShieldCheck,
      title: 'Multi-Tenant Data Isolation',
      desc: 'Every document is cryptographically guarded by JWT authentication and strict user ownership filtering. No user can read, edit, or export another organization’s agreements.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-semibold">
          <Workflow className="w-3.5 h-3.5" />
          <span>Platform Capabilities</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Engineered for Accuracy & Compliance
        </h1>
        <p className="text-sm text-slate-300">
          Explore the technical features that make LegalEase a state-of-the-art Generative AI demonstration for legal document generation.
        </p>
      </div>

      <LegalDisclaimerBanner className="max-w-3xl mx-auto" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {features.map((feat, i) => {
          const Icon = feat.icon;
          return (
            <div key={i} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600/20 text-brand-400 border border-brand-500/30 flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">{feat.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
