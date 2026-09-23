from sqlalchemy import Column, Integer, String, Text, JSON

from app.database import Base


class Template(Base):
    __tablename__ = "templates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    document_type = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), default="Business", nullable=False)
    fields_schema = Column(JSON, nullable=False, default=list)
    prompt_template = Column(Text, nullable=False)
