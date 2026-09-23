from typing import List, Optional
from pydantic import BaseModel


class ExplainClauseRequest(BaseModel):
    clause_title: str
    clause_content: str
    context: Optional[str] = ""


class ExplainClauseResponse(BaseModel):
    clause_title: str
    summary: str
    obligations: List[str]
    key_conditions: List[str]
    review_considerations: List[str]
    disclaimer: str = (
        "LegalEase provides AI-generated document drafts and clause explanations for informational purposes only. "
        "This explanation does not constitute legal advice."
    )
