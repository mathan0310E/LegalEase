import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  FileText,
  Sparkles,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sliders,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';
import { templateApi, documentApi } from '../services/api';
import { TemplateModel } from '../types';
import { LegalDisclaimerBanner } from '../components/LegalDisclaimerBanner';

export const CreateDocumentPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedType = searchParams.get('type');

  const [templates, setTemplates] = useState<TemplateModel[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateModel | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [customTitle, setCustomTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    templateApi
      .getTemplates()
      .then((data) => {
        setTemplates(data);
        if (preselectedType) {
          const matched = data.find(
            (t) => t.document_type.toLowerCase() === preselectedType.toLowerCase()
          );
          if (matched) {
            handleSelectTemplate(matched);
          }
        }
      })
      .catch((err) => {
        console.error('Failed to load templates:', err);
        setError('Failed to fetch legal document templates.');
      })
      .finally(() => setLoading(false));
  }, [preselectedType]);

  const handleSelectTemplate = (tmpl: TemplateModel) => {
    setSelectedTemplate(tmpl);
    setCustomTitle('');
    setError(null);
    // Initialize default values
    const initial: Record<string, any> = {};
    tmpl.fields_schema.forEach((f) => {
      initial[f.name] = f.default || '';
    });
    setFormData(initial);
  };

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate) return;

    // Validate required fields
    for (const field of selectedTemplate.fields_schema) {
      if (field.required && !formData[field.name]) {
        setError(`Please complete the required field: "${field.label}"`);
        return;
      }
    }

    setGenerating(true);
    setError(null);

    try {
      const doc = await documentApi.generateDocument({
        document_type: selectedTemplate.document_type,
        title: customTitle.trim() || undefined,
        form_data: formData,
      });
      // Redirect to Document Editor
      navigate(`/editor/${doc.id}`);
    } catch (err: any) {
      console.error('Generation error:', err);
      setError(
        err?.response?.data?.detail ||
          "We couldn't generate the document. Your information has not been lost. Please retry."
      );
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
        <p className="text-xs text-slate-400">Loading document schema library...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-brand-400 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Document Synthesis Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {selectedTemplate ? selectedTemplate.name : 'Select a Legal Agreement'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            {selectedTemplate
              ? selectedTemplate.description
              : 'Choose from 8 standardized legal templates to configure your transaction terms.'}
          </p>
        </div>

        {selectedTemplate && (
          <button
            onClick={() => setSelectedTemplate(null)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Change Type</span>
          </button>
        )}
      </div>

      <LegalDisclaimerBanner />

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Step 1: Select Template if not selected */}
      {!selectedTemplate && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((tmpl) => (
            <div
              key={tmpl.id}
              onClick={() => handleSelectTemplate(tmpl)}
              className="glass-panel p-5 rounded-xl border border-slate-800 hover:border-brand-500/60 hover:bg-slate-850/60 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-brand-400 border border-slate-700">
                    {tmpl.category}
                  </span>
                  <FileText className="w-4 h-4 text-slate-500 group-hover:text-brand-300 transition-colors" />
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-brand-300 transition-colors">
                  {tmpl.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {tmpl.description}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>{tmpl.fields_schema.length} Parameters</span>
                <span className="text-brand-400 group-hover:translate-x-0.5 transition-transform flex items-center space-x-1">
                  <span>Configure</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Step 2: Dynamic Form for Selected Template */}
      {selectedTemplate && (
        <form onSubmit={handleGenerate} className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-700 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
              Agreement Parameters & Parties
            </h3>
            <p className="text-xs text-slate-400">
              Provide the verified details below. Gemini will formulate clauses strictly adhering to these parameters.
            </p>
          </div>

          {/* Optional Title Override */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Custom Document Title (Optional)
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder={`e.g. ${selectedTemplate.name} (${new Date().getFullYear()})`}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>

          {/* Dynamic Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedTemplate.fields_schema.map((field) => {
              const isFullWidth = field.field_type === 'textarea';
              return (
                <div key={field.name} className={isFullWidth ? 'md:col-span-2' : ''}>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    {field.label} {field.required && <span className="text-rose-400">*</span>}
                  </label>

                  {field.field_type === 'textarea' ? (
                    <textarea
                      required={field.required}
                      rows={3}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors resize-y"
                    />
                  ) : field.field_type === 'select' ? (
                    <select
                      required={field.required}
                      value={formData[field.name] || field.default || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500 transition-colors"
                    >
                      {field.options?.map((opt, i) => (
                        <option key={i} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.field_type === 'number' ? 'number' : field.field_type === 'date' ? 'date' : 'text'}
                      required={field.required}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                    />
                  )}

                  {field.help_text && (
                    <p className="text-[10px] text-slate-400 mt-1 flex items-center space-x-1">
                      <HelpCircle className="w-3 h-3 text-slate-500 inline shrink-0" />
                      <span>{field.help_text}</span>
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setSelectedTemplate(null)}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={generating}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-500 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-glow transition-all disabled:opacity-50"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Legal Clauses with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Legal Document</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
