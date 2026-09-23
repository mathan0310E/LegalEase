# LegalEase — AI-Powered Legal Document Generator

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg?logo=react&logoColor=black)](https://reactjs.org)
[![Google Gemini](https://img.shields.io/badge/Gemini_2.5_Flash-Google_Cloud-4285F4.svg?logo=google&logoColor=white)](https://cloud.google.com/vertex-ai)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-06B6D4.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

LegalEase is a full-stack, enterprise-grade AI legal document generation platform built with **Google Gemini Generative AI**, **FastAPI**, **React**, and **TypeScript**. It empowers organizations, attorneys, and business operators to draft, refine, brand, explain, and export presentation-grade legal agreements in seconds without creative hallucination.

---

## 1. Project Overview

Drafting commercial and operational agreements is notoriously slow, costly, and prone to formatting errors. Traditional templates lack context, while generic chat interfaces frequently hallucinate names, dates, amounts, and unenforceable provisions.

**LegalEase bridges this gap:**
- Dynamic parameter collection tailored to each agreement classification.
- Controlled structured JSON generation via Gemini with strict factual guardrails.
- Clause studio enabling inline clause revisions, section reordering, and targeted AI refinement.
- Plain-language AI clause explanations identifying legal obligations and risk conditions.
- Real-time key contract parameter extraction displayed in interactive summary tables.
- Multi-format document compilation for ReportLab (PDF), python-docx (DOCX), and clean plain text (TXT).
- Statistical portfolio insights computed via NumPy and visualized through Matplotlib.

---

## 2. Key Features

- **8 Standardized Document Types**:
  1. Mutual & Unilateral Non-Disclosure Agreement (NDA)
  2. Full-Time Employment Agreement
  3. Commercial & Residential Property Lease Agreement
  4. Master Service Agreement (MSA)
  5. Executive Offer Letter
  6. General Business Partnership Agreement
  7. Freelance & Independent Contractor Agreement
  8. General Bilateral Legal Agreement
- **Zero-Hallucination Structured Prompting**: Enforces strict adherence to user facts. Missing parameters are denoted with explicit placeholders rather than invented terms.
- **Interactive Clause Studio**: Add, edit, reorder (move up/down), or delete clauses.
- **Targeted Clause Regeneration**: Ask AI to improve or rewrite an individual clause without re-generating the rest of the agreement.
- **AI Clause Explainer**: Plain-English breakdowns showing obligations, triggers, and review points for legal counsel.
- **Automatic Term Extraction**: Automatically parses effective dates, payment schedules, duration, and governing law into a key deal points table.
- **Enterprise Branding**: Customize company logos, signatory titles, running headers, footers, and font styling for exports.
- **Multi-Format Export**: One-click download as PDF (ReportLab with running page numbers), Word (.docx), or plain text.
- **Document History & Isolation**: Cryptographically protected via JWT. Users can only access, duplicate, or delete their own agreements.
- **Data Science Analytics**: Integrated NumPy processing and Matplotlib dark-themed charting rendering portfolio metrics.

---

## 3. Architecture

```
Frontend (React + TypeScript + Vite + Tailwind CSS)
                      ↓  REST API (Axios + JWT)
FastAPI REST Service (Python 3.11+ / 3.14)
   ├── Routers: /auth, /templates, /documents, /ai, /export, /analytics, /health
   ├── Services:
   │     ├── GeminiService (google-genai SDK + Structured Fallback)
   │     ├── DocumentService (CRUD, Versioning, User Isolation)
   │     ├── LegalTermsService (Key parameter extraction)
   │     ├── ExportService (ReportLab PDF, python-docx DOCX, Plain TXT)
   │     └── AnalyticsService (NumPy computation & Matplotlib visualizer)
   └── Persistence:
         └── SQLite Database (with seamless Cloud SQL PostgreSQL migration path)
```

---

## 4. Technology Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS with custom legal enterprise theme
- **Icons**: Lucide React
- **HTTP Client**: Axios with JWT Bearer interceptor

### Backend
- **Framework**: FastAPI (asynchronous ASGI)
- **Validation**: Pydantic v2
- **ORM & Database**: SQLAlchemy 2.0 with SQLite (configurable to PostgreSQL)
- **Authentication**: JWT (`python-jose`) with bcrypt password hashing
- **AI / LLM**: Google Gemini 2.5 Flash via `google-genai` official SDK

### Document Processing & Analytics
- **PDF Engine**: ReportLab Flowables & Canvas
- **Word Engine**: `python-docx`
- **Analytics & Visuals**: NumPy & Matplotlib (`Agg` non-interactive backend)

---

## 5. Installation

### Prerequisites
- Node.js v18+ (tested on Node v24)
- Python 3.11+ (tested on Python 3.14)
- Git

### Clone & Repository Setup
```bash
git clone https://github.com/your-org/legalease.git
cd legalease
```

---

## 6. Environment Variables

Create `.env` inside `backend/`:

```env
APP_NAME=LegalEase
ENVIRONMENT=development
PORT=8000
DEBUG=True

# Database (SQLite for local dev, PostgreSQL for production)
DATABASE_URL=sqlite:///./legalease.db

# Security & JWT
JWT_SECRET=supersecret-legalease-jwt-token-key-change-in-prod-2026
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Google Gemini API Key (Get from Google AI Studio)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash

# CORS Allowed Origins
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000
```

> **Note**: If `GEMINI_API_KEY` is left blank, LegalEase automatically engages its built-in deterministic legal synthesis engine so you can evaluate the complete end-to-end workflow offline without an active key.

---

## 7. Running Locally

### Backend Setup & Launch
```bash
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows (PowerShell):
.\.venv\Scripts\Activate.ps1
# macOS / Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI development server
uvicorn app.main:app --reload --port 8000
```
Backend API will be accessible at: `http://localhost:8000`  
Interactive Swagger documentation: `http://localhost:8000/docs`

### Frontend Setup & Launch
Open a second terminal:
```bash
cd frontend

# Install Node dependencies
npm install

# Start Vite dev server
npm run dev
```
Frontend Web Application will be live at: `http://localhost:5173`

---

## 8. API Documentation

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Login and receive JWT access token | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes |
| `PUT` | `/api/auth/profile` | Update user and organization branding | Yes |
| `GET` | `/api/templates` | Retrieve 8 agreement templates & schemas | No |
| `GET` | `/api/templates/{type}` | Get dynamic schema for single document type | No |
| `GET` | `/api/documents` | List user's documents | Yes |
| `POST` | `/api/documents/generate` | Generate complete document with Gemini | Yes |
| `GET` | `/api/documents/{id}` | Retrieve full document with clauses & terms | Yes |
| `PUT` | `/api/documents/{id}` | Update document clauses or metadata | Yes |
| `DELETE` | `/api/documents/{id}` | Delete user's document | Yes |
| `POST` | `/api/documents/{id}/duplicate` | Clone document into new draft | Yes |
| `POST` | `/api/documents/{id}/regenerate-section` | AI targeted clause refinement | Yes |
| `GET` | `/api/documents/{id}/terms` | Get extracted key terms table | Yes |
| `POST` | `/api/ai/explain-clause` | AI explanation of legal clause in plain English | Yes |
| `GET` | `/api/export/{id}/pdf` | Download ReportLab executive PDF | Yes |
| `GET` | `/api/export/{id}/docx` | Download Microsoft Word .docx | Yes |
| `GET` | `/api/export/{id}/txt` | Download UTF-8 Plain text file | Yes |
| `GET` | `/api/analytics/dashboard` | NumPy statistical metrics & Matplotlib chart | Yes |
| `GET` | `/api/health` | Container and load-balancer health probe | No |

---

## 9. Gemini Configuration & Prompt Engineering

LegalEase uses the official `google-genai` SDK:
- **Model**: `gemini-2.5-flash`
- **Temperature**: `0.2` (Low temperature ensures high factual accuracy and minimizes creativity)
- **MIME Type**: `application/json` (Ensures strict programmatic compliance)
- **Prompt Rules**:
  1. Never invent names, dates, financial amounts, obligations, or facts.
  2. Maintain professional contract drafting tone.
  3. Extract key deal parameters into a structured array.
  4. Append standard legal safety disclaimers.

---

## 10. Database Setup

LegalEase uses SQLAlchemy with declarative models:
- `users`: User profiles, credentials, branding preferences.
- `documents`: Document title, type, full text, structured JSON clauses, status, created/updated timestamps.
- `document_terms`: Normalized key-value terms linked to parent documents.
- `templates`: Dynamic schemas for the 8 document types.

To reset or seed demonstration data:
```bash
cd backend
python -c "from app.database import Base, engine, SessionLocal; from app.utils.seed_demo import seed_demo_data; Base.metadata.create_all(bind=engine); db = SessionLocal(); seed_demo_data(db); db.close()"
```

Demo User Credentials:
- **Email**: `demo@legalease.io`
- **Password**: `DemoPassword123!`

---

## 11. Automated Testing

LegalEase includes comprehensive automated test coverage for authentication, unauthorized rejection, AI generation, term extraction, clause refinement, explainer, multi-format exports, and multi-tenant user isolation.

Run pytest:
```bash
cd backend
python -m pytest -v tests/test_api.py
```

Expected output:
```
tests/test_api.py::test_health_check PASSED
tests/test_api.py::test_user_registration_and_login PASSED
tests/test_api.py::test_unauthorized_access PASSED
tests/test_api.py::test_document_generation_and_terms PASSED
tests/test_api.py::test_clause_regeneration_and_explainer PASSED
tests/test_api.py::test_document_exports PASSED
tests/test_api.py::test_user_isolation PASSED
======================= 7 passed in 4.5s =======================
```

---

## 12. Google Cloud Deployment

LegalEase is containerized and ready for Google Cloud Run:

### 1. Build & Deploy Backend on Google Cloud Run
```bash
cd backend

# Build image using Cloud Build
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/legalease-backend

# Deploy to Cloud Run
gcloud run deploy legalease-backend \
  --image gcr.io/YOUR_PROJECT_ID/legalease-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY="your_api_key",JWT_SECRET="production_jwt_secret"
```

### 2. Build & Deploy Frontend to Firebase Hosting or Cloud Run
```bash
cd frontend

# Set production API URL in .env.production
echo "VITE_API_URL=https://legalease-backend-YOUR_HASH-uc.a.run.app/api" > .env.production

# Build production bundle
npm run build

# Deploy via Firebase Hosting or Cloud Storage
firebase deploy --only hosting
```

---

## 13. Screenshots & Demonstration Flow

1. **Enterprise Dashboard**: Real-time portfolio metrics, quick actions, and Matplotlib statistical visualizer.
2. **Dynamic Generation Wizard**: Intelligent form fields mapped to legal agreement types.
3. **Clause Studio**: Section reordering, inline editing, and targeted AI clause refinement.
4. **AI Clause Explainer**: Instant plain-language analysis of obligations, conditions, and review points.
5. **Key Terms Table**: Extracted parameters highlighting financial consideration, duration, and jurisdiction.
6. **Multi-Format Export**: Executive PDF with ReportLab running headers and signature lines, Microsoft Word DOCX, and plain text.

---

## 14. Team & Engineering Credits

- **Mathan Kumar** — Lead Generative AI & Full-Stack Architect
- **LegalEase Engineering Team** — Cloud Architecture, Prompt Engineering & Compliance

---

## 15. Legal Safety Disclaimer

> **IMPORTANT**: LegalEase provides AI-generated document drafts for informational and administrative drafting purposes. These documents do not constitute legal advice and should always be reviewed and executed under the supervision of a qualified legal attorney.
