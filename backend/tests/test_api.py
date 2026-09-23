import pytest


def test_health_check(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "app_name" in data


def test_user_registration_and_login(client):
    # 1. Register User 1
    reg_payload = {
        "name": "Alice Counsel",
        "email": "alice@legaltest.io",
        "password": "Password123!",
        "organization_name": "Counsel Law Corp"
    }
    res = client.post("/api/auth/register", json=reg_payload)
    assert res.status_code == 201
    reg_data = res.json()
    assert "access_token" in reg_data
    assert reg_data["user"]["email"] == "alice@legaltest.io"

    # Duplicate registration should fail
    dup_res = client.post("/api/auth/register", json=reg_payload)
    assert dup_res.status_code == 400

    # 2. Login
    login_payload = {
        "email": "alice@legaltest.io",
        "password": "Password123!"
    }
    log_res = client.post("/api/auth/login", json=login_payload)
    assert log_res.status_code == 200
    token = log_res.json()["access_token"]

    # 3. Check /api/auth/me
    headers = {"Authorization": f"Bearer {token}"}
    me_res = client.get("/api/auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["name"] == "Alice Counsel"


def test_unauthorized_access(client):
    res = client.get("/api/documents")
    assert res.status_code == 401


def test_document_generation_and_terms(client):
    # Register and get token
    reg = client.post("/api/auth/register", json={
        "name": "Bob Partner",
        "email": "bob@legaltest.io",
        "password": "Password123!",
        "organization_name": "Bob & Partners"
    }).json()
    token = reg["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Generate an NDA
    gen_payload = {
        "document_type": "nda",
        "title": "Mutual NDA Bob & Partner",
        "form_data": {
            "disclosing_party": "Bob & Partners LLC",
            "receiving_party": "Target Corp",
            "effective_date": "2026-11-01",
            "purpose": "Evaluation of confidential merger proposals",
            "duration_months": "36",
            "governing_law": "Tamil Nadu, India"
        }
    }
    gen_res = client.post("/api/documents/generate", json=gen_payload, headers=headers)
    assert gen_res.status_code == 201
    doc = gen_res.json()
    doc_id = doc["id"]
    assert doc["title"] == "Mutual NDA Bob & Partner"
    assert len(doc["structured_content"]["sections"]) >= 5
    assert len(doc["terms"]) >= 1

    # Fetch document by id
    get_res = client.get(f"/api/documents/{doc_id}", headers=headers)
    assert get_res.status_code == 200
    assert get_res.json()["id"] == doc_id

    # Test term endpoint
    terms_res = client.get(f"/api/documents/{doc_id}/terms", headers=headers)
    assert terms_res.status_code == 200
    assert len(terms_res.json()) >= 1


def test_clause_regeneration_and_explainer(client):
    reg = client.post("/api/auth/register", json={
        "name": "Clara Lawyer",
        "email": "clara@legaltest.io",
        "password": "Password123!"
    }).json()
    headers = {"Authorization": f"Bearer {reg['access_token']}"}

    gen_res = client.post("/api/documents/generate", json={
        "document_type": "employment_agreement",
        "form_data": {
            "employer_name": "Alpha Corp",
            "employee_name": "John Specialist",
            "compensation": "₹1,500,000",
            "notice_period_days": "45"
        }
    }, headers=headers).json()
    doc_id = gen_res["id"]
    first_sec = gen_res["structured_content"]["sections"][0]

    # Test clause regeneration
    regen_res = client.post(f"/api/documents/{doc_id}/regenerate-section", json={
        "section_id": first_sec["id"],
        "current_heading": first_sec["heading"],
        "current_content": first_sec["content"],
        "instruction": "Strengthen non-solicitation covenants"
    }, headers=headers)
    assert regen_res.status_code == 200
    assert "updated_content" in regen_res.json()

    # Test clause explainer
    explain_res = client.post("/api/ai/explain-clause", json={
        "clause_title": "Intellectual Property Assignment",
        "clause_content": "All inventions created during employment shall be work-made-for-hire.",
        "context": "Software development role"
    }, headers=headers)
    assert explain_res.status_code == 200
    assert len(explain_res.json()["obligations"]) > 0
    assert "disclaimer" in explain_res.json()


def test_document_exports(client):
    reg = client.post("/api/auth/register", json={
        "name": "David Exporter",
        "email": "david@legaltest.io",
        "password": "Password123!"
    }).json()
    headers = {"Authorization": f"Bearer {reg['access_token']}"}

    gen_res = client.post("/api/documents/generate", json={
        "document_type": "nda",
        "form_data": {
            "disclosing_party": "David Corp",
            "receiving_party": "Global Tech",
            "purpose": "Technical collaboration"
        }
    }, headers=headers).json()
    doc_id = gen_res["id"]

    # PDF Export
    pdf_res = client.get(f"/api/export/{doc_id}/pdf", headers=headers)
    assert pdf_res.status_code == 200
    assert pdf_res.headers["content-type"] == "application/pdf"
    assert len(pdf_res.content) > 1000

    # DOCX Export
    docx_res = client.get(f"/api/export/{doc_id}/docx", headers=headers)
    assert docx_res.status_code == 200
    assert "wordprocessingml" in docx_res.headers["content-type"]
    assert len(docx_res.content) > 1000

    # TXT Export
    txt_res = client.get(f"/api/export/{doc_id}/txt", headers=headers)
    assert txt_res.status_code == 200
    assert "text/plain" in txt_res.headers["content-type"]
    assert "DISCLOSING PARTY" in txt_res.text.upper()


def test_user_isolation(client):
    # User 1
    u1 = client.post("/api/auth/register", json={
        "name": "User One",
        "email": "user1@isolation.io",
        "password": "Password123!"
    }).json()
    headers1 = {"Authorization": f"Bearer {u1['access_token']}"}

    # User 2
    u2 = client.post("/api/auth/register", json={
        "name": "User Two",
        "email": "user2@isolation.io",
        "password": "Password123!"
    }).json()
    headers2 = {"Authorization": f"Bearer {u2['access_token']}"}

    # User 1 creates document
    doc1 = client.post("/api/documents/generate", json={
        "document_type": "nda",
        "title": "User 1 Secret NDA",
        "form_data": {"disclosing_party": "Confidential Corp", "receiving_party": "Partner Inc"}
    }, headers=headers1).json()
    doc1_id = doc1["id"]

    # User 2 attempts to read User 1's document -> Forbidden (403)
    read_res = client.get(f"/api/documents/{doc1_id}", headers=headers2)
    assert read_res.status_code == 403

    # User 2 attempts to export User 1's document -> Forbidden (403)
    export_res = client.get(f"/api/export/{doc1_id}/pdf", headers=headers2)
    assert export_res.status_code == 403

    # User 2 attempts to delete User 1's document -> Forbidden (403)
    del_res = client.delete(f"/api/documents/{doc1_id}", headers=headers2)
    assert del_res.status_code == 403

    # User 2's document list should NOT contain User 1's document
    list_res = client.get("/api/documents", headers=headers2)
    assert len(list_res.json()) == 0
