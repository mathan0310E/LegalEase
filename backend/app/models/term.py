from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class DocumentTerm(Base):
    __tablename__ = "document_terms"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True)
    term = Column(String(150), nullable=False)
    value = Column(String(500), nullable=False)
    category = Column(String(100), default="General", nullable=False)

    document = relationship("Document", back_populates="terms")
