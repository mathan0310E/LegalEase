from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.document import Document
from app.models.user import User
from app.schemas.document import DocumentUpdateRequest, BrandingConfig
from app.services.gemini_service import gemini_service
from app.services.legal_terms_service import legal_terms_service


class DocumentService:
    @staticmethod
    async def generate_and_save(
        db: Session,
        user: User,
        document_type: str,
        form_data: Dict[str, Any],
        title: Optional[str] = None,
        branding: Optional[BrandingConfig] = None
    ) -> Document:
        """Executes AI generation, validates output, and saves new document."""
        # 1. AI Generation via Gemini Service
        ai_output = await gemini_service.generate_document(document_type, form_data, title)

        doc_title = title or ai_output.get("title", f"{document_type.replace('_', ' ').title()}")
        sections = ai_output.get("sections", [])

        # Build raw text content representation
        content_lines = [f"# {doc_title.upper()}\n"]
        for sec in sorted(sections, key=lambda s: s.get("order", 0)):
            content_lines.append(f"## {sec.get('heading', '')}\n{sec.get('content', '')}\n")
        full_content = "\n".join(content_lines)

        branding_dict = branding.dict() if branding else {
            "org_name": user.organization_name or "LegalEase Client",
            "logo_url": user.logo_url or "",
            "author_name": user.name,
            "header_text": "CONFIDENTIAL LEGAL DRAFT",
            "footer_text": "Generated via LegalEase AI • For Informational Purposes",
            "font_family": "Times-Roman",
            "show_page_numbers": True
        }

        # 2. Persist Document
        doc = Document(
            user_id=user.id,
            title=doc_title,
            document_type=document_type,
            content=full_content,
            structured_content=ai_output,
            branding_config=branding_dict,
            status="completed"
        )
        db.add(doc)
        db.commit()
        db.refresh(doc)

        # 3. Synchronize extracted terms
        legal_terms_service.sync_document_terms(db, doc, ai_output)
        db.refresh(doc)
        return doc

    @staticmethod
    def get_user_document(db: Session, doc_id: int, user: User) -> Document:
        """Retrieves a document with strict user isolation check."""
        doc = db.query(Document).filter(Document.id == doc_id).first()
        if not doc:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
        if doc.user_id != user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to access this document")
        return doc

    @staticmethod
    def list_user_documents(db: Session, user: User, limit: int = 50, skip: int = 0) -> List[Document]:
        """Lists documents owned by the user, newest first."""
        return db.query(Document).filter(Document.user_id == user.id).order_by(Document.created_at.desc()).offset(skip).limit(limit).all()

    @staticmethod
    def update_document(db: Session, doc_id: int, user: User, req: DocumentUpdateRequest) -> Document:
        """Updates document content, title, or sections."""
        doc = DocumentService.get_user_document(db, doc_id, user)

        if req.title is not None:
            doc.title = req.title
        if req.content is not None:
            doc.content = req.content
        if req.status is not None:
            doc.status = req.status
        if req.branding_config is not None:
            doc.branding_config = req.branding_config
        if req.structured_content is not None:
            doc.structured_content = req.structured_content
            # Re-sync terms if structured content updated
            legal_terms_service.sync_document_terms(db, doc, req.structured_content)

        db.commit()
        db.refresh(doc)
        return doc

    @staticmethod
    def duplicate_document(db: Session, doc_id: int, user: User) -> Document:
        """Creates a duplicated copy of an existing document."""
        source = DocumentService.get_user_document(db, doc_id, user)

        new_doc = Document(
            user_id=user.id,
            title=f"{source.title} (Copy)",
            document_type=source.document_type,
            content=source.content,
            structured_content=source.structured_content,
            branding_config=source.branding_config,
            status="draft"
        )
        db.add(new_doc)
        db.commit()
        db.refresh(new_doc)

        legal_terms_service.sync_document_terms(db, new_doc, source.structured_content)
        db.refresh(new_doc)
        return new_doc

    @staticmethod
    def delete_document(db: Session, doc_id: int, user: User) -> bool:
        """Deletes a user's document."""
        doc = DocumentService.get_user_document(db, doc_id, user)
        db.delete(doc)
        db.commit()
        return True


document_service = DocumentService()
