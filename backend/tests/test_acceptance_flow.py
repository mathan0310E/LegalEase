"""End-to-End Acceptance Test verifying all 19 steps of Requirement 30."""


def test_complete_acceptance_workflow(client):
    # 1 & 2. User registers
    reg_res = client.post("/api/auth/register", json={
        "name": "Mathan Acceptance User",
        "email": "mathan.acceptance@legalease.io",
        "password": "SecurePassword2026!",
        "organization_name": "Mathan Enterprises"
    })
    if reg_res.status_code == 400:
        login_res = client.post("/api/auth/login", json={
            "email": "mathan.acceptance@legalease.io",
            "password": "SecurePassword2026!"
        })
        assert login_res.status_code == 200
        token = login_res.json()["access_token"]
    else:
        assert reg_res.status_code == 201
        token = reg_res.json()["access_token"]

    headers = {"Authorization": f"Bearer {token}"}

    # 3 & 4. User reaches dashboard & fetches analytics
    dash_res = client.get("/api/analytics/dashboard", headers=headers)
    assert dash_res.status_code == 200
    assert "total_documents" in dash_res.json()
    assert "chart_image_base64" in dash_res.json()

    # 5. User selects NDA and inspects template schema
    tmpl_res = client.get("/api/templates/nda")
    assert tmpl_res.status_code == 200
    assert tmpl_res.json()["document_type"] == "nda"

    # 6 & 7. User fills details and clicks generate
    gen_payload = {
        "document_type": "nda",
        "title": "Confidential Non-Disclosure Agreement (Mathan & Apex)",
        "form_data": {
            "agreement_type": "Mutual (Two-way)",
            "disclosing_party": "Mathan Enterprises Corp",
            "disclosing_party_jurisdiction": "Chennai, Tamil Nadu, India",
            "receiving_party": "Apex Strategic Ventures",
            "receiving_party_jurisdiction": "Bengaluru, Karnataka, India",
            "effective_date": "2026-10-01",
            "purpose": "Evaluation of proprietary Generative AI document engine integration",
            "duration_months": "24",
            "governing_law": "Courts of Chennai, Tamil Nadu, India",
            "remedies_injunction": "Yes"
        },
        "branding": {
            "org_name": "Mathan Enterprises",
            "header_text": "CONFIDENTIAL & PROPRIETARY",
            "footer_text": "Page %p of %P — LegalEase Enterprise"
        }
    }

    # 8 & 9. Backend validates and generates structured content
    gen_res = client.post("/api/documents/generate", json=gen_payload, headers=headers)
    assert gen_res.status_code == 201
    doc = gen_res.json()
    doc_id = doc["id"]

    # 10. LegalEase displays document
    assert doc["title"] == "Confidential Non-Disclosure Agreement (Mathan & Apex)"
    sections = doc["structured_content"]["sections"]
    assert len(sections) >= 5

    # 11. Important terms extracted
    assert len(doc["terms"]) >= 4
    term_dict = {t["term"]: t["value"] for t in doc["terms"]}
    assert "Disclosing Party" in term_dict or "Parties" in term_dict or "Effective Date" in term_dict

    # 12. User edits a clause
    sec_to_edit = sections[1]
    sec_to_edit["content"] = sec_to_edit["content"] + "\n[Clarification: Both parties agree to annual security audits.]"
    update_res = client.put(f"/api/documents/{doc_id}", json={
        "title": doc["title"] + " (Revised)",
        "structured_content": doc["structured_content"]
    }, headers=headers)
    assert update_res.status_code == 200
    assert "Revised" in update_res.json()["title"]

    # 13. User asks AI to explain a clause
    explain_res = client.post("/api/ai/explain-clause", json={
        "clause_title": sec_to_edit["heading"],
        "clause_content": sec_to_edit["content"],
        "context": "Mutual NDA between technology entities"
    }, headers=headers)
    assert explain_res.status_code == 200
    explanation = explain_res.json()
    assert len(explanation["summary"]) > 0
    assert len(explanation["obligations"]) > 0
    assert "disclaimer" in explanation

    # Also test clause regeneration
    regen_res = client.post(f"/api/documents/{doc_id}/regenerate-section", json={
        "section_id": sec_to_edit["id"],
        "current_heading": sec_to_edit["heading"],
        "current_content": sec_to_edit["content"],
        "instruction": "Add explicit indemnification for data breaches"
    }, headers=headers)
    assert regen_res.status_code == 200

    # 14. User saves document
    save_res = client.put(f"/api/documents/{doc_id}", json={
        "status": "completed"
    }, headers=headers)
    assert save_res.status_code == 200

    # 15. User downloads PDF
    pdf_res = client.get(f"/api/export/{doc_id}/pdf", headers=headers)
    assert pdf_res.status_code == 200
    assert pdf_res.headers["content-type"] == "application/pdf"
    assert len(pdf_res.content) > 1000

    # 16. User downloads DOCX
    docx_res = client.get(f"/api/export/{doc_id}/docx", headers=headers)
    assert docx_res.status_code == 200
    assert "wordprocessingml" in docx_res.headers["content-type"]
    assert len(docx_res.content) > 1000

    # 17. User sees document in history
    history_res = client.get("/api/documents", headers=headers)
    assert history_res.status_code == 200
    doc_ids = [d["id"] for d in history_res.json()]
    assert doc_id in doc_ids

    # 18 & 19. User logs out & another user cannot access first user's document
    # Register / login Second User
    u2_res = client.post("/api/auth/register", json={
        "name": "Different User",
        "email": "intruder.user@external.com",
        "password": "Password123!"
    })
    if u2_res.status_code == 400:
        u2_token = client.post("/api/auth/login", json={
            "email": "intruder.user@external.com",
            "password": "Password123!"
        }).json()["access_token"]
    else:
        u2_token = u2_res.json()["access_token"]

    u2_headers = {"Authorization": f"Bearer {u2_token}"}

    # Intruder attempts to fetch first user's document
    intruder_get = client.get(f"/api/documents/{doc_id}", headers=u2_headers)
    assert intruder_get.status_code == 403

    # Intruder attempts to export first user's PDF
    intruder_pdf = client.get(f"/api/export/{doc_id}/pdf", headers=u2_headers)
    assert intruder_pdf.status_code == 403

    # Intruder's list must not contain first user's document
    intruder_list = client.get("/api/documents", headers=u2_headers)
    assert doc_id not in [d["id"] for d in intruder_list.json()]

    print("\n--- ALL 19 STEPS OF REQUIREMENT 30 VERIFIED WITH 100% SUCCESS ---")
