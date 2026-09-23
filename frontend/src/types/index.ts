export interface User {
  id: number;
  name: string;
  email: string;
  organization_name?: string;
  logo_url?: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface SectionItem {
  id: string;
  heading: string;
  content: string;
  order: number;
}

export interface PartyItem {
  name: string;
  role: string;
  details?: string;
}

export interface ImportantTermItem {
  id?: number;
  term: string;
  value: string;
  category?: string;
}

export interface BrandingConfig {
  org_name?: string;
  logo_url?: string;
  author_name?: string;
  header_text?: string;
  footer_text?: string;
  font_family?: string;
  show_page_numbers?: boolean;
}

export interface StructuredContent {
  title: string;
  document_type: string;
  effective_date?: string;
  parties?: PartyItem[];
  sections: SectionItem[];
  important_terms?: ImportantTermItem[];
  disclaimer?: string;
}

export interface DocumentModel {
  id: number;
  user_id: number;
  title: string;
  document_type: string;
  content: string;
  structured_content: StructuredContent;
  branding_config: BrandingConfig;
  status: string;
  created_at: string;
  updated_at: string;
  terms?: ImportantTermItem[];
}

export interface DocumentSummary {
  id: number;
  title: string;
  document_type: string;
  status: string;
  created_at: string;
  updated_at: string;
  terms_count: number;
}

export interface TemplateField {
  name: string;
  label: string;
  field_type: 'text' | 'textarea' | 'date' | 'number' | 'select';
  required: boolean;
  placeholder?: string;
  help_text?: string;
  default?: string;
  options?: string[];
}

export interface TemplateModel {
  id: number;
  name: string;
  document_type: string;
  description: string;
  category: string;
  fields_schema: TemplateField[];
}

export interface ExplainClauseResponse {
  clause_title: string;
  summary: string;
  obligations: string[];
  key_conditions: string[];
  review_considerations: string[];
  disclaimer: string;
}

export interface AnalyticsData {
  total_documents: number;
  documents_this_month: number;
  by_type: Record<string, number>;
  by_status: Record<string, number>;
  avg_sections: number;
  std_sections: number;
  chart_image_base64: string;
  activity_timeline: Array<{
    id: number;
    title: string;
    document_type: string;
    created_at: string;
    status: string;
  }>;
}
