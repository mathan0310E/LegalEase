import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FileText,
  Save,
  Download,
  Building2,
  Sparkles,
  HelpCircle,
  Trash2,
  ChevronUp,
  ChevronDown,
  Plus,
  ArrowLeft,
  Loader2,
  Check,
  Eye,
  Edit3,
  Bookmark,
  Share2
} from 'lucide-react';
import { documentApi, exportApi } from '../services/api';
import { DocumentModel, SectionItem, BrandingConfig, StructuredContent } from '../types';
import { TermTable } from '../components/TermTable';
import { ClauseExplainerModal } from '../components/ClauseExplainerModal';
import { RegenerateClauseModal } from '../components/RegenerateClauseModal';
import { BrandingModal } from '../components/BrandingModal';
import { LegalDisclaimerBanner } from '../components/LegalDisclaimerBanner';

export const DocumentEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const docId = Number(id);

  const [document, setDocument] = useState<DocumentModel | null>(null);
  const [title, setTitle] = useState('');
  const [sections, setSections] = useState<SectionItem[]>([]);
  const [branding, setBranding] = useState<BrandingConfig>({});
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [explainerOpen, setExplainerOpen] = useState(false);
  const [explainingClause, setExplainingClause] = useState<{ title: string; content: string }>({
    title: '',
    content: '',
  });

  const [regenOpen, setRegenOpen] = useState(false);
  const [regeneratingSection, setRegeneratingSection] = useState<{
    id: string;
    heading: string;
    content: string;
  } | null>(null);

  const [brandingOpen, setBrandingOpen] = useState(false);

  useEffect(() => {
    if (!docId) return;
    setLoading(true);
    documentApi
      .getDocument(docId)
      .then((doc) => {
        setDocument(doc);
        setTitle(doc.title);
        const secs = doc.structured_content?.sections || [];
        setSections(secs.sort((a, b) => a.order - b.order));
        setBranding(doc.branding_config || {});
      })
      .catch((err) => {
        console.error('Failed to load document:', err);
        setError('Failed to load document. You may not have permission to view it.');
      })
      .finally(() => setLoading(false));
  }, [docId]);

  const handleSave = async () => {
    if (!document) return;
    setSaving(true);
    setSaveSuccess(false);
    setError(null);

    const updatedStructured: StructuredContent = {
      ...(document.structured_content || { title, document_type: document.document_type, sections: [] }),
      title,
      sections: sections.map((s, idx) => ({ ...s, order: idx + 1 })),
    };

    try {
      const updated = await documentApi.updateDocument(docId, {
        title,
        structured_content: updatedStructured,
        branding_config: branding,
      });
      setDocument(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error('Save failed:', err);
      setError('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;

    const newSections = [...sections];
    const [moved] = newSections.splice(index, 1);
    newSections.splice(targetIdx, 0, moved);
    setSections(newSections);
  };

  const handleDeleteSection = (index: number) => {
    if (sections.length <= 1) {
      alert('A legal document must contain at least one section.');
      return;
    }
    const newSections = [...sections];
    newSections.splice(index, 1);
    setSections(newSections);
  };

  const handleAddSection = () => {
    const newOrder = sections.length + 1;
    const newSection: SectionItem = {
      id: `custom-sec-${Date.now()}`,
      heading: `${newOrder}. New Clause Heading`,
      content: 'Enter the specific covenants, warranties, or obligations for this clause here...',
      order: newOrder,
    };
    setSections([...sections, newSection]);
  };

  const handleSectionChange = (index: number, field: 'heading' | 'content', value: string) => {
    const newSections = [...sections];
    newSections[index][field] = value;
    setSections(newSections);
  };

  const openExplainer = (sec: SectionItem) => {
    setExplainingClause({ title: sec.heading, content: sec.content });
    setExplainerOpen(true);
  };

  const openRegenerator = (sec: SectionItem) => {
    setRegeneratingSection({ id: sec.id, heading: sec.heading, content: sec.content });
    setRegenOpen(true);
  };

  const handleApplyRegeneratedSection = (updatedHeading: string, updatedContent: string) => {
    if (!regeneratingSection) return;
    const newSections = sections.map((sec) =>
      sec.id === regeneratingSection.id
        ? { ...sec, heading: updatedHeading, content: updatedContent }
        : sec
    );
    setSections(newSections);
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
        <p className="text-xs text-slate-400">Loading document editor...</p>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-4">
        <p className="text-sm text-rose-400">{error || 'Document not found.'}</p>
        <button
          onClick={() => navigate('/history')}
          className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-white"
        >
          Return to History
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Action Bar */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-700/80 shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Back & Title input */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <button
            onClick={() => navigate('/history')}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors shrink-0"
            title="Back to History"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-base sm:text-lg font-bold text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-brand-500 focus:outline-none w-full px-1 py-0.5 transition-colors"
              placeholder="Document Title"
            />
            <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
              <span className="uppercase font-semibold text-brand-400">
                {document.document_type.replace('_', ' ')}
              </span>
              <span>•</span>
              <span>Created {new Date(document.created_at).toLocaleDateString()}</span>
              {saveSuccess && (
                <span className="text-emerald-400 font-semibold flex items-center space-x-1 animate-in fade-in">
                  <Check className="w-3 h-3" />
                  <span>Changes Saved</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions & Exports */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('editor')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'editor'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Studio</span>
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'preview'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
          </div>

          {/* Branding Drawer Button */}
          <button
            onClick={() => setBrandingOpen(true)}
            className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Branding</span>
          </button>

          {/* Export Dropdown buttons */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => exportApi.downloadPdf(docId, `${title.toLowerCase().replace(/ /g, '_')}.pdf`)}
              className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-medium border border-slate-700 transition-colors"
              title="Download as PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>
            <button
              onClick={() => exportApi.downloadDocx(docId, `${title.toLowerCase().replace(/ /g, '_')}.docx`)}
              className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-medium border border-slate-700 transition-colors"
              title="Download as Word DOCX"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DOCX</span>
            </button>
            <button
              onClick={() => exportApi.downloadTxt(docId, `${title.toLowerCase().replace(/ /g, '_')}.txt`)}
              className="flex items-center space-x-1 px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
              title="Download as Plain Text"
            >
              <Download className="w-3.5 h-3.5" />
              <span>TXT</span>
            </button>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-glow transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save</span>
          </button>
        </div>
      </div>

      <LegalDisclaimerBanner />

      {/* Extracted Key Terms Summary Card */}
      {document.structured_content?.important_terms && (
        <TermTable terms={document.structured_content.important_terms} />
      )}

      {/* Main Tab View: Editor Studio or Full Clean Preview */}
      {activeTab === 'editor' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Document Clauses ({sections.length} Sections)
            </h3>
            <button
              onClick={handleAddSection}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-glow transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Clause</span>
            </button>
          </div>

          {/* Sections List */}
          <div className="space-y-4">
            {sections.map((sec, idx) => (
              <div
                key={sec.id || idx}
                className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 transition-all hover:border-slate-700"
              >
                {/* Clause Header Row */}
                <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center space-x-2 flex-1">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] text-slate-400 flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={sec.heading}
                      onChange={(e) => handleSectionChange(idx, 'heading', e.target.value)}
                      className="flex-1 bg-transparent font-bold text-xs sm:text-sm text-brand-300 border-b border-transparent hover:border-slate-700 focus:border-brand-500 focus:outline-none px-1 py-0.5 transition-colors"
                      placeholder="Section Heading"
                    />
                  </div>

                  {/* Clause Controls */}
                  <div className="flex items-center space-x-1 shrink-0">
                    {/* Explain Clause */}
                    <button
                      onClick={() => openExplainer(sec)}
                      className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-indigo-950/40 hover:bg-indigo-900/50 text-indigo-300 text-[11px] font-medium border border-indigo-500/20 transition-colors"
                      title="Analyze with AI Clause Explainer"
                    >
                      <Sparkles className="w-3 h-3 text-indigo-400" />
                      <span>Explain</span>
                    </button>

                    {/* Improve Clause */}
                    <button
                      onClick={() => openRegenerator(sec)}
                      className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-brand-950/40 hover:bg-brand-900/50 text-brand-300 text-[11px] font-medium border border-brand-500/20 transition-colors"
                      title="Refine Clause with AI"
                    >
                      <Sparkles className="w-3 h-3 text-brand-400" />
                      <span>Refine</span>
                    </button>

                    {/* Reorder Up / Down */}
                    <button
                      disabled={idx === 0}
                      onClick={() => handleMoveSection(idx, 'up')}
                      className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-20 transition-colors"
                      title="Move Up"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      disabled={idx === sections.length - 1}
                      onClick={() => handleMoveSection(idx, 'down')}
                      className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-20 transition-colors"
                      title="Move Down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    {/* Delete Clause */}
                    <button
                      onClick={() => handleDeleteSection(idx)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors ml-1"
                      title="Delete Clause"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Clause Content Textarea */}
                <textarea
                  rows={4}
                  value={sec.content}
                  onChange={(e) => handleSectionChange(idx, 'content', e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 leading-relaxed font-serif focus:outline-none focus:border-brand-500 transition-colors resize-y"
                  placeholder="Enter clause provisions..."
                />
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-center">
            <button
              onClick={handleAddSection}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Clause</span>
            </button>
          </div>
        </div>
      ) : (
        /* Preview Tab: Realistic Executive Legal Paper Simulation */
        <div className="max-w-4xl mx-auto legal-paper p-8 sm:p-14 rounded-2xl shadow-2xl space-y-6 text-slate-900">
          {/* Running Header */}
          <div className="flex justify-between items-center text-[10px] text-slate-500 border-b border-slate-300 pb-2 uppercase tracking-wider font-sans">
            <span>{branding.org_name || 'LEGALEASE CLIENT'}</span>
            <span>{branding.header_text || 'CONFIDENTIAL LEGAL DRAFT'}</span>
          </div>

          {/* Title */}
          <div className="text-center space-y-1.5 py-4 border-b border-slate-300">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 uppercase">
              {title}
            </h1>
            <p className="text-xs text-slate-600 font-sans">
              <b>Classification:</b> {document.document_type.replace('_', ' ').toUpperCase()} &nbsp;|&nbsp;{' '}
              <b>Effective Date:</b> {document.structured_content?.effective_date || 'Date of Execution'}
            </p>
          </div>

          {/* Clauses */}
          <div className="space-y-5 text-[13px] leading-relaxed">
            {sections.map((sec, idx) => (
              <div key={sec.id || idx} className="space-y-1.5">
                <h3 className="font-bold text-slate-900 font-sans text-xs tracking-wide">
                  {sec.heading}
                </h3>
                <p className="text-slate-800 whitespace-pre-wrap text-justify">
                  {sec.content}
                </p>
              </div>
            ))}
          </div>

          {/* Signature Block */}
          <div className="pt-8 border-t border-slate-300 space-y-6 font-sans">
            <p className="text-xs font-semibold text-slate-800">
              IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date:
            </p>
            <div className="grid grid-cols-2 gap-8 text-xs text-slate-800 pt-4">
              <div className="space-y-4">
                <p className="font-bold">
                  For: {document.structured_content?.parties?.[0]?.name || 'First Party'}
                </p>
                <div className="border-b border-slate-400 pt-8"></div>
                <p className="text-[11px] text-slate-500">Authorized Signature & Date</p>
              </div>
              <div className="space-y-4">
                <p className="font-bold">
                  For: {document.structured_content?.parties?.[1]?.name || 'Second Party'}
                </p>
                <div className="border-b border-slate-400 pt-8"></div>
                <p className="text-[11px] text-slate-500">Authorized Signature & Date</p>
              </div>
            </div>
          </div>

          {/* Running Footer & Disclaimer */}
          <div className="pt-6 border-t border-slate-200 text-center text-[10px] text-slate-500 space-y-1 font-sans">
            <p>{branding.footer_text || 'Generated via LegalEase AI • For Informational Purposes'}</p>
            <p className="italic text-[9px] text-slate-400">
              {document.structured_content?.disclaimer ||
                'LegalEase provides AI-generated document drafts for informational and drafting purposes. These documents do not constitute legal advice.'}
            </p>
          </div>
        </div>
      )}

      {/* Modals */}
      <ClauseExplainerModal
        isOpen={explainerOpen}
        onClose={() => setExplainerOpen(false)}
        clauseTitle={explainingClause.title}
        clauseContent={explainingClause.content}
      />

      {regeneratingSection && (
        <RegenerateClauseModal
          isOpen={regenOpen}
          onClose={() => {
            setRegenOpen(false);
            setRegeneratingSection(null);
          }}
          documentId={docId}
          sectionId={regeneratingSection.id}
          currentHeading={regeneratingSection.heading}
          currentContent={regeneratingSection.content}
          onSuccess={handleApplyRegeneratedSection}
        />
      )}

      <BrandingModal
        isOpen={brandingOpen}
        onClose={() => setBrandingOpen(false)}
        branding={branding}
        onSave={(updated) => setBranding(updated)}
      />
    </div>
  );
};
