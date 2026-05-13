# FlowOps AI

AI-powered legal and professional services operations platform.

This starter project includes:

- Next.js dashboard for clients, documents, reminders, drafting, and analytics
- FastAPI backend with MVP endpoints
- OpenAI-powered drafting, summarization, extraction, and search service structure
- SQLAlchemy models for teams, clients, documents, reminders, and AI tasks
- Product docs, roadmap, and database notes

## Project Structure

```text
apps/web      Next.js frontend
backend       FastAPI backend
docs          Product and implementation docs
infra         Deployment notes
```

## Quick Start

Backend:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Frontend:

```bash
cd apps/web
npm install
npm run dev
```

Open the frontend at `http://localhost:3000`.

## MVP Scope

1. Manage clients and matters
2. Upload and classify documents
3. Extract names, dates, addresses, and case details
4. Generate summaries, letters, and email drafts
5. Create and track reminders
6. Show operational dashboard metrics

