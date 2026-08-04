"use client";

import { useState } from "react";

type Confidence = "high" | "medium" | "low";

type Answer = {
  summary: string;
  legalBasis: string;
  nextSteps: string[];
  confidence: Confidence;
};

const CONFIDENCE_LABEL: Record<Confidence, string> = {
  high: "Sehr sicher",
  medium: "Mittlere Sicherheit",
  low: "Unsicher",
};

const CONFIDENCE_COLOR: Record<Confidence, string> = {
  high: "bg-signal-green",
  medium: "bg-signal-amber",
  low: "bg-signal-red",
};

// Demo responses used when no backend is connected yet, so the deployed
// page stays meaningfully interactive before /ask exists.
const DEMO_CASES: { match: RegExp; answer: Answer }[] = [
  {
    match: /kontoauszug|jobcenter/i,
    answer: {
      summary:
        "Das Jobcenter darf im Rahmen der Mitwirkungspflicht (§ 60 SGB I) Kontoauszüge der letzten drei Monate anfordern, um Ihren Leistungsanspruch zu prüfen.",
      legalBasis: "§ 60 SGB I, § 56 SGB II",
      nextSteps: [
        "Kontoauszüge der letzten 3 Monate zusammenstellen",
        "Auf hohe Geldeingänge achten und ggf. kurz erklären",
        "Frist im Schreiben notieren und einhalten",
      ],
      confidence: "high",
    },
  },
  {
    match: /pass|ausländerbehörde/i,
    answer: {
      summary:
        "Die Ausländerbehörde darf einen Pass zur Prüfung einbehalten, muss dies aber begründen und ist verpflichtet, eine Ersatzbescheinigung auszustellen.",
      legalBasis: "§ 48 AufenthG",
      nextSteps: [
        "Nach dem Grund der Einbehaltung fragen",
        "Ersatzbescheinigung (Fiktionsbescheinigung) verlangen",
        "Bei Unsicherheit eine Beratungsstelle einschalten",
      ],
      confidence: "medium",
    },
  },
];

const FALLBACK_ANSWER: Answer = {
  summary:
    "Für diese konkrete Frage liegt noch keine geprüfte Quelle vor. Formulieren Sie die Frage gerne genauer, oder wenden Sie sich an eine Beratungsstelle in Ihrer Nähe.",
  legalBasis: "Keine eindeutige Zuordnung möglich",
  nextSteps: [
    "Frage möglichst konkret stellen (Behörde, Thema, Frist)",
    "Amtliches Schreiben griffbereit halten",
    "Bei Unsicherheit: unabhängige Beratungsstelle kontaktieren",
  ],
  confidence: "low",
};

function getDemoAnswer(question: string): Answer {
  const hit = DEMO_CASES.find((c) => c.match.test(question));
  return hit ? hit.answer : FALLBACK_ANSWER;
}

export default function Home() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [resultKey, setResultKey] = useState(0);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);

    try {
      if (!apiUrl) throw new Error("no-backend-configured");
      const res = await fetch(`${apiUrl}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      if (!res.ok) throw new Error("backend-error");
      const data: Answer = await res.json();
      setAnswer(data);
      setDemoMode(false);
    } catch {
      setAnswer(getDemoAnswer(question));
      setDemoMode(true);
    } finally {
      setResultKey((k) => k + 1);
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-14 sm:py-20">
      <header className="mb-14 flex flex-col gap-3 border-b border-line pb-8">
        <div className="flex items-center justify-between gap-4">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-seal">
            CivicAI
          </p>
          <p className="font-mono text-xs text-ink/50">
            Az. CIVIC/2026/{String(resultKey + 1).padStart(3, "0")}
          </p>
        </div>
        <h1 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
          Amtshilfe, verständlich.
        </h1>
        <p className="max-w-xl text-sm text-ink/70">
          Stellen Sie eine Frage zu einem Behördenschreiben. Jede Antwort
          nennt ihre Quelle und zeigt offen, wie sicher sie ist.
        </p>
      </header>

      <div className="grid gap-8 sm:grid-cols-2">
        <section aria-labelledby="frage-heading">
          <h2
            id="frage-heading"
            className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-ink/80"
          >
            Ihre Anfrage
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label htmlFor="question" className="sr-only">
              Ihre Frage an CivicAI
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="z. B. Muss ich dem Jobcenter meine Kontoauszüge schicken?"
              rows={6}
              className="w-full resize-none rounded-sm border border-line bg-white/60 p-4 text-sm leading-relaxed text-ink placeholder:text-ink/40 focus:border-seal"
            />

            <div className="rounded-sm border border-dashed border-line bg-white/30 p-4 text-xs text-ink/50">
              PDF-Upload &amp; Fristenerkennung — Modul in Entwicklung
            </div>

            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="self-start rounded-sm bg-seal px-5 py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {loading ? "Wird geprüft …" : "Frage stellen"}
            </button>
          </form>
        </section>

        <section aria-labelledby="antwort-heading" aria-live="polite">
          <h2
            id="antwort-heading"
            className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-ink/80"
          >
            Antwort
          </h2>

          {!answer && (
            <div className="flex h-full min-h-[220px] items-center rounded-sm border border-line bg-white/30 p-6 text-sm text-ink/50">
              Stellen Sie links eine Frage — die Antwort erscheint hier mit
              Quelle und Vertrauens-Ampel.
            </div>
          )}

          {answer && (
            <div
              key={resultKey}
              className="rounded-sm border border-line bg-white/60 p-6"
            >
              <div className="mb-4 flex items-center gap-3">
                <span
                  className={`inline-flex h-9 w-9 shrink-0 animate-stamp items-center justify-center rounded-full border-2 border-ink/20 ${CONFIDENCE_COLOR[answer.confidence]}`}
                  aria-hidden="true"
                />
                <p className="font-mono text-xs uppercase tracking-wide text-ink/70">
                  {CONFIDENCE_LABEL[answer.confidence]}
                </p>
              </div>

              {demoMode && (
                <p className="mb-4 rounded-sm bg-signal-amber/10 px-3 py-2 text-xs text-signal-amber">
                  Demo-Modus — noch kein Backend verbunden. Dies ist eine
                  Beispielantwort.
                </p>
              )}

              <p className="mb-4 text-sm leading-relaxed text-ink">
                {answer.summary}
              </p>

              <p className="mb-1 font-mono text-xs uppercase tracking-wide text-ink/50">
                Rechtliche Grundlage
              </p>
              <p className="mb-4 text-sm text-ink/80">{answer.legalBasis}</p>

              <p className="mb-1 font-mono text-xs uppercase tracking-wide text-ink/50">
                Nächste Schritte
              </p>
              <ul className="list-inside list-disc text-sm text-ink/80">
                {answer.nextSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>

      <footer className="mt-16 border-t border-line pt-6 text-xs text-ink/50">
        <p>
          CivicAI ersetzt keine Rechtsberatung. Bei Unsicherheit wenden Sie
          sich an eine unabhängige Beratungsstelle.
        </p>
      </footer>
    </main>
  );
}
