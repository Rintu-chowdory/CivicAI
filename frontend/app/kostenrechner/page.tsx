"use client";

import { useState, useMemo } from "react";
import {
  Calculator,
  Scale,
  Euro,
  Info,
  CheckCircle2,
  HelpCircle,
  FileText,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Building2,
  UserCheck,
  ChevronDown,
  ChevronUp,
  Percent,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TrustBadge from "@/components/TrustBadge";

type ProcedureType =
  | "verwaltungsgericht"
  | "anwaltskosten"
  | "gerichtskosten"
  | "sozialgericht";

interface ProcedureOption {
  id: ProcedureType;
  title: string;
  subtitle: string;
  description: string;
  courtFeeMultiplier: number;
  lawyerFeeMultiplier: number;
  isSozialgericht: boolean;
}

const PROCEDURES: ProcedureOption[] = [
  {
    id: "verwaltungsgericht",
    title: "Verwaltungsgerichtsverfahren",
    subtitle: "Klagen gegen Bescheide von Behörden (z. B. Bauamt, BAföG, Ausländerbehörde)",
    description:
      "Erstinstanzliches Verfahren vor dem Verwaltungsgericht (VG). Gerichtskosten betragen 3,0 Gebühren nach GKG.",
    courtFeeMultiplier: 3.0,
    lawyerFeeMultiplier: 2.5, // 1.3 Verfahrensgebühr + 1.2 Terminsgebühr
    isSozialgericht: false,
  },
  {
    id: "gerichtskosten",
    title: "Gerichtskosten / Zivilprozess",
    subtitle: "Streitigkeiten vor dem Amtsgericht oder Landgericht (z. B. Mietrecht, Verträge)",
    description:
      "Klassischer Zivilprozess. Bei Klageeinreichung werden 3,0 Gerichtsgebühren fällig.",
    courtFeeMultiplier: 3.0,
    lawyerFeeMultiplier: 2.5,
    isSozialgericht: false,
  },
  {
    id: "anwaltskosten",
    title: "Anwaltskosten (Außergerichtlich)",
    subtitle: "Beratung, Schreiben & Verhandlungen vor einer Klage",
    description:
      "Außergerichtliches Tätigwerden des Anwalts (z. B. Widerspruchsschreiben an eine Behörde). Keine Gerichtskosten.",
    courtFeeMultiplier: 0.0,
    lawyerFeeMultiplier: 1.3, // 1.3 Geschäftsgebühr
    isSozialgericht: false,
  },
  {
    id: "sozialgericht",
    title: "Sozialgerichtsverfahren",
    subtitle: "Klagen gegen Jobcenter, Kranken- oder Rentenversicherung (§ 183 SGG)",
    description:
      "Gerichtskostenfrei für Bürgerinnen und Bürger! Für den Anwalt fallen Betragsrahmengebühren an.",
    courtFeeMultiplier: 0.0,
    lawyerFeeMultiplier: 0.0,
    isSozialgericht: true,
  },
];

// RVG 1.0 Base Fee Lookup (§ 13 RVG)
function getRVGBaseFee(streitwert: number): number {
  if (streitwert <= 500) return 49;
  if (streitwert <= 1000) return 88;
  if (streitwert <= 1500) return 127;
  if (streitwert <= 2000) return 166;
  if (streitwert <= 3000) return 222;
  if (streitwert <= 4000) return 278;
  if (streitwert <= 5000) return 334;
  if (streitwert <= 6000) return 380;
  if (streitwert <= 7000) return 426;
  if (streitwert <= 8000) return 472;
  if (streitwert <= 9000) return 518;
  if (streitwert <= 10000) return 564;
  if (streitwert <= 15000) return 636;
  if (streitwert <= 20000) return 708;
  if (streitwert <= 25000) return 780;
  if (streitwert <= 30000) return 882;
  if (streitwert <= 35000) return 984;
  if (streitwert <= 40000) return 1086;
  if (streitwert <= 45000) return 1188;
  if (streitwert <= 50000) return 1290;
  
  // Above 50,000 €: + 60 € per 10,000 €
  const excess = Math.ceil((streitwert - 50000) / 10000);
  return 1290 + excess * 60;
}

// GKG 1.0 Base Court Fee Lookup (§ 34 GKG)
function getGKGBaseFee(streitwert: number): number {
  if (streitwert <= 500) return 38;
  if (streitwert <= 1000) return 58;
  if (streitwert <= 1500) return 78;
  if (streitwert <= 2000) return 98;
  if (streitwert <= 3000) return 119;
  if (streitwert <= 4000) return 140;
  if (streitwert <= 5000) return 161;
  if (streitwert <= 6000) return 182;
  if (streitwert <= 7000) return 203;
  if (streitwert <= 8000) return 224;
  if (streitwert <= 9000) return 245;
  if (streitwert <= 10000) return 266;
  if (streitwert <= 15000) return 329;
  if (streitwert <= 20000) return 392;
  if (streitwert <= 25000) return 455;
  if (streitwert <= 30000) return 518;
  if (streitwert <= 35000) return 581;
  if (streitwert <= 40000) return 644;
  if (streitwert <= 45000) return 707;
  if (streitwert <= 50000) return 770;

  // Above 50,000 €: + 35 € per 10,000 €
  const excess = Math.ceil((streitwert - 50000) / 10000);
  return 770 + excess * 35;
}

const PRESET_STREITWERTE = [1000, 3000, 5000, 10000, 25000];

export default function KostenrechnerPage() {
  const [procedureType, setProcedureType] =
    useState<ProcedureType>("verwaltungsgericht");
  const [streitwert, setStreitwert] = useState<number>(5000);
  const [includeOpponentRisk, setIncludeOpponentRisk] =
    useState<boolean>(false);
  const [showVKHInfo, setShowVKHInfo] = useState<boolean>(true);

  const selectedProcedure = useMemo(() => {
    return (
      PROCEDURES.find((p) => p.id === procedureType) || PROCEDURES[0]
    );
  }, [procedureType]);

  // Calculations
  const calculation = useMemo(() => {
    const val = Math.max(100, streitwert);

    if (selectedProcedure.isSozialgericht) {
      // Sozialgericht (§ 183 SGG): court fee 0 EUR for insured
      const courtFee = 0;
      const flatLawyerFee = 350; // standard average frame fee
      const expensesPauschal = 20;
      const subtotalLawyer = flatLawyerFee + expensesPauschal;
      const vat = subtotalLawyer * 0.19;
      const ownLawyerTotal = subtotalLawyer + vat;
      const totalCost = courtFee + ownLawyerTotal;

      return {
        streitwert: val,
        baseRVG: 0,
        baseGKG: 0,
        courtFee,
        lawyerFeesNet: flatLawyerFee,
        expensesPauschal,
        vat,
        ownLawyerTotal,
        opponentLawyerTotal: 0,
        totalCost,
        isSozialgericht: true,
      };
    }

    const baseRVG = getRVGBaseFee(val);
    const baseGKG = getGKGBaseFee(val);

    // Court fee
    const courtFee = baseGKG * selectedProcedure.courtFeeMultiplier;

    // Lawyer fees (1st instance)
    const lawyerFeesNet = baseRVG * selectedProcedure.lawyerFeeMultiplier;
    const expensesPauschal = Math.min(20, lawyerFeesNet * 0.2); // 20% or max 20 EUR
    const subtotalLawyer = lawyerFeesNet + expensesPauschal;
    const vat = subtotalLawyer * 0.19;
    const ownLawyerTotal = subtotalLawyer + vat;

    // Opponent risk if losing
    const opponentLawyerTotal = includeOpponentRisk ? ownLawyerTotal : 0;

    const totalCost = courtFee + ownLawyerTotal + opponentLawyerTotal;

    return {
      streitwert: val,
      baseRVG,
      baseGKG,
      courtFee,
      lawyerFeesNet,
      expensesPauschal,
      vat,
      ownLawyerTotal,
      opponentLawyerTotal,
      totalCost,
      isSozialgericht: false,
    };
  }, [streitwert, selectedProcedure, includeOpponentRisk]);

  function formatEuro(amount: number): string {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 2,
    }).format(amount);
  }

  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar activePage="kostenrechner" />

      <div className="lg:pl-60">
        <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10">
          {/* Topbar */}
          <div className="mb-8 flex items-center justify-between border-b border-border/60 pb-5">
            <div>
              <p className="font-mono text-xs uppercase tracking-wide text-ink/45">
                CivicAI · Transparenz & Gerichtsgebühren
              </p>
              <h1 className="text-xl font-semibold text-ink">
                Rechtskostenrechner
              </h1>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="hidden text-sm text-ink/70 sm:inline">
                Berechnung nach GKG & RVG
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-seal-light text-xs font-semibold text-seal">
                KR
              </span>
            </div>
          </div>

          {/* Hero Banner */}
          <div className="mb-8 rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
            <div className="max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-md bg-seal-light px-2.5 py-1 font-mono text-xs font-medium uppercase tracking-wider text-seal">
                <Calculator size={14} />
                <span>Anwalts- & Gerichtskosten berechnen</span>
              </div>
              <h2 className="mb-3 text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
                Welche Kosten kommen im Streitfall auf Sie zu?
              </h2>
              <p className="text-sm leading-relaxed text-ink/70 sm:text-base">
                Ermitteln Sie die voraussichtlichen Gebühren für Anwalt und Gericht auf Basis des Streitwerts. Inklusive Aufschlüsselung nach dem Gerichtskostengesetz (GKG) und Rechtsanwaltsvergütungsgesetz (RVG).
              </p>
            </div>
          </div>

          {/* Main Grid: Form Inputs vs Results Card */}
          <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
            {/* Left Column: Form Controls */}
            <div className="flex flex-col gap-6">
              {/* Step 1: Verfahrensart */}
              <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
                <p className="mb-1 font-mono text-xs uppercase tracking-wide text-seal">
                  Schritt 1 · Verfahrensart auswählen
                </p>
                <h3 className="mb-4 text-lg font-bold text-ink">
                  Art der rechtlichen Auseinandersetzung
                </h3>

                <div className="grid gap-3 sm:grid-cols-2">
                  {PROCEDURES.map((proc) => {
                    const isSelected = procedureType === proc.id;
                    return (
                      <button
                        key={proc.id}
                        type="button"
                        onClick={() => setProcedureType(proc.id)}
                        className={`flex flex-col justify-between rounded-xl border p-4 text-left transition-all ${
                          isSelected
                            ? "border-seal bg-seal-light/40 ring-1 ring-seal"
                            : "border-border bg-surface hover:border-seal/40 hover:bg-canvas/50"
                        }`}
                      >
                        <div>
                          <div className="mb-1 flex items-center justify-between">
                            <span className="font-bold text-sm text-ink">
                              {proc.title}
                            </span>
                            <span
                              className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                                isSelected
                                  ? "border-seal bg-seal text-white"
                                  : "border-border bg-surface"
                              }`}
                            >
                              {isSelected && (
                                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                              )}
                            </span>
                          </div>
                          <p className="text-xs text-ink/65 leading-relaxed">
                            {proc.subtitle}
                          </p>
                        </div>

                        <div className="mt-3 font-mono text-[10px] text-seal uppercase font-semibold">
                          {proc.isSozialgericht
                            ? "Gerichtskostenfrei (§ 183 SGG)"
                            : proc.courtFeeMultiplier > 0
                            ? `GKG ${proc.courtFeeMultiplier.toFixed(1)} Gebühr`
                            : "Keine Gerichtskosten"}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Streitwert */}
              <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
                <p className="mb-1 font-mono text-xs uppercase tracking-wide text-seal">
                  Schritt 2 · Streitwert (Gegenstandswert)
                </p>
                <h3 className="mb-2 text-lg font-bold text-ink">
                  Um wie viel Euro geht es in dem Konflikt?
                </h3>
                <p className="mb-4 text-xs text-ink/60">
                  Der Streitwert ist der finanzielle Wert Ihres Anliegens (z. B. Höhe der geforderten Kaution, Mieterhöhung pro Jahr oder Bußgeld).
                </p>

                {/* Number Input & Slider */}
                <div className="mb-5 rounded-xl border border-border bg-canvas/30 p-4">
                  <label className="mb-2 block font-mono text-xs uppercase tracking-wide text-ink/50">
                    Streitwert in Euro (€)
                  </label>
                  <div className="relative mb-4">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-ink/40">
                      €
                    </span>
                    <input
                      type="number"
                      min={100}
                      max={500000}
                      step={100}
                      value={streitwert}
                      onChange={(e) =>
                        setStreitwert(
                          Math.max(0, parseInt(e.target.value) || 0)
                        )
                      }
                      className="w-full rounded-lg border border-border bg-surface py-2.5 pl-9 pr-4 text-lg font-bold text-ink focus:border-seal focus:outline-none focus:ring-1 focus:ring-seal"
                    />
                  </div>

                  <input
                    type="range"
                    min={500}
                    max={50000}
                    step={500}
                    value={streitwert}
                    onChange={(e) => setStreitwert(Number(e.target.value))}
                    className="w-full accent-seal"
                  />

                  {/* Quick Presets */}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] text-ink/45">
                      Schnellauswahl:
                    </span>
                    {PRESET_STREITWERTE.map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setStreitwert(val)}
                        className={`rounded-md border px-2.5 py-1 font-mono text-xs font-medium transition-colors ${
                          streitwert === val
                            ? "border-seal bg-seal text-white"
                            : "border-border bg-surface text-ink/75 hover:bg-seal-light"
                        }`}
                      >
                        {val.toLocaleString("de-DE")} €
                      </button>
                    ))}
                  </div>
                </div>

                {/* Additional Risk Option */}
                <div className="rounded-xl border border-border/80 bg-surface p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeOpponentRisk}
                      onChange={(e) => setIncludeOpponentRisk(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-border text-seal focus:ring-seal"
                    />
                    <div>
                      <span className="text-xs font-bold text-ink">
                        Gegnerische Anwaltskosten bei Niederlage einrechnen
                      </span>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-ink/60">
                        Im Zivil- und Verwaltungsprozess muss die verlierende Partei in der Regel auch die Anwaltskosten der Gegenseite tragen (Prozessrisiko).
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Detailed Calculation Result */}
            <div>
              <div className="sticky top-6 rounded-2xl border border-border bg-surface p-6 shadow-card">
                <div className="mb-4 flex items-center justify-between border-b border-border/70 pb-4">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-wide text-seal">
                      Kostenberechnung 1. Instanz
                    </p>
                    <h3 className="text-lg font-bold text-ink">
                      Voraussichtliche Gesamtkosten
                    </h3>
                  </div>
                  <TrustBadge confidence="high" />
                </div>

                {/* Big Total Box */}
                <div className="mb-6 rounded-xl bg-seal p-5 text-white shadow-inner">
                  <p className="font-mono text-xs uppercase tracking-wider text-white/70">
                    Gesamtrisiko / Summe
                  </p>
                  <p className="mt-1 text-3xl font-extrabold sm:text-4xl">
                    {formatEuro(calculation.totalCost)}
                  </p>
                  <p className="mt-2 text-xs text-white/80">
                    Bei einem Streitwert von {formatEuro(calculation.streitwert)}
                  </p>
                </div>

                {/* Itemized Table */}
                <div className="mb-6 flex flex-col gap-3 text-xs">
                  <p className="font-mono text-[11px] uppercase tracking-wide text-ink/45">
                    Positionen im Detail
                  </p>

                  {/* Gerichtskosten */}
                  <div className="flex items-center justify-between rounded-lg bg-canvas/50 p-3">
                    <div>
                      <span className="font-bold text-ink">Gerichtskosten (GKG)</span>
                      <p className="text-[11px] text-ink/60">
                        {selectedProcedure.isSozialgericht
                          ? "Kostenfrei nach § 183 SGG"
                          : `${selectedProcedure.courtFeeMultiplier.toFixed(1)}x Gerichtsgebühr`}
                      </p>
                    </div>
                    <span className="font-mono font-bold text-ink">
                      {formatEuro(calculation.courtFee)}
                    </span>
                  </div>

                  {/* Eigenes Anwaltshonorar */}
                  <div className="flex items-center justify-between rounded-lg bg-canvas/50 p-3">
                    <div>
                      <span className="font-bold text-ink">
                        Eigener Anwalt (RVG)
                      </span>
                      <p className="text-[11px] text-ink/60">
                        {selectedProcedure.isSozialgericht
                          ? "Betragsrahmengebühr + Auslagen"
                          : `${selectedProcedure.lawyerFeeMultiplier.toFixed(1)}x Gebühr + Auslagen + 19% USt`}
                      </p>
                    </div>
                    <span className="font-mono font-bold text-ink">
                      {formatEuro(calculation.ownLawyerTotal)}
                    </span>
                  </div>

                  {/* Gegnerischer Anwalt (falls aktiviert) */}
                  {includeOpponentRisk && (
                    <div className="flex items-center justify-between rounded-lg bg-signal-red-light/40 border border-signal-red/20 p-3">
                      <div>
                        <span className="font-bold text-signal-red">
                          Gegnerischer Anwalt
                        </span>
                        <p className="text-[11px] text-ink/60">
                          Risiko bei vollständigem Unterliegen
                        </p>
                      </div>
                      <span className="font-mono font-bold text-signal-red">
                        {formatEuro(calculation.opponentLawyerTotal)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Detail Breakdown Accordion / Sub-items */}
                <div className="mb-6 border-t border-border/60 pt-4 text-xs">
                  <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-ink/45">
                    Anwaltskosten Zusammensetzung
                  </p>
                  <div className="space-y-1.5 text-ink/70">
                    <div className="flex justify-between">
                      <span>Anwaltsgebühren (Netto):</span>
                      <span className="font-mono">{formatEuro(calculation.lawyerFeesNet)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Auslagenpauschale (Post/Telekom):</span>
                      <span className="font-mono">{formatEuro(calculation.expensesPauschal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Umsatzsteuer (19%):</span>
                      <span className="font-mono">{formatEuro(calculation.vat)}</span>
                    </div>
                  </div>
                </div>

                {/* VKH Banner Trigger */}
                <div className="rounded-xl border border-seal/30 bg-seal-light/50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-seal">
                      Geringes Einkommen?
                    </span>
                    <button
                      onClick={() => setShowVKHInfo(!showVKHInfo)}
                      className="text-xs font-semibold text-seal underline"
                    >
                      {showVKHInfo ? "Ausblenden" : "Prozesskostenhilfe prüfen"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Aid Information Box (Verfahrenskostenhilfe / Prozesskostenhilfe) */}
          {showVKHInfo && (
            <div className="mt-10 rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-seal-light text-seal">
                  <ShieldCheck size={22} />
                </span>
                <div>
                  <p className="font-mono text-xs uppercase tracking-wide text-seal">
                    Staatliche Unterstützung
                  </p>
                  <h3 className="text-xl font-bold text-ink">
                    Verfahrenskostenhilfe (VKH) & Beratungshilfe
                  </h3>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border border-border bg-canvas/30 p-5">
                  <h4 className="mb-2 text-sm font-bold text-ink flex items-center gap-2">
                    <FileText size={16} className="text-seal" />
                    1. Beratungshilfe (Außergerichtlich)
                  </h4>
                  <p className="text-xs text-ink/70 leading-relaxed mb-3">
                    Wenn Sie rechtliche Beratung oder Unterstützung durch einen Anwalt außerhalb eines Gerichtsverfahrens benötigen und die Kosten nicht selbst aufbringen können.
                  </p>
                  <ul className="text-xs text-ink/80 space-y-1.5 list-disc pl-4">
                    <li>Antrag beim zuständigen Amtsgericht stellen</li>
                    <li>Eigenanteil von lediglich 15,00 € beim Anwalt</li>
                    <li>Voraussetzung: Niedriges Einkommen / Vermögen</li>
                  </ul>
                </div>

                <div className="rounded-xl border border-border bg-canvas/30 p-5">
                  <h4 className="mb-2 text-sm font-bold text-ink flex items-center gap-2">
                    <Scale size={16} className="text-seal" />
                    2. Prozesskostenhilfe (PKH / VKH)
                  </h4>
                  <p className="text-xs text-ink/70 leading-relaxed mb-3">
                    Für gerichtliche Verfahren übernimmt der Staat bei Bedürftigkeit die Gerichts- und eigenen Anwaltskosten komplett oder in Raten.
                  </p>
                  <ul className="text-xs text-ink/80 space-y-1.5 list-disc pl-4">
                    <li>Klage muss hinreichende Aussicht auf Erfolg haben</li>
                    <li>Antrag wird direkt beim Prozessgericht eingereicht</li>
                    <li>Formular &bdquo;Erklärung über die persönlichen und wirtschaftlichen Verhältnisse&ldquo; nötig</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Legal Disclaimer */}
          <div className="mt-8 rounded-xl border border-border bg-surface p-5 shadow-card">
            <div className="flex items-start gap-3">
              <Info size={18} className="mt-0.5 shrink-0 text-seal" />
              <div>
                <p className="font-mono text-xs uppercase tracking-wide text-seal font-medium">
                  Wichtiger Haftungsausschluss zur Kostenberechnung
                </p>
                <p className="mt-1 text-xs leading-relaxed text-ink/65">
                  Alle berechneten Beträge sind unverbindliche Orientierungswerte gemäß den gesetzlichen Gebührentatbeständen von GKG und RVG. Die tatsächlichen Kosten können je nach Einzelfall, Umfang des Verfahrens, Beweisaufnahmen, Zeugenentschädigungen oder individuellen Honorarvereinbarungen abweichen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
