from fastapi import APIRouter, Depends, Response, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.services.auth_service import get_current_user
from app.services.document_service import document_service
from app.services.export_service import export_service

router = APIRouter(prefix="/api/export", tags=["Export"])


@router.get("/{id}/pdf")
def export_pdf(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Exports document as executive PDF via ReportLab."""
    doc = document_service.get_user_document(db, id, current_user)
    pdf_bytes = export_service.generate_pdf(doc)
    filename = f"{doc.title.replace(' ', '_').lower()}.pdf"

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        }
    )


@router.get("/{id}/docx")
def export_docx(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Exports document as Microsoft Word (.docx)."""
    doc = document_service.get_user_document(db, id, current_user)
    docx_bytes = export_service.generate_docx(doc)
    filename = f"{doc.title.replace(' ', '_').lower()}.docx"

    return Response(
        content=docx_bytes,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        }
    )


@router.get("/{id}/txt")
def export_txt(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Exports document as plain text."""
    doc = document_service.get_user_document(db, id, current_user)
    txt_content = export_service.generate_txt(doc)
    filename = f"{doc.title.replace(' ', '_').lower()}.txt"

    return Response(
        content=txt_content,
        media_type="text/plain; charset=utf-8",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        }
    )
