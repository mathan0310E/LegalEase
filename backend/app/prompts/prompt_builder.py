import json
from typing import Dict, Any

SYSTEM_INSTRUCTION = """You are a senior legal document drafting assistant. Generate a comprehensive, professional, structured legal contract draft based strictly on the information provided by the user.
CRITICAL RULES:
1. Never invent names, dates, financial amounts, obligations, or facts not provided by the user or clearly implied by standard contract structure.
2. If specific details are not provided by the user, clearly denote them with standard legal placeholders like [To be specified by Parties] rather than fabricating factual claims.
3. Every clause must be clear, legally drafted, well-structured, and divided into logically numbered sections (e.g. 1. Definitions & Scope, 2. Rights and Obligations, 3. Term and Termination, etc.).
4. You must extract and identify important contractual terms (Parties, Effective Date, Duration, Payment/Compensation, Governing Law, Termination Notice, Confidentiality Period) from the drafted text.
5. Return your output as clean, valid JSON only. Do not wrap in backticks or markdown if possible, or format cleanly inside ```json ``` code blocks.
6. Always include the standard LegalEase legal safety disclaimer.
"""

LEGAL_DISCLAIMER = (
    "LegalEase provides AI-generated document drafts for informational and drafting purposes. "
    "These documents do not constitute legal advice and should be reviewed by a qualified legal professional before execution."
)


def build_generation_prompt(document_type: str, form_data: Dict[str, Any], title: str = None) -> str:
    """Constructs the prompt for Gemini document generation."""
    user_inputs_json = json.dumps(form_data, indent=2)
    prompt = f"""Draft a formal, comprehensive '{document_type.replace('_', ' ').title()}' based strictly on the following supplied parameters:

USER SUPPLIED DATA:
{user_inputs_json}

Ensure the output is a valid JSON object matching this exact schema:
{{
  "title": "{title or document_type.replace('_', ' ').title()}",
  "document_type": "{document_type}",
  "effective_date": "YYYY-MM-DD or as specified in input",
  "parties": [
    {{"name": "Party 1 Name", "role": "e.g. Disclosing Party / Employer / Lessor", "details": "Address or jurisdiction"}},
    {{"name": "Party 2 Name", "role": "e.g. Receiving Party / Employee / Lessee", "details": "Address or jurisdiction"}}
  ],
  "sections": [
    {{
      "id": "sec-1",
      "heading": "1. Recitals & Parties",
      "content": "Full clause paragraph text...",
      "order": 1
    }},
    {{
      "id": "sec-2",
      "heading": "2. Scope & Obligations",
      "content": "Full clause paragraph text...",
      "order": 2
    }}
  ],
  "important_terms": [
    {{"term": "Parties", "value": "Disclosing Party / Receiving Party", "category": "General"}},
    {{"term": "Effective Date", "value": "YYYY-MM-DD", "category": "Duration"}},
    {{"term": "Duration / Term", "value": "e.g. 24 Months", "category": "Duration"}},
    {{"term": "Compensation / Payment", "value": "e.g. Amount or N/A", "category": "Financial"}},
    {{"term": "Governing Law", "value": "e.g. State / Country", "category": "Legal"}},
    {{"term": "Termination Notice", "value": "e.g. 30 days", "category": "Termination"}}
  ],
  "disclaimer": "{LEGAL_DISCLAIMER}"
}}

Generate at least 5 to 8 detailed, professional clauses (e.g., Definitions, Covenants/Obligations, Consideration/Payments, Term & Termination, Confidentiality/IP, Indemnification/Remedies, Governing Law & Dispute Resolution, Miscellaneous & Severability).
Return ONLY valid JSON.
"""
    return prompt


def build_clause_regeneration_prompt(section_heading: str, section_content: str, instruction: str) -> str:
    """Prompt for improving/rewriting a specific clause using AI."""
    return f"""You are a professional legal drafting assistant.
You are tasked with revising or improving an individual section of a legal contract based on user instructions.

CURRENT SECTION HEADING:
{section_heading}

CURRENT SECTION CONTENT:
{section_content}

USER REVISION INSTRUCTION:
{instruction}

CRITICAL RULES:
1. Maintain formal legal contract tone.
2. Preserve existing factual references and definitions unless the instruction directs otherwise.
3. Return output as a valid JSON object matching:
{{
  "updated_heading": "...",
  "updated_content": "...",
  "explanation": "Brief 1-2 sentence explanation of improvements made"
}}
Return ONLY valid JSON.
"""


def build_clause_explanation_prompt(clause_title: str, clause_content: str, context: str = "") -> str:
    """Prompt for explaining a clause in plain, accessible language."""
    return f"""You are a legal assistant tasked with explaining a legal contract clause to a business user in simple, plain, accessible language.
Do NOT give legal advice or make definitive legal guarantees.

CLAUSE TITLE:
{clause_title}

CLAUSE TEXT:
{clause_content}

ADDITIONAL CONTEXT (if any):
{context or 'Standard commercial agreement'}

Analyze the clause and respond in valid JSON matching this schema:
{{
  "clause_title": "{clause_title}",
  "summary": "Clear, concise 2-3 sentence overview of what this clause does in plain English.",
  "obligations": [
    "Key obligation 1 created by this clause",
    "Key obligation 2 created by this clause"
  ],
  "key_conditions": [
    "Condition or trigger 1 required for this clause to apply",
    "Timeframe or exception 2"
  ],
  "review_considerations": [
    "Practical question or potential risk the user may want their legal counsel to review"
  ],
  "disclaimer": "LegalEase provides AI-generated clause explanations for informational purposes only. This does not constitute legal advice."
}}
Return ONLY valid JSON.
"""
