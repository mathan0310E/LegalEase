import io
import base64
from datetime import datetime
from typing import Dict, Any, List
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

from sqlalchemy.orm import Session
from app.models.document import Document
from app.models.user import User


class AnalyticsService:
    @staticmethod
    def get_user_analytics(db: Session, user: User) -> Dict[str, Any]:
        """Calculates rich statistical metrics using NumPy and renders a visualization using Matplotlib."""
        documents: List[Document] = db.query(Document).filter(Document.user_id == user.id).all()

        total_docs = len(documents)
        now = datetime.utcnow()
        current_month_docs = sum(1 for d in documents if d.created_at.year == now.year and d.created_at.month == now.month)

        # Breakdown by type
        by_type: Dict[str, int] = {}
        by_status: Dict[str, int] = {}
        section_counts = []

        for doc in documents:
            dtype_label = doc.document_type.replace('_', ' ').title()
            by_type[dtype_label] = by_type.get(dtype_label, 0) + 1
            by_status[doc.status] = by_status.get(doc.status, 0) + 1

            structured = doc.structured_content or {}
            secs = structured.get("sections", [])
            section_counts.append(len(secs))

        # NumPy statistical processing
        if section_counts:
            np_sections = np.array(section_counts)
            avg_sections = float(np.mean(np_sections))
            std_sections = float(np.std(np_sections))
        else:
            avg_sections = 0.0
            std_sections = 0.0

        # Generate Matplotlib Chart
        chart_base64 = AnalyticsService._render_analytics_chart(by_type, section_counts, total_docs)

        # Timeline activity
        activity_timeline = []
        for doc in sorted(documents, key=lambda d: d.created_at, reverse=True)[:7]:
            activity_timeline.append({
                "id": doc.id,
                "title": doc.title,
                "document_type": doc.document_type,
                "created_at": doc.created_at.isoformat(),
                "status": doc.status
            })

        return {
            "total_documents": total_docs,
            "documents_this_month": current_month_docs,
            "by_type": by_type,
            "by_status": by_status,
            "avg_sections": round(avg_sections, 1),
            "std_sections": round(std_sections, 1),
            "chart_image_base64": chart_base64,
            "activity_timeline": activity_timeline
        }

    @staticmethod
    def _render_analytics_chart(by_type: Dict[str, int], section_counts: List[int], total_docs: int) -> str:
        """Renders an executive dark-themed chart using Matplotlib and encodes to base64 PNG."""
        plt.style.use('dark_background')
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4), facecolor='#0f172a')
        ax1.set_facecolor('#0f172a')
        ax2.set_facecolor('#0f172a')

        # Chart 1: Document Types
        if by_type:
            types = list(by_type.keys())
            counts = list(by_type.values())
            y_pos = np.arange(len(types))
            bars = ax1.barh(y_pos, counts, color='#38bdf8', alpha=0.85, edgecolor='#0284c7', height=0.55)
            ax1.set_yticks(y_pos)
            ax1.set_yticklabels(types, fontsize=8.5, color='#e2e8f0')
            ax1.set_xlabel('Documents Created', fontsize=8.5, color='#94a3b8')
            ax1.set_title('Documents by Classification', fontsize=10.5, fontweight='bold', color='#f8fafc', pad=10)
            ax1.grid(axis='x', linestyle='--', alpha=0.2, color='#94a3b8')
            for bar in bars:
                w = bar.get_width()
                ax1.text(w + 0.1, bar.get_y() + bar.get_height() / 2, f'{int(w)}',
                         ha='left', va='center', fontsize=8, color='#38bdf8', fontweight='bold')
        else:
            ax1.text(0.5, 0.5, 'No documents generated yet', ha='center', va='center', color='#64748b')
            ax1.set_title('Documents by Classification', fontsize=10.5, fontweight='bold', color='#f8fafc')

        # Chart 2: Section Density / Structure Metrics
        if section_counts:
            data = np.array(section_counts)
            bins = max(3, min(len(data), 6))
            n, _, patches = ax2.hist(data, bins=bins, color='#818cf8', alpha=0.85, edgecolor='#4f46e5', rwidth=0.8)
            ax2.set_title('Clause Density Distribution', fontsize=10.5, fontweight='bold', color='#f8fafc', pad=10)
            ax2.set_xlabel('Clauses per Document', fontsize=8.5, color='#94a3b8')
            ax2.set_ylabel('Frequency', fontsize=8.5, color='#94a3b8')
            ax2.grid(axis='y', linestyle='--', alpha=0.2, color='#94a3b8')
        else:
            ax2.text(0.5, 0.5, 'Create documents to view analytics', ha='center', va='center', color='#64748b')
            ax2.set_title('Clause Density Distribution', fontsize=10.5, fontweight='bold', color='#f8fafc')

        plt.tight_layout(pad=2.0)

        buf = io.BytesIO()
        plt.savefig(buf, format='png', dpi=120, bbox_inches='tight', facecolor=fig.get_facecolor(), edgecolor='none')
        plt.close(fig)
        buf.seek(0)
        return base64.b64encode(buf.getvalue()).decode('utf-8')


analytics_service = AnalyticsService()
