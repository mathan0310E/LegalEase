"""Demo data generator for LegalEase."""
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.document import Document
from app.services.auth_service import hash_password
from app.services.legal_terms_service import legal_terms_service
from app.services.gemini_service import gemini_service


def seed_demo_data(db: Session) -> User:
    """Seeds a demonstration user with pre-generated legal agreements."""
    demo_email = "demo@legalease.io"
    user = db.query(User).filter(User.email == demo_email).first()

    if not user:
        user = User(
            name="Mathan Kumar",
            email=demo_email,
            password_hash=hash_password("DemoPassword123!"),
            organization_name="Apex Global Technologies",
            logo_url=""
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # Check existing documents
    existing_docs = db.query(Document).filter(Document.user_id == user.id).count()
    if existing_docs == 0:
        # 1. Demo NDA
        nda_data = {
            "agreement_type": "Mutual (Two-way)",
            "disclosing_party": "Apex Global Technologies Pvt Ltd",
            "disclosing_party_jurisdiction": "Chennai, Tamil Nadu, India",
            "receiving_party": "Vanguard Softworks LLC",
            "receiving_party_jurisdiction": "San Francisco, CA, USA",
            "effective_date": "2026-10-01",
            "purpose": "Evaluating potential enterprise AI data-lake joint venture and technical evaluation.",
            "duration_months": "24",
            "governing_law": "Courts of Chennai, Tamil Nadu, India",
            "remedies_injunction": "Yes"
        }
        nda_doc_structured = gemini_service._fallback_generate_document("nda", nda_data, "NON-DISCLOSURE AGREEMENT (DEMO)")
        doc1 = Document(
            user_id=user.id,
            title="[SAMPLE] Mutual Non-Disclosure Agreement (Apex & Vanguard)",
            document_type="nda",
            content="# MUTUAL NON-DISCLOSURE AGREEMENT\n\nConfidentiality Agreement between Apex Global and Vanguard Softworks.",
            structured_content=nda_doc_structured,
            branding_config={"org_name": "Apex Global Technologies", "header_text": "DEMO DOCUMENT • SAMPLE ONLY", "footer_text": "Page %p of %P — Generated via LegalEase AI"},
            status="completed"
        )
        db.add(doc1)
        db.commit()
        db.refresh(doc1)
        legal_terms_service.sync_document_terms(db, doc1, nda_doc_structured)

        # 2. Demo Employment Contract
        emp_data = {
            "employer_name": "Apex Global Technologies Pvt Ltd",
            "employer_address": "Tech Corridor, OMR, Chennai",
            "employee_name": "Devi Priya",
            "job_title": "Lead Generative AI Engineer",
            "start_date": "2026-11-01",
            "employment_type": "Full-Time",
            "compensation": "₹2,500,000 per annum + Equity Options",
            "probation_period_months": "3",
            "notice_period_days": "60",
            "governing_law": "Tamil Nadu, India"
        }
        emp_structured = gemini_service._fallback_generate_document("employment_agreement", emp_data, "EMPLOYMENT AGREEMENT (DEMO)")
        doc2 = Document(
            user_id=user.id,
            title="[SAMPLE] Employment Agreement — Lead AI Engineer",
            document_type="employment_agreement",
            content="# EMPLOYMENT CONTRACT\n\nFull-time employment agreement for Lead Generative AI Engineer.",
            structured_content=emp_structured,
            branding_config={"org_name": "Apex Global Technologies", "header_text": "CONFIDENTIAL HR DRAFT • SAMPLE", "footer_text": "Generated via LegalEase AI"},
            status="completed"
        )
        db.add(doc2)
        db.commit()
        db.refresh(doc2)
        legal_terms_service.sync_document_terms(db, doc2, emp_structured)

        # 3. Demo Lease Agreement
        lease_data = {
            "landlord_name": "Apex Realty Holdings",
            "tenant_name": "Kavitha Raman",
            "property_address": "Unit 502, Prestige Cyber Towers, Guindy, Chennai - 600032",
            "lease_start_date": "2026-10-15",
            "lease_period_months": "11",
            "monthly_rent": "₹75,000 per month",
            "security_deposit": "₹450,000 (Refundable)",
            "maintenance_charges": "₹6,000 monthly",
            "notice_period_months": "2",
            "governing_law": "Chennai, Tamil Nadu, India"
        }
        lease_structured = gemini_service._fallback_generate_document("lease_agreement", lease_data, "COMMERCIAL LEASE AGREEMENT (DEMO)")
        doc3 = Document(
            user_id=user.id,
            title="[SAMPLE] Commercial Office Lease Agreement (Guindy Unit 502)",
            document_type="lease_agreement",
            content="# COMMERCIAL LEASE AGREEMENT\n\nProperty lease agreement between Apex Realty and Kavitha Raman.",
            structured_content=lease_structured,
            branding_config={"org_name": "Apex Realty Holdings", "header_text": "COMMERCIAL REAL ESTATE LEASE • SAMPLE", "footer_text": "Generated via LegalEase AI"},
            status="completed"
        )
        db.add(doc3)
        db.commit()
        db.refresh(doc3)
        legal_terms_service.sync_document_terms(db, doc3, lease_structured)

    return user
