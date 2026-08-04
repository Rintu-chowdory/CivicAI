# CivicAI

KI für faire, verständliche und transparente Behördenkommunikation.

Ein Projekt, das Bürgern hilft, Behördenschreiben zu verstehen, Fristen
im Blick zu behalten und rechtssichere Antworten zu verfassen —
basierend auf offiziellen Gesetzen und Quellen (RAG statt reiner Chatbot).

**Live demo (frontend, demo mode until the backend is deployed):**
`https://rintu-chowdory.github.io/CivicAI/`

## Struktur

```
CivicAI/
├── frontend/   Next.js (static export) — deployed to GitHub Pages
└── backend/    FastAPI — deploy separately (e.g. Render); GitHub Pages only serves static files
```

## Lokale Entwicklung

Frontend:

```bash
cd frontend
npm install
npm run dev        # http://localhost:3000
```

Backend:

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload   # http://localhost:8000
```

Point the frontend at your local backend by copying `frontend/.env.example`
to `frontend/.env.local` and setting `NEXT_PUBLIC_API_URL=http://localhost:8000`.
Without it, the frontend runs in demo mode with hardcoded example answers.

## Deployment

**Frontend → GitHub Pages (automatic):** `.github/workflows/deploy-pages.yml`
builds and deploys on every push to `main` that touches `frontend/`. One-time
setup required: repo **Settings → Pages → Build and deployment → Source:
GitHub Actions**.

To connect the live backend, add a repo variable (not secret, since it's
public anyway): **Settings → Secrets and variables → Actions → Variables →
New repository variable** → `NEXT_PUBLIC_API_URL` → your backend's URL.

**Backend → Render (or similar):** GitHub Pages cannot run FastAPI. Deploy
`backend/` to Render, Railway, or Fly.io, then wire its URL into the
frontend as above.

## Geplante Module

- AI Rechte Coach
- Brief Scanner (OCR)
- Dokument Checker
- Widerspruch Generator
- Rechte Navigator
- Termin Coach
- Timeline
- Behörden-Wissen (RAG-Datenbank)

## Tech Stack

- Frontend: Next.js, Tailwind CSS
- Backend: FastAPI, RAG
- DB: PostgreSQL + Vektorsuche
- Cache: Redis
- Deployment: Docker, Kubernetes
