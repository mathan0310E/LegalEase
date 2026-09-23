from typing import Dict, List, Any
from pydantic import BaseModel


class AnalyticsResponse(BaseModel):
    total_documents: int
    documents_this_month: int
    by_type: Dict[str, int]
    by_status: Dict[str, int]
    avg_sections: float
    chart_image_base64: str
    activity_timeline: List[Dict[str, Any]]
