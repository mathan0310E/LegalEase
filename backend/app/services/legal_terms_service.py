import re
from typing import List, Dict, Any
from sqlalchemy.orm import Session

from app.models.term import DocumentTerm
from app.models.document import Document


class LegalTermsService:
    @staticmethod
    def sync_document_terms(db: Session, document: Document, structured_content: Dict[str, Any]) -> List[DocumentTerm]:
        """Synchronizes and persists extracted legal terms for a document."""
        # Remove old terms
        db.query(DocumentTerm).filter(DocumentTerm.document_id == document.id).delete()

        terms_to_save: List[DocumentTerm] = []
        raw_terms = structured_content.get("important_terms", [])

        # If structured content has terms, use them
        if raw_terms and isinstance(raw_terms, list):
            for item in raw_terms:
                if isinstance(item, dict) and "term" in item and "value" in item:
                    term_obj = DocumentTerm(
                        document_id=document.id,
                        term=str(item.get("term", "")).strip(),
                        value=str(item.get("value", "")).strip(),
                        category=str(item.get("category", "General")).strip()
                    )
                    terms_to_save.append(term_obj)

        # In addition, extract any key contract patterns directly from the document text
        if not terms_to_save:
            extracted = LegalTermsService.extract_from_text(document.content)
            for item in extracted:
                terms_to_save.append(
                    DocumentTerm(
                        document_id=document.id,
                        term=item["term"],
                        value=item["value"],
                        category=item.get("category", "General")
                    )
                )

        if terms_to_save:
            db.add_all(terms_to_save)
            db.commit()

        return terms_to_save

    @staticmethod
    def extract_from_text(text: str) -> List[Dict[str, str]]:
        """Fallback regex term extractor to discover terms from raw legal text."""
        extracted = []

        # Effective date pattern
        date_match = re.search(r"effective as of ([A-Za-z0-9, -]+)", text, re.IGNORECASE)
        if date_match:
            extracted.append({"term": "Effective Date", "value": date_match.group(1).strip(), "category": "Duration"})

        # Governing law pattern
        law_match = re.search(r"laws of ([A-Za-z0-9, -]+)", text, re.IGNORECASE)
        if law_match:
            extracted.append({"term": "Governing Law", "value": law_match.group(1).strip(), "category": "Legal"})

        # Notice period pattern
        notice_match = re.search(r"(\d+\s+(?:days?|months?))\s+written notice", text, re.IGNORECASE)
        if notice_match:
            extracted.append({"term": "Notice Period", "value": notice_match.group(1).strip(), "category": "Termination"})

        return extracted


legal_terms_service = LegalTermsService()
