import React, { useState } from 'react';
import { X, Building2, Sliders, Check } from 'lucide-react';
import { BrandingConfig } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  branding: BrandingConfig;
  onSave: (updated: BrandingConfig) => void;
}

export const BrandingModal: React.FC<Props> = ({ isOpen, onClose, branding, onSave }) => {
  const [form, setForm] = useState<BrandingConfig>({
    org_name: branding?.org_name || '',
    author_name: branding?.author_name || '',
    header_text: branding?.header_text || 'CONFIDENTIAL LEGAL DRAFT',
    footer_text: branding?.footer_text || 'Page %p of %P — Generated via LegalEase AI',
    font_family: branding?.font_family || 'Times-Roman',
    show_page_numbers: branding?.show_page_numbers ?? true,
    logo_url: branding?.logo_url || '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl glass-panel border border-slate-700 shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Document Branding</h3>
              <p className="text-xs text-slate-400">Header, footer, and styling for PDF/DOCX exports</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="py-4 space-y-3.5 text-xs">
          <div>
            <label className="font-semibold text-slate-200 block mb-1">Organization Name</label>
            <input
              type="text"
              value={form.org_name}
              onChange={(e) => setForm({ ...form, org_name: e.target.value })}
              placeholder="e.g. Apex Global Technologies"
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-200 block mb-1">Author / Signatory Title</label>
            <input
              type="text"
              value={form.author_name}
              onChange={(e) => setForm({ ...form, author_name: e.target.value })}
              placeholder="e.g. Mathan Kumar (Managing Director)"
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-200 block mb-1">Header Text</label>
            <input
              type="text"
              value={form.header_text}
              onChange={(e) => setForm({ ...form, header_text: e.target.value })}
              placeholder="e.g. CONFIDENTIAL & PROPRIETARY"
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-200 block mb-1">Footer Text</label>
            <input
              type="text"
              value={form.footer_text}
              onChange={(e) => setForm({ ...form, footer_text: e.target.value })}
              placeholder="e.g. Page %p of %P — Generated via LegalEase AI"
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="font-semibold text-slate-200 block mb-1">Typography Style</label>
              <select
                value={form.font_family}
                onChange={(e) => setForm({ ...form, font_family: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-brand-500"
              >
                <option value="Times-Roman">Times-Roman (Classic Legal Serif)</option>
                <option value="Helvetica">Helvetica (Modern Corporate Sans)</option>
                <option value="Courier">Courier (Monospace Courier)</option>
              </select>
            </div>
            <div className="flex items-center space-x-2 pt-5">
              <input
                type="checkbox"
                id="show_pages"
                checked={form.show_page_numbers}
                onChange={(e) => setForm({ ...form, show_page_numbers: e.target.checked })}
                className="w-4 h-4 rounded text-brand-600 bg-slate-900 border-slate-700"
              />
              <label htmlFor="show_pages" className="text-slate-300 font-medium">
                Include Page Numbers
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium shadow-glow transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Branding</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
