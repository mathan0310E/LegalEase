from typing import List
from fastapi import APIRouter, HTTPException, status

from app.schemas.template import TemplateResponse
from app.prompts.templates_data import DOCUMENT_TEMPLATES

router = APIRouter(prefix="/api/templates", tags=["Templates"])


@router.get("", response_model=List[TemplateResponse])
def list_templates():
    """Returns all 8 available legal document templates with dynamic form field schemas."""
    response = []
    for idx, t in enumerate(DOCUMENT_TEMPLATES, 1):
        response.append(
            TemplateResponse(
                id=idx,
                name=t["name"],
                document_type=t["document_type"],
                description=t["description"],
                category=t["category"],
                fields_schema=t["fields_schema"]
            )
        )
    return response


@router.get("/{document_type}", response_model=TemplateResponse)
def get_template(document_type: str):
    """Retrieves field definitions for a specific document type."""
    for idx, t in enumerate(DOCUMENT_TEMPLATES, 1):
        if t["document_type"].lower() == document_type.lower():
            return TemplateResponse(
                id=idx,
                name=t["name"],
                document_type=t["document_type"],
                description=t["description"],
                category=t["category"],
                fields_schema=t["fields_schema"]
            )
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Template for '{document_type}' not found."
    )
