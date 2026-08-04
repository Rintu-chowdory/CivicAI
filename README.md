# CivicAI

KI für faire, verständliche und transparente Behördenkommunikation.

Ein Projekt, das Bürgern hilft, Behördenschreiben zu verstehen, Fristen im Blick zu behalten und rechtssichere Antworten zu verfassen — basierend auf offiziellen Gesetzen und Quellen (RAG statt reiner Chatbot).

Live demo (frontend, demo mode until the backend is deployed): https://rintu-chowdory.github.io/CivicAI/

## Struktur

```
CivicAI/
├── frontend/   Next.js (static export) — deployed to GitHub Pages
└── backend/    FastAPI — deploy separately (e.g. Render); GitHub Pages only serves static files
```

## Module

### Bestehende Module
- **AI Rechte Coach** — Fragen an Behörden verstehen, mit Vertrauens-Ampel und Rechtsgrundlage
- **Brief Scanner (OCR)** — Behördenschreiben hochladen und verständlich erklärt bekommen
- **Demo-Auswertung** — Beispielhafte Analyse eines Jobcenter-Schreibens

### Neue Tools
- **Fristen-Rechner** — Berechnet rechtliche Fristen (Widerspruch, Klage, Wiedereinsetzung) nach VwGO, SGG, AO — inkl. Wochenende- und Feiertagsregelung
- **Behörden-Finder** — Findet die zuständige Behörde für Ihr Anliegen (Jobcenter, Finanzamt, Ausländerbehörde, u.v.m.)
- **Kostenrechner** — Schätzt Gerichtskosten und Anwaltsgebühren nach GKG und RVG basierend auf dem Streitwert
- **Mietrechts-Checker** — Interaktive Prüfung häufiger Mietrechts-Themen (Mieterhöhung, Kaution, Schönheitsreparaturen, Eigenbedarf, Nebenkosten)

### Geplante Module
- Dokument Checker
- Widerspruch Generator
- Rechte Navigator
- Termin Coach
- Timeline
- Behörden-Wissen (RAG-Datenbank)

### Rechtliches
- **Datenschutz** — DSGVO-konforme Datenschutzerklärung mit allen Rechten nach Art. 15–21 DSGVO

## Lokale Entwicklung

### Frontend

```bash
cd frontend
npm install
npm run dev        # http://localhost:3000
```

### Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload   # http://localhost:8000
```

Point the frontend at your local backend by copying `frontend/.env.example` to `frontend/.env.local` and setting `NEXT_PUBLIC_API_URL=http://localhost:8000`. Without it, the frontend runs in demo mode with hardcoded example answers.

## Deployment

### Frontend → GitHub Pages (automatic)

`.github/workflows/deploy-pages.yml` builds and deploys on every push to `main` that touches `frontend/`.

One-time setup required: repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.

To connect the live backend, add a repo variable: **Settings → Secrets and variables → Actions → Variables → New repository variable → `NEXT_PUBLIC_API_URL` → your backend's URL**.

### Backend → Render (or similar)

GitHub Pages cannot run FastAPI. Deploy `backend/` to Render, Railway, or Fly.io, then wire its URL into the frontend as above.

## Tech Stack

- **Frontend:** Next.js, Tailwind CSS, lucide-react
- **Backend:** FastAPI, RAG
- **DB:** PostgreSQL + Vektorsuche
- **Cache:** Redis
- **Deployment:** Docker, Kubernetes

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/health` | GET | Health check |
| `/ask` | POST | Rechte-Coach: Frage beantworten |
| `/fristen` | POST | Fristen-Rechner: Frist berechnen |
| `/behorden-finder` | POST | Behörden-Finder: Zuständige Behörde finden |
| `/kostenrechner` | POST | Kostenrechner: Gerichts- und Anwaltskosten schätzen |
| `/mietrechts-check` | POST | Mietrechts-Checker: Mietrechts-Themen prüfen |

## Disclaimer

CivicAI ersetzt keine Rechtsberatung. Bei Unsicherheit wenden Sie sich an eine unabhängige Beratungsstelle.
