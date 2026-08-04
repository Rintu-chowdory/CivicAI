"""CivicAI backend — MVP stub.

Single /ask endpoint. Answers are hardcoded for now; swap generate_answer()
for a real RAG pipeline (official laws, Merkblätter, court rulings) once
the knowledge base exists. Keeping the endpoint shape stable lets the
frontend switch from demo mode to live mode without changes.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Literal

app = FastAPI(title="CivicAI API")

# Tighten this to your deployed frontend origin(s) before going to production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST"],
    allow_headers=["*"],
)


class Question(BaseModel):
    question: str


class Answer(BaseModel):
    summary: str
    legalBasis: str
    nextSteps: list[str]
    confidence: Literal["high", "medium", "low"]


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/ask", response_model=Answer)
def ask(payload: Question):
    return generate_answer(payload.question)


def generate_answer(question: str) -> Answer:
    q = question.lower()

    if "kontoauszug" in q or "jobcenter" in q:
        return Answer(
            summary=(
                "Das Jobcenter darf im Rahmen der Mitwirkungspflicht "
                "(§ 60 SGB I) Kontoauszüge der letzten drei Monate anfordern, "
                "um Ihren Leistungsanspruch zu prüfen."
            ),
            legalBasis="§ 60 SGB I, § 56 SGB II",
            nextSteps=[
                "Kontoauszüge der letzten 3 Monate zusammenstellen",
                "Auf hohe Geldeingänge achten und ggf. kurz erklären",
                "Frist im Schreiben notieren und einhalten",
            ],
            confidence="high",
        )

    return Answer(
        summary=(
            "Für diese konkrete Frage liegt noch keine geprüfte Quelle vor. "
            "Formulieren Sie die Frage gerne genauer, oder wenden Sie sich "
            "an eine Beratungsstelle in Ihrer Nähe."
        ),
        legalBasis="Keine eindeutige Zuordnung möglich",
        nextSteps=[
            "Frage möglichst konkret stellen (Behörde, Thema, Frist)",
            "Amtliches Schreiben griffbereit halten",
            "Bei Unsicherheit: unabhängige Beratungsstelle kontaktieren",
        ],
        confidence="low",
    )
