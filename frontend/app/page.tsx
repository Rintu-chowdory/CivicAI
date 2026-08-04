"use client";

import { useState } from "react";
import {
  Upload,
  ArrowRight,
  CheckCircle2,
  FileText,
  Sparkles,
  Calculator,
  Building2,
  Euro,
  Home as HomeIcon,
  Lock,
  ArrowUpRight,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TrustBadge, { type Confidence } from "@/components/TrustBadge";

type Answer = {
  summary: string;
  legalBasis: string;
  nextSteps: string[];
  confidence: Confidence;
};

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

const STATS = [
  { value: "3", label: "offene Fristen" },
  { value: "2", label: "analysierte Schreiben" },
  { value: "1", label: "Antwortentwurf" },
];

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
      setAnswer(await res.json());
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
    <div className="min-h-screen bg-canvas">
      <Sidebar />

      <div className="lg:pl-60">
        <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10">
          {/* Topbar */}
          <div className="mb-10 flex items-center justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-wide text-ink/45">
                Demo-Übersicht
              </p>
              <p className="text-sm text-ink/60">Ihr persönlicher Überblick</p>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-sm text-ink/70">
                Willkommen, Demo-Nutzer
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-seal-light text-xs font-medium text-seal">
                DN
              </span>
            </div>
          </div>

          {/* Hero */}
          <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_280px]">
            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-seal">
                CivicAI · Klarheit im Alltag
              </p>
              <h1 className="mb-4 max-w-xl text-4xl font-bold leading-[1.12] tracking-tight sm:text-[2.75rem]">
                Behörden verstehen. Rechte kennen. Sicher handeln.
              </h1>
              <p className="mb-6 max-w-md text-sm leading-relaxed text-ink/65">
                CivicAI hilft Ihnen, offizielle Schreiben verständlich
                einzuordnen und die nächsten Schritte vorzubereiten. Ruhig,
                transparent und in klarer Sprache.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#brief-analysieren"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-seal px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                >
                  Brief analysieren
                  <ArrowRight size={15} />
                </a>
                <a
                  href="#rechte-coach"
                  className="inline-flex items-center rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-ink hover:bg-seal-light"
                >
                  Frage stellen
                </a>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
              <p className="mb-3 font-mono text-[11px] uppercase tracking-wide text-ink/45">
                Ihr nächster Schritt
              </p>
              <p className="mb-3 text-sm font-semibold">
                Ein Schreiben einordnen
              </p>
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-seal-light text-seal">
                <FileText size={16} />
              </div>
              <p className="mb-3 text-xs leading-relaxed text-ink/60">
                PDF, DOCX oder Bild auswählen. Die Demo zeigt anschließend
                eine Beispielanalyse.
              </p>
              <a
                href="#demo-auswertung"
                className="text-xs font-medium text-seal underline underline-offset-2"
              >
                Demo-Analyse öffnen
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-border bg-surface p-5 shadow-card"
              >
                <p className="text-3xl font-bold">{s.value}</p>
                <p className="text-sm text-ink/55">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Brief analysieren */}
          <section id="brief-analysieren" className="mb-4 scroll-mt-8">
            <p className="mb-1 font-mono text-xs uppercase tracking-wide text-seal">
              01 · Brief analysieren
            </p>
            <h2 className="mb-1 text-2xl font-bold">
              Was steht in Ihrem Schreiben?
            </h2>
            <p className="mb-5 text-sm text-ink/60">
              Laden Sie ein Dokument hoch oder öffnen Sie die transparente
              Beispielanalyse.
            </p>
          </section>

          <div className="mb-12 grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-surface px-6 py-12 text-center">
              <span className="mb-1 flex h-10 w-10 items-center justify-center rounded-lg bg-seal-light text-seal">
                <Upload size={18} />
              </span>
              <p className="text-sm font-medium">Dokument auswählen</p>
              <p className="max-w-[220px] text-xs text-ink/50">
                PDF-Upload ist noch nicht angebunden — dieses Feld ist eine
                Vorschau des geplanten Moduls.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
              <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-ink/45">
                Demo-Eingang
              </p>
              <p className="mb-1 text-sm font-semibold">Jobcenter Musterstadt</p>
              <p className="mb-4 text-xs text-ink/55">
                Bescheid zur Prüfung der Mitwirkung · Beispiel
              </p>
              <div className="rounded-lg bg-signal-amber-light px-3 py-2.5 text-xs text-signal-amber">
                <span className="font-semibold">Demo-Analyse — </span>
                diese Inhalte sind beispielhaft und ersetzen keine Prüfung
                Ihres konkreten Falls.
              </div>
            </div>
          </div>

          {/* Demo Auswertung */}
          <section id="demo-auswertung" className="mb-14 scroll-mt-8">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="mb-1 font-mono text-xs uppercase tracking-wide text-ink/45">
                  Demo-Auswertung
                </p>
                <h2 className="text-2xl font-bold">
                  Ein Schreiben, verständlich erklärt
                </h2>
              </div>
              <TrustBadge confidence="medium" />
            </div>

            <div className="rounded-xl border border-border bg-surface shadow-card">
              <div className="border-b border-border bg-seal-light/60 px-6 py-4">
                <p className="font-mono text-[11px] uppercase tracking-wide text-ink/45">
                  Behörde
                </p>
                <p className="text-sm font-semibold">Jobcenter Musterstadt</p>
              </div>

              <div className="grid gap-6 border-b border-border px-6 py-5 sm:grid-cols-2">
                <div>
                  <p className="mb-1 font-mono text-[11px] uppercase tracking-wide text-ink/45">
                    Betreff
                  </p>
                  <p className="text-sm">Aufforderung zur Mitwirkung</p>
                </div>
                <div>
                  <p className="mb-1 font-mono text-[11px] uppercase tracking-wide text-ink/45">
                    Frist
                  </p>
                  <p className="text-sm font-medium text-signal-amber">
                    30.04.2026
                  </p>
                </div>
                <div>
                  <p className="mb-1 font-mono text-[11px] uppercase tracking-wide text-ink/45">
                    Benötigte Unterlagen
                  </p>
                  <p className="text-sm">Kontoauszüge, Mietnachweis</p>
                </div>
                <div>
                  <p className="mb-1 font-mono text-[11px] uppercase tracking-wide text-ink/45">
                    Mögliche Rechtsgrundlage
                  </p>
                  <p className="text-sm">§ 60 SGB I</p>
                </div>
              </div>

              <div className="space-y-4 px-6 py-5">
                <div>
                  <p className="mb-1 text-sm font-semibold">
                    Zusammenfassung in einfacher Sprache
                  </p>
                  <p className="text-sm leading-relaxed text-ink/70">
                    Die Behörde bittet Sie, bestimmte Unterlagen
                    nachzureichen. Reagieren Sie innerhalb der genannten
                    Frist, oder erklären Sie frühzeitig, warum Sie mehr Zeit
                    benötigen. Bewahren Sie eine Kopie Ihrer Antwort auf.
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-sm font-semibold">
                    Wenn Sie nicht reagieren
                  </p>
                  <p className="text-sm leading-relaxed text-ink/70">
                    Die Behörde kann auf Grundlage der vorhandenen
                    Informationen entscheiden. Welche Folgen das im
                    Einzelfall hat, klärt am zuverlässigsten eine
                    Beratungsstelle.
                  </p>
                </div>
                <div className="rounded-lg bg-signal-amber-light px-4 py-3 text-xs leading-relaxed text-signal-amber">
                  <span className="font-semibold">Hinweis zur Sicherheit — </span>
                  die Demo erkennt Muster, prüft aber nicht Ihren Einzelfall.
                  Bei dringenden oder komplexen Fragen wenden Sie sich an
                  eine qualifizierte Beratungsstelle.
                </div>
              </div>

              <div className="border-t border-border px-6 py-5">
                <p className="mb-3 text-sm font-semibold">Nächste Schritte</p>
                <ul className="space-y-2">
                  {[
                    "Frist im Kalender notieren und Originalschreiben aufbewahren",
                    "Verlangte Unterlagen und mögliche Lücken zusammentragen",
                    "Bei Bedarf eine Fristverlängerung schriftlich anfragen",
                  ].map((step) => (
                    <li
                      key={step}
                      className="flex items-start gap-2 text-sm text-ink/75"
                    >
                      <CheckCircle2
                        size={16}
                        className="mt-0.5 shrink-0 text-signal-green"
                      />
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Rechte-Coach — the working part */}
          <section id="rechte-coach" className="mb-4 scroll-mt-8">
            <p className="mb-1 font-mono text-xs uppercase tracking-wide text-seal">
              02 · Rechte-Coach
            </p>
            <h2 className="mb-1 text-2xl font-bold">
              Eine Frage. Ein klarer nächster Schritt.
            </h2>
            <p className="mb-5 flex items-center gap-1.5 text-sm text-ink/60">
              <Sparkles size={14} className="text-seal" />
              Dieses Modul ist bereits funktionsfähig — probieren Sie es aus.
            </p>
          </section>

          <div className="mb-16 grid gap-5 sm:grid-cols-2">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-5 shadow-card"
            >
              <label htmlFor="question" className="sr-only">
                Ihre Frage an CivicAI
              </label>
              <textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="z. B. Muss ich dem Jobcenter meine Kontoauszüge schicken?"
                rows={5}
                className="w-full resize-none rounded-lg border border-border bg-canvas/40 p-3.5 text-sm leading-relaxed placeholder:text-ink/40 focus:border-seal"
              />
              <button
                type="submit"
                disabled={loading || !question.trim()}
                className="self-start rounded-lg bg-seal px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                {loading ? "Wird geprüft …" : "Frage stellen"}
              </button>
            </form>

            <div
              aria-live="polite"
              className="rounded-xl border border-border bg-surface p-5 shadow-card"
            >
              {!answer && (
                <p className="flex h-full min-h-[160px] items-center text-sm text-ink/45">
                  Stellen Sie links eine Frage — die Antwort erscheint hier
                  mit Quelle und Vertrauens-Ampel.
                </p>
              )}
              {answer && (
                <div key={resultKey}>
                  <div className="mb-3">
                    <TrustBadge confidence={answer.confidence} animate />
                  </div>
                  {demoMode && (
                    <p className="mb-3 rounded-lg bg-signal-amber-light px-3 py-2 text-xs text-signal-amber">
                      Demo-Modus — noch kein Backend verbunden.
                    </p>
                  )}
                  <p className="mb-3 text-sm leading-relaxed text-ink/80">
                    {answer.summary}
                  </p>
                  <p className="mb-1 font-mono text-[11px] uppercase tracking-wide text-ink/45">
                    Rechtliche Grundlage
                  </p>
                  <p className="mb-3 text-sm text-ink/70">
                    {answer.legalBasis}
                  </p>
                  <p className="mb-1 font-mono text-[11px] uppercase tracking-wide text-ink/45">
                    Nächste Schritte
                  </p>
                  <ul className="space-y-1.5">
                    {answer.nextSteps.map((step) => (
                      <li
                        key={step}
                        className="flex items-start gap-2 text-sm text-ink/70"
                      >
                        <CheckCircle2
                          size={14}
                          className="mt-0.5 shrink-0 text-signal-green"
                        />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>


          {/* Tools — neue Helfer für den Alltag */}
          <section id="tools" className="mb-4 scroll-mt-8">
            <p className="mb-1 font-mono text-xs uppercase tracking-wide text-seal">
              03 · Weitere Tools
            </p>
            <h2 className="mb-1 text-2xl font-bold">
              Praktische Helfer für Ihren Alltag
            </h2>
            <p className="mb-5 text-sm text-ink/60">
              Weitere Werkzeuge, die Ihnen helfen, Fristen zu berechnen,
              die richtige Behörde zu finden und Kosten einzuschätzen.
            </p>
          </section>

          <div className="mb-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <a
              href="/fristen-rechner"
              className="group rounded-xl border border-border bg-surface p-5 shadow-card transition-all hover:border-seal/30 hover:shadow-lg"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-seal-light text-seal">
                <Calculator size={18} />
              </div>
              <p className="mb-1 text-sm font-semibold">Fristen-Rechner</p>
              <p className="mb-2 text-xs leading-relaxed text-ink/55">
                Berechnet rechtliche Fristen für Widerspruch, Klage und
                Wiedereinsetzung — inklusive Wochenende- und Feiertagsregelung.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-seal">
                Öffnen <ArrowUpRight size={12} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </a>

            <a
              href="/behorden-finder"
              className="group rounded-xl border border-border bg-surface p-5 shadow-card transition-all hover:border-seal/30 hover:shadow-lg"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-seal-light text-seal">
                <Building2 size={18} />
              </div>
              <p className="mb-1 text-sm font-semibold">Behörden-Finder</p>
              <p className="mb-2 text-xs leading-relaxed text-ink/55">
                Findet die zuständige Behörde für Ihr Anliegen — von
                Jobcenter bis Finanzamt, mit Kontakthinweisen und
                benötigten Dokumenten.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-seal">
                Öffnen <ArrowUpRight size={12} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </a>

            <a
              href="/kostenrechner"
              className="group rounded-xl border border-border bg-surface p-5 shadow-card transition-all hover:border-seal/30 hover:shadow-lg"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-seal-light text-seal">
                <Euro size={18} />
              </div>
              <p className="mb-1 text-sm font-semibold">Kostenrechner</p>
              <p className="mb-2 text-xs leading-relaxed text-ink/55">
                Schätzt Gerichtskosten und Anwaltsgebühren basierend
                auf dem Streitwert — nach GKG und RVG.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-seal">
                Öffnen <ArrowUpRight size={12} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </a>

            <a
              href="/mietrechts-checker"
              className="group rounded-xl border border-border bg-surface p-5 shadow-card transition-all hover:border-seal/30 hover:shadow-lg"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-seal-light text-seal">
                <HomeIcon size={18} />
              </div>
              <p className="mb-1 text-sm font-semibold">Mietrechts-Checker</p>
              <p className="mb-2 text-xs leading-relaxed text-ink/55">
                Prüft häufige Mietrechts-Themen: Mieterhöhung, Kaution,
                Schönheitsreparaturen, Eigenbedarf und Nebenkosten.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-seal">
                Öffnen <ArrowUpRight size={12} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </a>

            <a
              href="/datenschutz"
              className="group rounded-xl border border-border bg-surface p-5 shadow-card transition-all hover:border-seal/30 hover:shadow-lg"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-seal-light text-seal">
                <Lock size={18} />
              </div>
              <p className="mb-1 text-sm font-semibold">Datenschutz</p>
              <p className="mb-2 text-xs leading-relaxed text-ink/55">
                DSGVO-konforme Datenschutzerklärung mit allen Rechten
                nach Art. 15–21 DSGVO und Beschwerderecht.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-seal">
                Öffnen <ArrowUpRight size={12} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </a>
          </div>

          <footer className="border-t border-border pb-10 pt-6 text-xs text-ink/45">
            CivicAI ersetzt keine Rechtsberatung. Bei Unsicherheit wenden
            Sie sich an eine unabhängige Beratungsstelle.
          </footer>
        </div>
      </div>
    </div>
  );
}
