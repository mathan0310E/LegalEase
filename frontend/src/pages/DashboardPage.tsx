import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  PlusCircle,
  TrendingUp,
  Calendar,
  Sparkles,
  ArrowRight,
  Download,
  Eye,
  BarChart3,
  Loader2,
  Clock,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { analyticsApi, documentApi } from '../services/api';
import { AnalyticsData, DocumentSummary } from '../types';
import { LegalDisclaimerBanner } from '../components/LegalDisclaimerBanner';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [recentDocs, setRecentDocs] = useState<DocumentSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stats, docs] = await Promise.all([
          analyticsApi.getDashboard(),
          documentApi.getDocuments(),
        ]);
        setAnalytics(stats);
        setRecentDocs(docs.slice(0, 5));
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 sm:p-8 rounded-2xl border border-slate-700/80 shadow-card">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">
              Contract Operations
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome back, {user?.name || 'Counsel'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            {user?.organization_name ? `${user.organization_name} Legal Workspace` : 'LegalEase AI Document Drafting Workspace'}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/create"
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-glow transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Document</span>
          </Link>
          <Link
            to="/assistant"
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>AI Assistant</span>
          </Link>
        </div>
      </div>

      <LegalDisclaimerBanner />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-400">Total Documents</span>
            <p className="text-2xl font-bold text-white">
              {loading ? '—' : analytics?.total_documents ?? 0}
            </p>
            <span className="text-[10px] text-slate-400">Drafted via LegalEase</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-brand-600/20 text-brand-400 border border-brand-500/20 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-400">Created This Month</span>
            <p className="text-2xl font-bold text-white">
              {loading ? '—' : analytics?.documents_this_month ?? 0}
            </p>
            <span className="text-[10px] text-emerald-400 flex items-center space-x-1">
              <TrendingUp className="w-3 h-3" />
              <span>Active Cycle</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-400">Average Clauses</span>
            <p className="text-2xl font-bold text-white">
              {loading ? '—' : analytics?.avg_sections ?? 0}
            </p>
            <span className="text-[10px] text-slate-400">Clauses per contract</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-400">AI Engine</span>
            <p className="text-lg font-bold text-white">Gemini 2.5</p>
            <span className="text-[10px] text-brand-300">Structured JSON Output</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* NumPy & Matplotlib Analytics Visualization Panel */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-brand-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Legal Portfolio Analytics (Powered by NumPy & Matplotlib)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Real-time statistical synthesis
          </span>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center items-center">
            <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
          </div>
        ) : analytics?.chart_image_base64 ? (
          <div className="rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex justify-center p-2">
            <img
              src={`data:image/png;base64,${analytics.chart_image_base64}`}
              alt="LegalEase Analytics Chart"
              className="max-w-full h-auto rounded-lg shadow-md"
            />
          </div>
        ) : (
          <div className="py-8 text-center text-slate-400 text-xs">
            Generate documents to unlock portfolio distribution metrics.
          </div>
        )}
      </div>

      {/* Quick Launch & Recent Documents Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Launch Cards (1 Col) */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <PlusCircle className="w-4 h-4 text-brand-400" />
            <span>Quick Generate</span>
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Select a common agreement to launch the dynamic parameter wizard:
          </p>

          <div className="space-y-2">
            {[
              { name: 'Non-Disclosure Agreement', type: 'nda', tag: 'Confidentiality' },
              { name: 'Employment Agreement', type: 'employment_agreement', tag: 'HR' },
              { name: 'Commercial Lease Agreement', type: 'lease_agreement', tag: 'Real Estate' },
              { name: 'Master Service Agreement', type: 'service_agreement', tag: 'Commercial' },
            ].map((item, idx) => (
              <Link
                key={idx}
                to={`/create?type=${item.type}`}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-brand-500/40 transition-colors group"
              >
                <div>
                  <h4 className="text-xs font-semibold text-slate-200 group-hover:text-brand-300 transition-colors">
                    {item.name}
                  </h4>
                  <span className="text-[10px] text-slate-500">{item.tag}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-brand-300 transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Documents Table (2 Cols) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>Recent Documents</span>
            </h3>
            <Link
              to="/history"
              className="text-xs font-medium text-brand-400 hover:text-brand-300 flex items-center space-x-1"
            >
              <span>View All History</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="py-8 flex justify-center">
              <Loader2 className="w-6 h-6 text-brand-400 animate-spin" />
            </div>
          ) : recentDocs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-2 font-medium">Document Title</th>
                    <th className="pb-2 font-medium">Classification</th>
                    <th className="pb-2 font-medium">Created</th>
                    <th className="pb-2 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {recentDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-850/40 transition-colors">
                      <td className="py-3 font-medium text-slate-200 pr-2 max-w-[200px] truncate">
                        <Link to={`/editor/${doc.id}`} className="hover:text-brand-300 transition-colors">
                          {doc.title}
                        </Link>
                      </td>
                      <td className="py-3 text-slate-400">
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                          {doc.document_type.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 text-slate-400 text-[11px]">
                        {new Date(doc.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          to={`/editor/${doc.id}`}
                          className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-brand-300 text-[11px] font-medium transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Open</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center text-slate-400 text-xs">
              No contracts created yet. Use the Quick Generate buttons to create your first agreement.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
