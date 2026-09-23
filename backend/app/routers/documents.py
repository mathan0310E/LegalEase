from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.document import Document
from app.schemas.document import (
    DocumentResponse,
    DocumentSummaryResponse,
    DocumentGenerateRequest,
    DocumentUpdateRequest,
    RegenerateSectionRequest,
    RegenerateSectionResponse,
    DocumentTermResponse
)
from app.services.auth_service import get_current_user
from app.services.document_service import document_service
from app.services.gemini_service import gemini_service

router = APIRouter(prefix="/api/documents", tags=["Documents"])


@router.get("", response_model=List[DocumentSummaryResponse])
def list_documents(
    skip: int = 0,
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieves all documents belonging to the authenticated user."""
    docs = document_service.list_user_documents(db, current_user, limit=limit, skip=skip)
    results = []
    for d in docs:
        results.append(DocumentSummaryResponse(
            id=d.id,
            title=d.title,
            document_type=d.document_type,
            status=d.status,
            created_at=d.created_at,
            updated_at=d.updated_at,
            terms_count=len(d.terms) if d.terms else 0
        ))
    return results


@router.post("/generate", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def generate_document(
    req: DocumentGenerateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generates a complete structured legal agreement using Gemini AI."""
    doc = await document_service.generate_and_save(
        db=db,
        user=current_user,
        document_type=req.document_type,
        form_data=req.form_data,
        title=req.title,
        branding=req.branding
    )
    return doc


@router.get("/{id}", response_model=DocumentResponse)
def get_document(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieves a single document with full sections and extracted terms."""
    return document_service.get_user_document(db, id, current_user)


@router.put("/{id}", response_model=DocumentResponse)
def update_document(
    id: int,
    req: DocumentUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Updates document title, clauses, or branding configuration."""
    return document_service.update_document(db, id, current_user, req)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_document(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Deletes a document owned by the authenticated user."""
    document_service.delete_document(db, id, current_user)
    return None


@router.post("/{id}/duplicate", response_model=DocumentResponse)
def duplicate_document(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Clones a document into a new draft."""
    return document_service.duplicate_document(db, id, current_user)


@router.get("/{id}/terms", response_model=List[DocumentTermResponse])
def get_document_terms(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieves the extracted legal terms table for a document."""
    doc = document_service.get_user_document(db, id, current_user)
    return doc.terms


@router.post("/{id}/regenerate-section", response_model=RegenerateSectionResponse)
async def regenerate_section(
    id: int,
    req: RegenerateSectionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Uses Gemini AI to rewrite/improve a single clause based on user instructions."""
    # Ensure user has access to document
    doc = document_service.get_user_document(db, id, current_user)

    result = await gemini_service.regenerate_section(
        section_heading=req.current_heading,
        section_content=req.current_content,
        instruction=req.instruction
    )

    # Automatically update the section in the document's structured content if it exists
    structured = dict(doc.structured_content) if doc.structured_content else {}
    sections = structured.get("sections", [])
    updated = False
    for sec in sections:
        if sec.get("id") == req.section_id:
            sec["heading"] = result.get("updated_heading", req.current_heading)
            sec["content"] = result.get("updated_content", req.current_content)
            updated = True
            break

    if updated:
        structured["sections"] = sections
        doc.structured_content = structured
        db.commit()
        db.refresh(doc)

    return RegenerateSectionResponse(
        section_id=req.section_id,
        updated_heading=result.get("updated_heading", req.current_heading),
        updated_content=result.get("updated_content", req.current_content),
        explanation=result.get("explanation", "Clause refined successfully.")
    )
