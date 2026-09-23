import axios from 'axios';
import {
  AuthResponse,
  User,
  DocumentModel,
  DocumentSummary,
  TemplateModel,
  ExplainClauseResponse,
  AnalyticsData,
  BrandingConfig,
  StructuredContent
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization header if token exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('legalease_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect if checking auth status
      if (!error.config.url.includes('/auth/login') && !error.config.url.includes('/auth/register')) {
        localStorage.removeItem('legalease_token');
        localStorage.removeItem('legalease_user');
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: async (data: { name: string; email: string; password: string; organization_name?: string }): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/register', data);
    return res.data;
  },
  login: async (data: { email: string; password: string }): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/login', data);
    return res.data;
  },
  getMe: async (): Promise<User> => {
    const res = await api.get<User>('/auth/me');
    return res.data;
  },
  updateProfile: async (data: { name?: string; organization_name?: string; logo_url?: string }): Promise<User> => {
    const res = await api.put<User>('/auth/profile', data);
    return res.data;
  },
};

export const templateApi = {
  getTemplates: async (): Promise<TemplateModel[]> => {
    const res = await api.get<TemplateModel[]>('/templates');
    return res.data;
  },
  getTemplate: async (documentType: string): Promise<TemplateModel> => {
    const res = await api.get<TemplateModel>(`/templates/${documentType}`);
    return res.data;
  },
};

export const documentApi = {
  getDocuments: async (): Promise<DocumentSummary[]> => {
    const res = await api.get<DocumentSummary[]>('/documents');
    return res.data;
  },
  getDocument: async (id: number): Promise<DocumentModel> => {
    const res = await api.get<DocumentModel>(`/documents/${id}`);
    return res.data;
  },
  generateDocument: async (data: {
    document_type: string;
    title?: string;
    form_data: Record<string, any>;
    branding?: BrandingConfig;
  }): Promise<DocumentModel> => {
    const res = await api.post<DocumentModel>('/documents/generate', data);
    return res.data;
  },
  updateDocument: async (
    id: number,
    data: {
      title?: string;
      content?: string;
      structured_content?: StructuredContent;
      branding_config?: BrandingConfig;
      status?: string;
    }
  ): Promise<DocumentModel> => {
    const res = await api.put<DocumentModel>(`/documents/${id}`, data);
    return res.data;
  },
  deleteDocument: async (id: number): Promise<void> => {
    await api.delete(`/documents/${id}`);
  },
  duplicateDocument: async (id: number): Promise<DocumentModel> => {
    const res = await api.post<DocumentModel>(`/documents/${id}/duplicate`);
    return res.data;
  },
  regenerateSection: async (
    docId: number,
    data: {
      section_id: string;
      current_heading: string;
      current_content: string;
      instruction: string;
    }
  ): Promise<{ section_id: string; updated_heading: string; updated_content: string; explanation: string }> => {
    const res = await api.post(`/documents/${docId}/regenerate-section`, data);
    return res.data;
  },
};

export const aiApi = {
  explainClause: async (data: {
    clause_title: string;
    clause_content: string;
    context?: string;
  }): Promise<ExplainClauseResponse> => {
    const res = await api.post<ExplainClauseResponse>('/ai/explain-clause', data);
    return res.data;
  },
};

export const analyticsApi = {
  getDashboard: async (): Promise<AnalyticsData> => {
    const res = await api.get<AnalyticsData>('/analytics/dashboard');
    return res.data;
  },
};

export const exportApi = {
  downloadPdf: async (docId: number, filename = 'document.pdf') => {
    const res = await api.get(`/export/${docId}/pdf`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
  downloadDocx: async (docId: number, filename = 'document.docx') => {
    const res = await api.get(`/export/${docId}/docx`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
  downloadTxt: async (docId: number, filename = 'document.txt') => {
    const res = await api.get(`/export/${docId}/txt`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data], { type: 'text/plain' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};

export default api;
