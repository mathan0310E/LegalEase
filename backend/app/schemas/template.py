from typing import List, Optional, Any, Dict
from pydantic import BaseModel, ConfigDict


class TemplateField(BaseModel):
    name: str
    label: str
    field_type: str = "text"  # text, textarea, date, number, select
    required: bool = True
    placeholder: str = ""
    help_text: str = ""
    default: Optional[str] = ""
    options: Optional[List[str]] = None


class TemplateResponse(BaseModel):
    id: int
    name: str
    document_type: str
    description: str
    category: str
    fields_schema: List[Dict[str, Any]]

    model_config = ConfigDict(from_attributes=True)
