from fastapi import APIRouter, Depends
from app.models.user import User
from app.schemas.ai import ExplainClauseRequest, ExplainClauseResponse
from app.services.auth_service import get_current_user
from app.services.gemini_service import gemini_service

router = APIRouter(prefix="/api/ai", tags=["AI Services"])


@router.post("/explain-clause", response_model=ExplainClauseResponse)
async def explain_clause(
    req: ExplainClauseRequest,
    current_user: User = Depends(get_current_user)
):
    """Explains a complex legal clause in plain English, analyzing obligations and key conditions."""
    explanation = await gemini_service.explain_clause(
        clause_title=req.clause_title,
        clause_content=req.clause_content,
        context=req.context or ""
    )
    return ExplainClauseResponse(
        clause_title=explanation.get("clause_title", req.clause_title),
        summary=explanation.get("summary", ""),
        obligations=explanation.get("obligations", []),
        key_conditions=explanation.get("key_conditions", []),
        review_considerations=explanation.get("review_considerations", []),
        disclaimer=explanation.get(
            "disclaimer",
            "LegalEase provides AI-generated clause explanations for informational purposes only. This does not constitute legal advice."
        )
    )
