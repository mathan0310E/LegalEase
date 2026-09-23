import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Search,
  PlusCircle,
  Copy,
  Trash2,
  Download,
  Eye,
  Edit,
  Loader2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { documentApi, exportApi } from '../services/api';
import { DocumentSummary } from '../types';
import { LegalDisclaimerBanner } from '../components/LegalDisclaimerBanner';

export const DocumentHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [filtered, setFiltered] = useState<DocumentSummary[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const fetchDocuments = async () => {
    try {
      const data = await documentApi.getDocuments();
      setDocuments(data);
      setFiltered(data);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Filter effect
  useEffect(() => {
    let result = [...documents];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (d) =>
          d.title.toLowerCase().includes(term) ||
          d.document_type.toLowerCase().includes(term)
      );
    }
    if (typeFilter !== 'all') {
      result = result.filter((d) => d.document_type.toLowerCase() === typeFilter.toLowerCase());
    }
    setFiltered(result);
  }, [searchTerm, typeFilter, documents]);

  const handleDuplicate = async (id: number) => {
    setActionLoading(id);
    try {
      const newDoc = await documentApi.duplicateDocument(id);
      setMessage('Document duplicated successfully.');
      setTimeout(() => setMessage(null), 3000);
      fetchDocuments();
    } catch (err) {
      console.error('Failed to duplicate:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this agreement? This action cannot be undone.')) {
      return;
    }
    setActionLoading(id);
    try {
      await documentApi.deleteDocument(id);
      setMessage('Document deleted.');
      setTimeout(() => setMessage(null), 3000);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error('Failed to delete:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const uniqueTypes = Array.from(new Set(documents.map((d) => d.document_type)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Document History</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage, duplicate, export, or edit your organization's legal agreements.
          </p>
        </div>
        <Link
          to="/create"
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-glow transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Agreement</span>
        </Link>
      </div>

      <LegalDisclaimerBanner />

      {message && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search documents by title or type..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Document Types ({documents.length})</option>
            {uniqueTypes.map((t) => (
              <option key={t} value={t}>
                {t.replace('_', ' ').toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Documents Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-card">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
            <p className="text-xs text-slate-400">Loading document archive...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4 font-semibold">Title</th>
                  <th className="py-3 px-4 font-semibold">Type</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Date Created</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-850/40 transition-colors group">
                    <td className="py-3.5 px-4 font-semibold text-slate-200 max-w-xs truncate">
                      <Link
                        to={`/editor/${doc.id}`}
                        className="hover:text-brand-300 transition-colors flex items-center space-x-2"
                      >
                        <FileText className="w-4 h-4 text-brand-400 shrink-0" />
                        <span className="truncate">{doc.title}</span>
                      </Link>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                        {doc.document_type.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-950/50 text-emerald-400 border border-emerald-500/20 font-medium">
                        {doc.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(doc.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        {/* Open / Edit */}
                        <Link
                          to={`/editor/${doc.id}`}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Open Editor"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>

                        {/* Quick PDF Download */}
                        <button
                          onClick={() =>
                            exportApi.downloadPdf(
                              doc.id,
                              `${doc.title.toLowerCase().replace(/ /g, '_')}.pdf`
                            )
                          }
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 transition-colors"
                          title="Download PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        {/* Duplicate */}
                        <button
                          disabled={actionLoading === doc.id}
                          onClick={() => handleDuplicate(doc.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 transition-colors disabled:opacity-50"
                          title="Duplicate Document"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          disabled={actionLoading === doc.id}
                          onClick={() => handleDelete(doc.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-colors disabled:opacity-50"
                          title="Delete Document"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center space-y-3">
            <p className="text-xs text-slate-400">
              No legal documents found matching your filter.
            </p>
            <Link
              to="/create"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create New Agreement</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
