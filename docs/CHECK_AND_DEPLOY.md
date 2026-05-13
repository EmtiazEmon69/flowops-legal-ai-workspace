# Check and Deploy FlowOps AI

## Local Check

Backend:

```powershell
cd "C:\Users\emtia\Desktop\FlowOps Legal AI Workspace\backend"
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python -m pytest
uvicorn app.main:app --reload --port 8000
```

Open:

```text
http://localhost:8000/api/v1/health
```

Expected:

```json
{"status":"ok","service":"FlowOps AI API"}
```

Frontend:

Install Node.js LTS first if `npm` is not available.

```powershell
cd "C:\Users\emtia\Desktop\FlowOps Legal AI Workspace\apps\web"
npm install
npm run build
npm run dev
```

Open:

```text
http://localhost:3000
```

## Zero-Cost Deployment Path

Use this setup when you want no hosting cost:

- Frontend: Vercel Hobby plan
- Backend: Render Free web service
- Database: Supabase Free or Neon Free
- AI: `AI_MOCK_MODE=true` to avoid paid OpenAI API usage

Real OpenAI calls can cost money. Keep mock mode on while testing for free.

## Render Backend Settings

Create a Render Web Service from your GitHub repo.

```text
Root Directory: backend
Build Command: pip install -r requirements.txt
Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
Instance Type: Free
```

Environment variables:

```text
DATABASE_URL=<your hosted postgres connection string>
AI_MOCK_MODE=true
OPENAI_API_KEY=<only add this when you want real paid AI calls>
```

## Vercel Frontend Settings

Create a Vercel project from the same GitHub repo.

```text
Root Directory: apps/web
Build Command: npm run build
Output: Next.js default
```

## What Works Now

- Backend health endpoint
- Client create/list endpoints
- Document upload queue endpoint
- Reminder sample endpoint
- AI draft endpoint in real or mock mode
- AI search endpoint as a placeholder response
- Dashboard UI with sample operational data

## What Needs Provider Connection

- Real OCR
- SMS and WhatsApp sending
- Email sending
- Vector search
- Production authentication
- Production file storage

