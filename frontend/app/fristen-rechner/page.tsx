"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  Info,
  Scale,
  FileText,
  HelpCircle,
  ChevronRight,
  ShieldAlert,
  Send,
  Building2,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

type DeadlineType = {
  id: string;
  name: string;
  duration: { type: "days" | "weeks" | "months"; value: number };
  legalBasis: string;
  category: "Verwaltungsrecht" | "Sozialrecht" | "Steuerrecht";
  description: string;
  nextSteps: string[];
};

const DEADLINE_TYPES: DeadlineType[] = [
  {
    id: "widerspruch-vwgo",
    name: "Widerspruch gegen Verwaltungsakt",
    duration: { type: "months", value: 1 },
    legalBasis: "§ 70 VwGO",
    category: "Verwaltungsrecht",
    description:
      "Allgemeine Frist für den Widerspruch gegen Bescheide von Verwaltungsbehörden (z.B. Bauamt, BAföG-Amt, Gewerbeamt, Kommunen).",
    nextSteps: [
      "Schriftlich Widerspruch einlegen (per Einschreiben mit Rückschein, qualifiziertem Fax oder persönlicher Abgabe mit Empfangsbestätigung).",
      "Zur Fristwahrung zunächst einen fristwahrenden Widerspruch ohne Begründung einreichen ('Begründung folgt in separatem Schreiben').",
      "Akteneinsicht bei der Behörde beantragen, um den Bescheid detailliert zu prüfen und zu begründen.",
    ],
  },
  {
    id: "klage-vwgo",
    name: "Klage nach Widerspruchsbescheid",
    duration: { type: "months", value: 1 },
    legalBasis: "§ 74 VwGO",
    category: "Verwaltungsrecht",
    description:
      "Klagefrist vor dem zuständigen Verwaltungsgericht nach einem zurückgewiesenen Widerspruch.",
    nextSteps: [
      "Prüfen, ob eine rechtliche Vertretung durch einen Fachanwalt für Verwaltungsrecht sinnvoll oder notwendig ist.",
      "Klage schriftlich beim im Bescheid genannten Verwaltungsgericht einreichen.",
      "Kopie des ursprünglichen Bescheids und des Widerspruchsbescheids als Anlage beifügen.",
    ],
  },
  {
    id: "wiedereinsetzung-vwgo",
    name: "Antrag auf Wiedereinsetzung in den vorigen Stand",
    duration: { type: "weeks", value: 2 },
    legalBasis: "§ 60 VwGO",
    category: "Verwaltungsrecht",
    description:
      "Wenn Sie eine gesetzliche Frist ohne eigenes Verschulden versäumt haben (z. B. wegen schwerer Krankheit oder unverschuldeter Abwesenheit).",
    nextSteps: [
      "Das unverschuldete Hindernis durch Nachweise (z.B. ärztliches Attest, Krankenhausbescheinigung) glaubhaft machen.",
      "Die versäumte Rechtshandlung (z. B. Einlegen des Widerspruchs) innerhalb von 2 Wochen nach Wegfall des Hindernisses nachholen.",
      "Gleichzeitig den Antrag auf Wiedereinsetzung bei der zuständigen Stelle stellen.",
    ],
  },
  {
    id: "untaetigkeitsklage-vwgo",
    name: "Untätigkeitsklage",
    duration: { type: "months", value: 3 },
    legalBasis: "§ 75 VwGO",
    category: "Verwaltungsrecht",
    description:
      "Möglichkeit der Klage, wenn die Behörde über einen Antrag oder Widerspruch ohne sachlichen Grund nach 3 Monaten noch nicht entschieden hat.",
    nextSteps: [
      "Schriftliche Sachstandsanfrage an die Behörde senden und eine kurze Stellungnahmefrist setzen.",
      "Prüfen, ob die Behörde zwingende Gründe für die Verzögerung genannt hat.",
      "Bei Fortdauer der Untätigkeit Klage beim Verwaltungsgericht erheben.",
    ],
  },
  {
    id: "widerspruch-sgg",
    name: "Widerspruch bei Sozialleistungen",
    duration: { type: "months", value: 1 },
    legalBasis: "§ 84 SGG",
    category: "Sozialrecht",
    description:
      "Widerspruch gegen Bescheide des Jobcenters, der Agentur für Arbeit, Krankenkasse, Pflegekasse oder Rentenversicherung.",
    nextSteps: [
      "Widerspruch schriftlich bei der erlassenden Sozialbehörde (z.B. Jobcenter) einreichen.",
      "Fehlende Unterlagen oder Nachweise kurzfristig nachreichen.",
      "Unabhängige Sozialberatung (z. B. VdK, SoVD, Caritas, Diakonie) zur Begutachtung hinzuziehen.",
    ],
  },
  {
    id: "klage-sgg",
    name: "Klage im Sozialrecht",
    duration: { type: "months", value: 1 },
    legalBasis: "§ 87 SGG",
    category: "Sozialrecht",
    description:
      "Klage vor dem Sozialgericht nach Erhalt eines negativen Widerspruchsbescheids.",
    nextSteps: [
      "Klage beim zuständigen Sozialgericht erheben (das Verfahren ist für Bürgerinnen und Bürger gerichtskostenfrei).",
      "Den Widerspruchsbescheid in Kopie beifügen.",
      "Gegebenenfalls Beratungshilfe oder Prozesskostenhilfe (PKH) beantragen.",
    ],
  },
  {
    id: "widerspruch-ao",
    name: "Widerspruch / Einspruch im Steuerrecht",
    duration: { type: "months", value: 1 },
    legalBasis: "§ 354 AO",
    category: "Steuerrecht",
    description:
      "Einspruch gegen Steuerbescheide oder Feststellungsbescheide des Finanzamts.",
    nextSteps: [
      "Einspruch schriftlich oder elektronisch (z.B. gesichert über ELSTER) beim Finanzamt einreichen.",
      "Gleichzeitig die 'Aussetzung der Vollziehung' (§ 361 AO) beantragen, falls Nachzahlungen vorerst gestoppt werden sollen.",
      "Begründung und korrigierte Nachweise (Belege, Rechnungen) beim Finanzamt nachreichen.",
    ],
  },
];

type DeliveryMethod = "post" | "electronic" | "direct";

// Helper function: Calculate German statutory holidays
function getGermanHolidays(year: number): Set<string> {
  const holidays = new Set<string>();
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  // Fixed holidays
  holidays.add(`${year}-01-01`); // Neujahr
  holidays.add(`${year}-05-01`); // Tag der Arbeit
  holidays.add(`${year}-10-03`); // Tag der Deutschen Einheit
  holidays.add(`${year}-10-31`); // Reformationstag
  holidays.add(`${year}-11-01`); // Allerheiligen
  holidays.add(`${year}-12-25`); // 1. Weihnachtstag
  holidays.add(`${year}-12-26`); // 2. Weihnachtstag

  // Easter calculation (Meeus/Jones/Butcher algorithm)
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  const easterSunday = new Date(Date.UTC(year, month - 1, day));

  const addDaysToEaster = (days: number) => {
    const res = new Date(easterSunday);
    res.setUTCDate(res.getUTCDate() + days);
    return `${res.getUTCFullYear()}-${pad(res.getUTCMonth() + 1)}-${pad(res.getUTCDate())}`;
  };

  holidays.add(addDaysToEaster(-2)); // Karfreitag
  holidays.add(addDaysToEaster(1)); // Ostermontag
  holidays.add(addDaysToEaster(39)); // Christi Himmelfahrt
  holidays.add(addDaysToEaster(50)); // Pfingstmontag

  return holidays;
}

function isBusinessDay(date: Date): boolean {
  const day = date.getDay();
  if (day === 0 || day === 6) return false; // Weekend

  const year = date.getFullYear();
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const dateStr = `${year}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

  const holidays = getGermanHolidays(year);
  return !holidays.has(dateStr);
}

function getNextBusinessDay(date: Date): { finalDate: Date; shifted: boolean } {
  const cur = new Date(date);
  let shifted = false;

  while (!isBusinessDay(cur)) {
    cur.setDate(cur.getDate() + 1);
    shifted = true;
  }

  return { finalDate: cur, shifted };
}

export default function FristenRechnerPage() {
  const todayStr = useMemo(() => {
    const today = new Date();
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  }, []);

  const [selectedType, setSelectedType] = useState<string>("widerspruch-vwgo");
  const [dateReceived, setDateReceived] = useState<string>(todayStr);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("post");

  const currentTypeConfig = useMemo(() => {
    return (
      DEADLINE_TYPES.find((t) => t.id === selectedType) || DEADLINE_TYPES[0]
    );
  }, [selectedType]);

  // Calculation Logic
  const calculationResult = useMemo(() => {
    if (!dateReceived) return null;

    const baseDate = new Date(dateReceived + "T00:00:00");
    if (isNaN(baseDate.getTime())) return null;

    // Bekanntgabedatum (Notification date)
    // Post or Electronic delivery uses 3-day fiction (§ 41 Abs. 2 VwVfG / § 37 Abs. 2 SGB X)
    const notificationDate = new Date(baseDate);
    if (deliveryMethod === "post" || deliveryMethod === "electronic") {
      notificationDate.setDate(notificationDate.getDate() + 3);
    }

    // Fristbeginn according to § 187 Abs. 1 BGB: Day after notification
    const startDate = new Date(notificationDate);

    // Initial raw deadline calculation
    const rawDeadlineDate = new Date(notificationDate);
    const { type, value } = currentTypeConfig.duration;

    if (type === "months") {
      const targetMonth = rawDeadlineDate.getMonth() + value;
      const targetDay = rawDeadlineDate.getDate();
      rawDeadlineDate.setMonth(targetMonth);
      // Handle month overflow (e.g., Jan 31 + 1 month -> Feb 28/29)
      if (rawDeadlineDate.getDate() !== targetDay) {
        rawDeadlineDate.setDate(0);
      }
    } else if (type === "weeks") {
      rawDeadlineDate.setDate(rawDeadlineDate.getDate() + value * 7);
    } else if (type === "days") {
      rawDeadlineDate.setDate(rawDeadlineDate.getDate() + value);
    }

    // Apply weekend and holiday rule (§ 193 BGB)
    const { finalDate: finalDeadlineDate, shifted } =
      getNextBusinessDay(rawDeadlineDate);

    // Days remaining calculation
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const deadlineMidnight = new Date(finalDeadlineDate);
    deadlineMidnight.setHours(0, 0, 0, 0);

    const diffTime = deadlineMidnight.getTime() - now.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Urgency level
    let urgency: "green" | "amber" | "red" = "green";
    if (daysRemaining < 3) {
      urgency = "red";
    } else if (daysRemaining <= 14) {
      urgency = "amber";
    }

    return {
      baseDate,
      notificationDate,
      startDate,
      rawDeadlineDate,
      finalDeadlineDate,
      shifted,
      daysRemaining,
      urgency,
    };
  }, [dateReceived, deliveryMethod, currentTypeConfig]);

  const formatDateGerman = (d: Date) => {
    return d.toLocaleDateString("de-DE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateShort = (d: Date) => {
    return d.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar />

      <div className="lg:pl-60">
        <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10">
          {/* Topbar */}
          <div className="mb-8 flex flex-col gap-4 border-b border-border/60 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link
                href="/"
                className="mb-2 inline-flex items-center gap-1.5 font-mono text-xs text-ink/60 transition-colors hover:text-seal"
              >
                <ArrowLeft size={14} />
                Zurück zum Dashboard
              </Link>
              <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                Rechtsfristen-Rechner
              </h1>
              <p className="mt-1 text-sm text-ink/65">
                Präzise Fristenberechnung für Widersprüche, Klagen und Anträge
                inklusive der 3-Tage-Fiktion (§ 41 VwVfG) und Wochenendregelung (§ 193 BGB)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-seal-light px-3 py-1 font-mono text-xs font-medium text-seal">
                <Scale size={14} />
                VwGO / SGG / AO
              </span>
            </div>
          </div>

          {/* Legal Disclaimer Banner */}
          <div className="mb-8 rounded-xl border border-signal-amber/30 bg-signal-amber-light/70 p-4 text-xs text-ink">
            <div className="flex items-start gap-3">
              <ShieldAlert
                size={18}
                className="mt-0.5 shrink-0 text-signal-amber"
              />
              <div className="space-y-1">
                <p className="font-semibold text-signal-amber">
                  Rechtlicher Hinweis & Haftungsausschluss
                </p>
                <p className="text-ink/75 leading-relaxed">
                  Dieser Fristen-Rechner bietet eine automatisierte Orientierungshilfe
                  auf Grundlage der allgemeinen deutschen Verfahrensvorschriften. Er
                  ersetzt keine individuelle Rechtsberatung. Bei Fristsachen empfehlen
                  wir im Zweifel die direkte Rücksprache mit der erlassenden Behörde oder
                  einer Rechtsanwaltskanzlei.
                </p>
              </div>
            </div>
          </div>

          {/* Calculator Grid */}
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Form Section (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
                <p className="mb-1 font-mono text-xs uppercase tracking-wide text-seal">
                  01 · Angaben eingeben
                </p>
                <h2 className="mb-5 text-lg font-bold text-ink">
                  Fristdaten auswählen
                </h2>

                <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                  {/* Type Selection */}
                  <div>
                    <label
                      htmlFor="deadline-type"
                      className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/70 font-mono"
                    >
                      Art der Frist
                    </label>
                    <select
                      id="deadline-type"
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full rounded-lg border border-border bg-canvas px-3.5 py-2.5 text-sm font-medium text-ink focus:border-seal focus:outline-none focus:ring-1 focus:ring-seal"
                    >
                      {DEADLINE_TYPES.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.legalBasis})
                        </option>
                      ))}
                    </select>
                    <p className="mt-1.5 text-xs text-ink/55 leading-relaxed">
                      {currentTypeConfig.description}
                    </p>
                  </div>

                  {/* Date Input */}
                  <div>
                    <label
                      htmlFor="date-received"
                      className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/70 font-mono"
                    >
                      Datum der Bekanntgabe / Erhalt
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        id="date-received"
                        value={dateReceived}
                        onChange={(e) => setDateReceived(e.target.value)}
                        className="w-full rounded-lg border border-border bg-canvas px-3.5 py-2.5 text-sm font-medium text-ink focus:border-seal focus:outline-none focus:ring-1 focus:ring-seal"
                      />
                    </div>
                    <p className="mt-1 text-[11px] text-ink/50">
                      Geben Sie das Datum auf dem Stempel, Poststempel oder Tag des Eingangs ein.
                    </p>
                  </div>

                  {/* Delivery Method */}
                  <div>
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink/70 font-mono">
                      Art der Übermittlung / Zugang
                    </span>
                    <div className="space-y-2">
                      <label className="flex items-start gap-2.5 rounded-lg border border-border bg-canvas/50 p-3 cursor-pointer hover:bg-canvas">
                        <input
                          type="radio"
                          name="delivery"
                          value="post"
                          checked={deliveryMethod === "post"}
                          onChange={() => setDeliveryMethod("post")}
                          className="mt-0.5 text-seal focus:ring-seal"
                        />
                        <div className="text-xs">
                          <p className="font-semibold text-ink">
                            Postzustellung (Standard)
                          </p>
                          <p className="text-ink/60 text-[11px] mt-0.5">
                            Gilt am 3. Tag nach Aufgabe zur Post als bekanntgegeben (§ 41 Abs. 2 VwVfG).
                          </p>
                        </div>
                      </label>

                      <label className="flex items-start gap-2.5 rounded-lg border border-border bg-canvas/50 p-3 cursor-pointer hover:bg-canvas">
                        <input
                          type="radio"
                          name="delivery"
                          value="electronic"
                          checked={deliveryMethod === "electronic"}
                          onChange={() => setDeliveryMethod("electronic")}
                          className="mt-0.5 text-seal focus:ring-seal"
                        />
                        <div className="text-xs">
                          <p className="font-semibold text-ink">
                            Elektronischer Versand (E-Mail / Portal)
                          </p>
                          <p className="text-ink/60 text-[11px] mt-0.5">
                            Gilt am 3. Tag nach Absendung als bekanntgegeben (§ 41 Abs. 2a VwVfG).
                          </p>
                        </div>
                      </label>

                      <label className="flex items-start gap-2.5 rounded-lg border border-border bg-canvas/50 p-3 cursor-pointer hover:bg-canvas">
                        <input
                          type="radio"
                          name="delivery"
                          value="direct"
                          checked={deliveryMethod === "direct"}
                          onChange={() => setDeliveryMethod("direct")}
                          className="mt-0.5 text-seal focus:ring-seal"
                        />
                        <div className="text-xs">
                          <p className="font-semibold text-ink">
                            Persönliche Übergabe / Zustellungsurkunde (PZU)
                          </p>
                          <p className="text-ink/60 text-[11px] mt-0.5">
                            Keine Fiktion: Zugang zählt am exakt angegebenen Datum.
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                </form>
              </div>

              {/* Quick Details Box */}
              <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
                <div className="flex items-center gap-2 mb-2">
                  <Info size={16} className="text-seal" />
                  <p className="font-semibold text-xs text-ink">
                    Rechtsgrundlage der Frist
                  </p>
                </div>
                <div className="rounded-lg bg-canvas p-3 text-xs space-y-1.5 font-mono">
                  <div className="flex justify-between">
                    <span className="text-ink/60">Paragraf:</span>
                    <span className="font-bold text-seal">{currentTypeConfig.legalBasis}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink/60">Kategorie:</span>
                    <span className="text-ink">{currentTypeConfig.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink/60">Regel-Dauer:</span>
                    <span className="text-ink">
                      {currentTypeConfig.duration.value}{" "}
                      {currentTypeConfig.duration.type === "months"
                        ? "Monat(e)"
                        : currentTypeConfig.duration.type === "weeks"
                        ? "Woche(n)"
                        : "Tag(e)"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Result Display Section (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {calculationResult ? (
                <>
                  {/* Main Deadline Display Card */}
                  <div className="rounded-xl border border-border bg-surface p-6 shadow-card relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                      <p className="font-mono text-xs uppercase tracking-wide text-seal">
                        02 · Berechnetes Fristende
                      </p>
                      {/* Urgency Badge */}
                      {calculationResult.urgency === "green" && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-signal-green-light px-3 py-1 font-mono text-xs font-semibold text-signal-green">
                          <span className="h-2 w-2 rounded-full bg-signal-green animate-pulse" />
                          Ausreichend Zeit ({calculationResult.daysRemaining} Tage)
                        </span>
                      )}
                      {calculationResult.urgency === "amber" && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-signal-amber-light px-3 py-1 font-mono text-xs font-semibold text-signal-amber">
                          <span className="h-2 w-2 rounded-full bg-signal-amber animate-pulse" />
                          Bald fällig ({calculationResult.daysRemaining} Tage)
                        </span>
                      )}
                      {calculationResult.urgency === "red" && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-signal-red-light px-3 py-1 font-mono text-xs font-semibold text-signal-red">
                          <span className="h-2 w-2 rounded-full bg-signal-red animate-pulse" />
                          Dringend / Fristablauf! ({calculationResult.daysRemaining} Tage)
                        </span>
                      )}
                    </div>

                    {/* Deadline Highlight Box */}
                    <div
                      className={`rounded-xl p-6 border mb-6 ${
                        calculationResult.urgency === "green"
                          ? "bg-signal-green-light/40 border-signal-green/20"
                          : calculationResult.urgency === "amber"
                          ? "bg-signal-amber-light/50 border-signal-amber/30"
                          : "bg-signal-red-light/50 border-signal-red/30"
                      }`}
                    >
                      <p className="text-xs font-mono uppercase tracking-wide text-ink/60 mb-1">
                        Letzter Tag für den Eingang bei der Behörde:
                      </p>
                      <p className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight mb-2">
                        {formatDateGerman(calculationResult.finalDeadlineDate)}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink/75 font-mono pt-1">
                        <span>
                          Datum: <strong>{formatDateShort(calculationResult.finalDeadlineDate)}</strong>
                        </span>
                        <span>Uhrzeit: <strong>23:59 Uhr</strong></span>
                      </div>
                    </div>

                    {/* Step-by-Step Calculation Breakdown */}
                    <div className="space-y-3 border-t border-border/80 pt-5 text-xs">
                      <p className="font-semibold text-ink font-mono uppercase tracking-wide text-[11px]">
                        Berechnungsschritte im Detail:
                      </p>

                      <div className="grid gap-2 sm:grid-cols-2">
                        <div className="rounded-lg bg-canvas p-3 border border-border/60">
                          <p className="text-ink/55 text-[11px]">Angebener Zugang:</p>
                          <p className="font-medium text-ink">
                            {formatDateShort(calculationResult.baseDate)}
                          </p>
                        </div>

                        <div className="rounded-lg bg-canvas p-3 border border-border/60">
                          <p className="text-ink/55 text-[11px]">
                            Bekanntgabe (inkl. 3-Tage-Fiktion):
                          </p>
                          <p className="font-medium text-ink">
                            {formatDateShort(calculationResult.notificationDate)}
                          </p>
                        </div>
                      </div>

                      {/* Weekend shift callout */}
                      {calculationResult.shifted ? (
                        <div className="rounded-lg bg-seal-light p-3 text-seal border border-seal/20 flex items-start gap-2">
                          <Info size={16} className="mt-0.5 shrink-0" />
                          <div>
                            <p className="font-semibold text-xs">
                              Verschiebung gemäß § 193 BGB (Sonn- & Feiertagsregel)
                            </p>
                            <p className="text-[11px] leading-relaxed mt-0.5 text-seal/80">
                              Das ursprüngliche Fristende ({formatDateShort(calculationResult.rawDeadlineDate)})
                              fiel auf ein Wochenende oder einen gesetzlichen Feiertag. Die Frist endet daher am
                              nächsten Werktag.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-[11px] text-ink/60">
                          ✓ Das Fristende fällt auf einen regulären Werktag.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Next Steps Checklist Card */}
                  <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
                    <p className="mb-1 font-mono text-xs uppercase tracking-wide text-seal">
                      03 · Empfohlene Schritte
                    </p>
                    <h3 className="mb-4 text-lg font-bold text-ink">
                      Handlungsempfehlung zur Fristwahrung
                    </h3>

                    <div className="space-y-3">
                      {currentTypeConfig.nextSteps.map((step, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 rounded-lg border border-border/80 bg-canvas/40 p-3.5"
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-seal text-xs font-bold text-white font-mono">
                            {index + 1}
                          </span>
                          <p className="text-xs leading-relaxed text-ink/80 pt-0.5">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-3">
                      <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-lg bg-seal px-4 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90"
                      >
                        <FileText size={14} />
                        Antwort-Entwurf mit CivicAI erstellen
                      </Link>
                      <Link
                        href="/datenschutz"
                        className="text-xs font-medium text-ink/60 hover:text-seal underline underline-offset-2"
                      >
                        Datenschutzhinweise lesen
                      </Link>
                    </div>
                  </div>
                </>
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-surface p-12 text-center">
                  <CalendarIcon size={32} className="mx-auto text-ink/30 mb-2" />
                  <p className="text-sm font-semibold text-ink">
                    Kein gültiges Datum ausgewählt
                  </p>
                  <p className="text-xs text-ink/60 max-w-xs mx-auto mt-1">
                    Bitte wählen Sie im linken Formular ein bekanntgegebenes Datum aus,
                    um das Fristende zu berechnen.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Additional Reference Section / Overview Table */}
          <div className="mt-12 rounded-xl border border-border bg-surface p-6 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-wide text-seal">
                  Übersicht · Häufige Rechtsfristen
                </p>
                <h3 className="text-lg font-bold text-ink">
                  Gesetzliche Fristen im Überblick
                </h3>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-canvas/60 font-mono text-[11px] uppercase tracking-wide text-ink/60">
                    <th className="py-3 px-3">Verfahren / Schreiben</th>
                    <th className="py-3 px-3">Regelfrist</th>
                    <th className="py-3 px-3">Paragraf</th>
                    <th className="py-3 px-3">Bereich</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-ink/80">
                  {DEADLINE_TYPES.map((t) => (
                    <tr key={t.id} className="hover:bg-canvas/30">
                      <td className="py-3 px-3 font-medium text-ink">{t.name}</td>
                      <td className="py-3 px-3">
                        {t.duration.value}{" "}
                        {t.duration.type === "months"
                          ? "Monat"
                          : t.duration.type === "weeks"
                          ? "Wochen"
                          : "Tage"}
                      </td>
                      <td className="py-3 px-3 font-mono font-semibold text-seal">
                        {t.legalBasis}
                      </td>
                      <td className="py-3 px-3">
                        <span className="rounded bg-canvas border border-border/80 px-2 py-0.5 text-[10px]">
                          {t.category}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
