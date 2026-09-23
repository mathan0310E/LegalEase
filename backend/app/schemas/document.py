from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, ConfigDict


class BrandingConfig(BaseModel):
    org_name: Optional[str] = "LegalEase Corporation"
    logo_url: Optional[str] = ""
    author_name: Optional[str] = ""
    header_text: Optional[str] = "CONFIDENTIAL LEGAL DRAFT"
    footer_text: Optional[str] = "Page %p of %P — Generated via LegalEase AI"
    font_family: Optional[str] = "Times-Roman"
    show_page_numbers: Optional[bool] = True


class SectionItem(BaseModel):
    id: str
    heading: str
    content: str
    order: int


class PartyItem(BaseModel):
    name: str
    role: str
    details: Optional[str] = ""


class ImportantTermItem(BaseModel):
    term: str
    value: str
    category: Optional[str] = "General"


class StructuredContent(BaseModel):
    title: str
    document_type: str
    effective_date: Optional[str] = ""
    parties: List[PartyItem] = []
    sections: List[SectionItem] = []
    important_terms: List[ImportantTermItem] = []
    disclaimer: Optional[str] = (
        "LegalEase provides AI-generated document drafts for informational and drafting purposes. "
        "These documents do not constitute legal advice and should be reviewed by a qualified legal professional before use."
    )


class DocumentGenerateRequest(BaseModel):
    document_type: str
    title: Optional[str] = None
    form_data: Dict[str, Any]
    branding: Optional[BrandingConfig] = None


class DocumentUpdateRequest(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    structured_content: Optional[Dict[str, Any]] = None
    branding_config: Optional[Dict[str, Any]] = None
    status: Optional[str] = None


class DocumentTermResponse(BaseModel):
    id: int
    term: str
    value: str
    category: str

    model_config = ConfigDict(from_attributes=True)


class DocumentResponse(BaseModel):
    id: int
    user_id: int
    title: str
    document_type: str
    content: str
    structured_content: Dict[str, Any]
    branding_config: Dict[str, Any]
    status: str
    created_at: datetime
    updated_at: datetime
    terms: List[DocumentTermResponse] = []

    model_config = ConfigDict(from_attributes=True)


class DocumentSummaryResponse(BaseModel):
    id: int
    title: str
    document_type: str
    status: str
    created_at: datetime
    updated_at: datetime
    terms_count: Optional[int] = 0

    model_config = ConfigDict(from_attributes=True)


class RegenerateSectionRequest(BaseModel):
    section_id: str
    current_heading: str
    current_content: str
    instruction: str


class RegenerateSectionResponse(BaseModel):
    section_id: str
    updated_heading: str
    updated_content: str
    explanation: str
