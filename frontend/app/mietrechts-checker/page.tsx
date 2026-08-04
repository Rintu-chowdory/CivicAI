"use client";

import { useState, useMemo } from "react";
import {
  Home,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  FileText,
  Scale,
  HelpCircle,
  ShieldCheck,
  Info,
  ExternalLink,
  Search,
  SlidersHorizontal,
  TrendingUp,
  Receipt,
  Paintbrush,
  UserX,
  Wrench,
  Zap,
  Building,
  CalendarCheck,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TrustBadge, { type Confidence } from "@/components/TrustBadge";

interface TenantCheckItem {
  id: string;
  title: string;
  category: string;
  icon: any;
  legalBasis: string;
  confidence: Confidence;
  summary: string;
  checkPoints: {
    id: string;
    label: string;
    description: string;
    isFlawIfTrue: boolean; // if true, selecting this indicates a problem or invalidity
  }[];
  verdicts: {
    flawed: {
      title: string;
      description: string;
    };
    valid: {
      title: string;
      description: string;
    };
  };
  actionSteps: string[];
  templateHint: string;
}

const TENANT_TOPICS: TenantCheckItem[] = [
  {
    id: "mieterhoehung",
    title: "Mieterhöhung auf Ortsübliche Vergleichsmiete",
    category: "Miete & Kosten",
    icon: TrendingUp,
    legalBasis: "§ 558 BGB, § 558a BGB, § 558b BGB",
    confidence: "high",
    summary:
      "Vermieter dürfen die Miete bis zur ortsüblichen Vergleichsmiete anheben. Dabei müssen streng eingehaltene Jahressperrfristen, Kappungsgrenzen (15–20%) und formelle Begründungspflichten berücksichtigt werden.",
    checkPoints: [
      {
        id: "m_frist",
        label: "Seit der letzten Mieterhöhung sind weniger als 15 Monate vergangen",
        description: "Die Erhöhung darf frühestens nach 12 Monaten angekündigt werden und nach 15 Monaten wirksam werden.",
        isFlawIfTrue: true,
      },
      {
        id: "m_kappung",
        label: "Miete soll in 3 Jahren um mehr als 15% (bzw. 20%) steigen",
        description: "Kappungsgrenze: In Gebieten mit angespanntem Wohnungsmarkt max. 15%, sonst max. 20% Steigerung innerhalb von 3 Jahren.",
        isFlawIfTrue: true,
      },
      {
        id: "m_begruendung",
        label: "Kein qualifizierter Mietspiegel oder Vergleichswohnungen angegeben",
        description: "Das Schreiben muss eine nachvollziehbare Begründung (z. B. konkretes Feld im Mietspiegel) enthalten.",
        isFlawIfTrue: true,
      },
      {
        id: "m_form",
        label: "Erhöhung verlangt mehr als die ortsübliche Vergleichsmiete",
        description: "Die neue Miete liegt nachweislich über den Werten des örtlichen Mietspiegels.",
        isFlawIfTrue: true,
      },
    ],
    verdicts: {
      flawed: {
        title: "Mieterhöhung voraussichtlich formell oder inhaltlich unzulässig",
        description: "Mindestens ein gesetzliches Kriterium ist verletzt. Sie müssen der Mieterhöhung in dieser Form nicht oder nur teilweise zustimmen.",
      },
      valid: {
        title: "Mieterhöhung erfüllt die Grundvoraussetzungen",
        description: "Prüfen Sie dennoch die genaue Einstufung im Mietspiegel (Baujahr, Ausstattung, Lage). Sie haben bis zum Ende des 2. Kalendermonats Bedenkzeit.",
      },
    },
    actionSteps: [
      "Prüfen Sie die Zustimmungsfrist (bis zum Ablauf des zweiten Kalendermonats nach Zugang des Schreibens).",
      "Gleichen Sie die Angaben zur Wohnungsgröße und Ausstattung exakt mit dem örtlichen Mietspiegel ab.",
      "Bei Unwirksamkeit: Stimmen Sie der Mieterhöhung schriftlich nicht zu und begründen Sie die Ablehnung kurz.",
    ],
    templateHint: "Verwenden Sie bei einer unzulässigen Erhöhung die Formulierung: 'Sehr geehrte/r Vermieter/in, der geforderten Mieterhöhung stimme ich nicht zu, da die Kappungsgrenze gemäß § 558 Abs. 3 BGB überschritten ist.'",
  },
  {
    id: "kautionsrueckzahlung",
    title: "Kautionsrückzahlung & Abrechnungsfrist",
    category: "Mietende & Kaution",
    icon: Receipt,
    legalBasis: "§ 551 BGB, BGH-Rechtsprechung",
    confidence: "high",
    summary:
      "Nach Beendigung des Mietverhältnisses muss der Vermieter die Kaution inklusive Zinsen zurückzahlen. Ihm steht lediglich eine angemessene Überlegungsfrist von in der Regel max. 6 Monaten zu.",
    checkPoints: [
      {
        id: "k_6monate",
        label: "Auszug liegt länger als 6 Monate zurück und Kaution fehlt",
        description: "Nach 6 Monaten sind etwaige Schadensersatzansprüche des Vermieters verjährt (§ 548 BGB).",
        isFlawIfTrue: true,
      },
      {
        id: "k_einbehalt",
        label: "Gesamte Kaution wird wegen noch offenem Betriebskostenscheid zurückgehalten",
        description: "Der Vermieter darf für noch ausstehende Nebenkosten nur einen angemessenen Teilbetrag zurückbehalten, nicht die ganze Kaution.",
        isFlawIfTrue: true,
      },
      {
        id: "k_zinsen",
        label: "Kaution wurde nicht verzinst zurückgezahlt",
        description: "Der Vermieter ist gesetzlich verpflichtet, die Kaution getrennt vom Vermögen gewinnbringend (mind. Sparzins) anzulegen.",
        isFlawIfTrue: true,
      },
    ],
    verdicts: {
      flawed: {
        title: "Rückzahlung der Kaution ist überfällig oder unberechtigt gekürzt",
        description: "Nach 6 Monaten ohne konkrete Schadensmeldung muss die Kaution unverzüglich freigegeben werden.",
      },
      valid: {
        title: "Überlegungsfrist des Vermieters läuft noch",
        description: "Innerhalb der ersten 3 bis 6 Monate darf der Vermieter die Wohnung prüfen und eventuelle Ansprüche aufrechnen.",
      },
    },
    actionSteps: [
      "Prüfen Sie das beim Auszug erstellte Wohnungsübergabeprotokoll auf vermerkte Mängel.",
      "Setzen Sie dem Vermieter schriftlich eine Zahlungsfrist von 14 Tagen mit Angabe Ihrer IBAN.",
      "Fordern Sie eine Abrechnung über die aufgelaufenen Zinsen der Kautionsanlage an.",
    ],
    templateHint: "Muster-Aufforderung: 'Ich fordere Sie hiermit auf, die von mir geleistete Mietkaution in Höhe von [Betrag] € nebst Zinsen bis zum [Datum] auf mein Konto einzuzahlen.'",
  },
  {
    id: "schoenheitsreparaturen",
    title: "Schönheitsreparaturen & Auszugsrückbau",
    category: "Mietvertrag & Klauseln",
    icon: Paintbrush,
    legalBasis: "§ 535 BGB, BGH Grundsatzurteile",
    confidence: "high",
    summary:
      "Sehr viele Klauseln zu Schönheitsreparaturen in Altverträgen sind nach BGH-Rechtsprechung unwirksam. Wer unrenoviert eingezogen ist, muss beim Auszug meist gar nicht streichen.",
    checkPoints: [
      {
        id: "s_starr",
        label: "Klausel enthält starre Renovierungsfristen (z. B. 'alle 3 Jahre Küche')",
        description: "Starre Fristenpläne ohne Rücksicht auf den tatsächlichen Zustand der Wohnung sind unwirksam.",
        isFlawIfTrue: true,
      },
      {
        id: "s_unrenoviert",
        label: "Wohnung wurde bei Einzug unrenoviert ohne angemessenen Ausgleich übernommen",
        description: "Laut BGH darf die Renovierungspflicht bei unrenoviert übernommenem Wohnraum nicht auf den Mieter abgewälzt werden.",
        isFlawIfTrue: true,
      },
      {
        id: "s_quoten",
        label: "Klausel verlangt Quotenabgeltung bei vorzeitigem Auszug",
        description: "Klauseln, die eine anteilige Kostenübernahme bei Auszug vor Ablauf der Frist verlangen, sind komplett unwirksam.",
        isFlawIfTrue: true,
      },
    ],
    verdicts: {
      flawed: {
        title: "Renovierungsklausel ist rechtlich unwirksam!",
        description: "Sie müssen beim Auszug keine Schönheitsreparaturen (Streichen, Tapezieren) durchführen. Die Pflicht verbleibt beim Vermieter.",
      },
      valid: {
        title: "Möglicherweise wirksame Klausel im Mietvertrag",
        description: "Falls die Klausel flexibel formuliert ist ('im Allgemeinen', 'je nach Zustand'), müssen Sie gebrauchsbedingte Abnutzungen beseitigen.",
      },
    },
    actionSteps: [
      "Prüfen Sie den Wortlaut im Mietvertrag unter der Rubrik 'Schönheitsreparaturen'.",
      "Prüfen Sie das Einzugsprotokoll: War die Wohnung bei Einzug gestrichen oder unrenoviert?",
      "Lassen Sie sich bei Zweifeln die Klausel als unwirksam bestätigen, bevor Sie Handwerker beauftragen.",
    ],
    templateHint: "Mitteilung an Vermieter: 'Die Klausel zu Schönheitsreparaturen im Mietvertrag ist laut BGH-Rechtsprechung unwirksam. Ich bin daher nicht zur Renovierung verpflichtet.'",
  },
  {
    id: "eigenbedarfskündigung",
    title: "Eigenbedarfskündigung des Vermieters",
    category: "Kündigung & Schutz",
    icon: UserX,
    legalBasis: "§ 573 Abs. 2 Nr. 2 BGB, § 574 BGB (Sozialklausel)",
    confidence: "medium",
    summary:
      "Eine Kündigung wegen Eigenbedarfs unterliegt strengen formalen Begründungspflichten. Zudem schützt die gesetzliche Sozialklausel Mieter bei Härtefällen.",
    checkPoints: [
      {
        id: "e_person",
        label: "Kündigung erfolgt für weit entfernte Verwandte (z. B. Nichten, Cousinen)",
        description: "Eigenbedarf gilt grundsätzlich nur für enge Familienangehörige (Kinder, Eltern, Enkel, Geschwister) oder Haushaltsangehörige.",
        isFlawIfTrue: true,
      },
      {
        id: "e_begruendung",
        label: "Kein konkreter Grund angegeben, warum die Person die Wohnung benötigt",
        description: "Die Kündigung muss die aktuellen Lebensverhältnisse der Person und den genauen Grund nachvollziehbar darlegen.",
        isFlawIfTrue: true,
      },
      {
        id: "e_haertefall",
        label: "Härtefall liegt vor (hohes Alter, schwere Krankheit, Schwangerschaft, lange Wohndauer)",
        description: "Nach § 574 BGB kann der Kündigung wegen unzumutbarer Härte widersprochen werden.",
        isFlawIfTrue: true,
      },
    ],
    verdicts: {
      flawed: {
        title: "Eigenbedarfskündigung weist schwere Mängel auf oder Härtefall greift",
        description: "Sie können der Kündigung widersprechen oder eine Fortsetzung des Mietverhältnisses verlangen.",
      },
      valid: {
        title: "Kündigung scheint formell korrekt verfasst",
        description: "Prüfen Sie, ob Kündigungsfristen (3 bis 9 Monate je nach Wohndauer) eingehalten wurden und legen Sie ggf. fristgerecht Widerspruch ein.",
      },
    },
    actionSteps: [
      "Prüfen Sie die Kündigungsfrist: 3 Monate (bis 5 Jahre Wohndauer), 6 Monate (ab 5 Jahre), 9 Monate (ab 8 Jahre).",
      "Legen Sie spätestens 2 Monate vor Ablauf der Kündigungsfrist schriftlich Widerspruch nach § 574 BGB ein, falls ein Härtefall vorliegt.",
      "Prüfen Sie, ob der Vermieter eine vergleichbare freie Ausweichwohnung im selben Haus anbietet.",
    ],
    templateHint: "Widerspruchsschreiben: 'Hiermit lege ich gemäß § 574 BGB Widerspruch gegen die Kündigung ein, da die Beendigung des Mietverhältnisses für mich eine unzumutbare Härte darstellt.'",
  },
  {
    id: "maengel_mietminderung",
    title: "Mängel in der Wohnung & Mietminderung",
    category: "Wohnungszustand",
    icon: Wrench,
    legalBasis: "§ 536 BGB, § 536a BGB",
    confidence: "high",
    summary:
      "Weist die Wohnung einen Mangel auf (z. B. Schimmel, Heizungsausfall im Winter, Lärm), ist die Miete kraft Gesetzes gemindert. Voraussetzung ist eine unverzügliche Mängelanzeige.",
    checkPoints: [
      {
        id: "m_anzeige",
        label: "Mangel wurde dem Vermieter noch nicht schriftlich angezeigt",
        description: "Ohne Mängelanzeige darf erst ab dem Zeitpunkt gemindert werden, ab dem der Vermieter Kenntnis erlangt hat.",
        isFlawIfTrue: true,
      },
      {
        id: "m_heizung",
        label: "Heizung fällt im Winter aus oder Raumtemperatur liegt unter 18 °C",
        description: "Erheblicher Mangel! Je nach Außentemperatur sind Mietminderungen von 20% bis 100% möglich.",
        isFlawIfTrue: false,
      },
      {
        id: "m_schimmel",
        label: "Schimmelbefall in Wohn- oder Schlafräumen vorhanden",
        description: "Feuchtigkeit und Schimmel berechtigen zur Minderung, sofern sie nicht auf fehlerhaftes Lüften zurückzuführen sind.",
        isFlawIfTrue: false,
      },
    ],
    verdicts: {
      flawed: {
        title: "Erst Mängelanzeige einreichen bevor gekürzt wird!",
        description: "Senden Sie sofort eine schriftliche Mängelanzeige mit Fristsetzung zur Beseitigung und Ankündigung der Mietminderung.",
      },
      valid: {
        title: "Mietminderungsanspruch dem Grunde nach gegeben",
        description: "Zahlen Sie die Miete ab sofort nur noch 'unter Vorbehalt' und orientieren Sie sich an anerkannten Mietminderungstabellen.",
      },
    },
    actionSteps: [
      "Dokumentieren Sie den Mangel durch Fotos, Lärmprotokolle oder Temperaturmessungen mit Datum.",
      "Schicken Sie dem Vermieter eine schriftliche Mängelanzeige mit konkreter Frist zur Behebung (z. B. 10 Tage).",
      "Überweisen Sie die Miete ausdrücklich mit dem Betreff 'Mietzahlung unter Vorbehalt', um Ihr Minderungsrecht zu wahren.",
    ],
    templateHint: "Mängelrüge: 'Hiermit zeige ich folgenden Mangel an: [Mangel]. Ich fordere Sie auf, diesen bis zum [Datum] zu beseitigen. Künftige Mietzahlungen erfolgen unter Vorbehalt.'",
  },
  {
    id: "energetische_sanierung",
    title: "Energetische Sanierung & Modernisierung",
    category: "Baumaßnahmen",
    icon: Zap,
    legalBasis: "§ 555b BGB, § 536 Abs. 1a BGB, § 559 BGB",
    confidence: "medium",
    summary:
      "Energetische Sanierungen müssen 3 Monate im Voraus angekündigt werden. Während der ersten 3 Monate der Baumaßnahme ist eine Mietminderung wegen energetischer Sanierung gesetzlich ausgeschlossen.",
    checkPoints: [
      {
        id: "es_ankündigung",
        label: "Baumaßnahme wurde nicht mindestens 3 Monate vor Beginn angekündigt",
        description: "Der Vermieter muss Art, Umfang, Beginn, Dauer und voraussichtliche Mieterhöhung rechtzeitig mitteilen.",
        isFlawIfTrue: true,
      },
      {
        id: "es_dauer",
        label: "Baumaßnahme dauert bereits länger als 3 Monate an",
        description: "Ab dem 4. Monat erlischt der gesetzliche Minderungsausschluss — Sie dürfen bei Beeinträchtigungen wieder mindern.",
        isFlawIfTrue: true,
      },
      {
        id: "es_umlage",
        label: "Modernisierungsumlage beträgt mehr als 8% der Modernisierungskosten pro Jahr",
        description: "Seit 2019 dürfen max. 8% der aufgewendeten Kosten auf die jährliche Miete umgelegt werden (Kappung: max. 3 €/m² in 6 Jahren).",
        isFlawIfTrue: true,
      },
    ],
    verdicts: {
      flawed: {
        title: "Ankündigung oder Erhöhung weist formelle Mängel auf",
        description: "Sie können die Duldung der Maßnahme verweigern oder der angekündigten Modernisierungserhöhung widersprechen.",
      },
      valid: {
        title: "Ordnungsgemäße Ankündigung der Sanierung",
        description: "Prüfen Sie, ob wegen finanzieller Härtefälle innerhalb eines Monats nach Ankündigung Einwand erhoben werden muss.",
      },
    },
    actionSteps: [
      "Prüfen Sie das Ankündigungsschreiben auf konkrete Angaben zu Beginn, Dauer und Heizkostenersparnis.",
      "Melden Sie Härtefälle (z. B. zu hohe künftige Miete im Verhältnis zum Einkommen) binnen eines Monats schriftlich.",
      "Notieren Sie die genaue Dauer der Belastungen im Bautagebuch.",
    ],
    templateHint: "Härtefalleinwand: 'Gegen die angekündigte Modernisierungserhöhung erhebe ich gemäß § 555d Abs. 3 BGB den Einwand einer finanziellen Härte.'",
  },
  {
    id: "raummiete_vs_wohnraum",
    title: "Raummiete vs. Wohnraum (Sonderkonstellationen)",
    category: "Mietvertrag & Klauseln",
    icon: Building,
    legalBasis: "§ 549 BGB, § 578 BGB",
    confidence: "medium",
    summary:
      "Der starke gesetzliche Mieterschutz (Mietpreisbremse, Kündigungsschutz) gilt uneingeschränkt für Wohnraum. Bei Gewerberäumen oder möbliert untervermieteten Zimmern in der Vermieterwohnung gelten Sonderregeln.",
    checkPoints: [
      {
        id: "rw_moebliert",
        label: "Möbliertes Zimmer innerhalb der vom Vermieter selbst bewohnten Wohnung",
        description: "Hier gelten verkürzte Kündigungsfristen zum 15. eines Monats zum Monatsende (§ 573c Abs. 3 BGB).",
        isFlawIfTrue: true,
      },
      {
        id: "rw_gewerbe",
        label: "Mietvertrag wurde fälschlicherweise als Gewerbemietvertrag bezeichnet",
        description: "Wird der Raum tatsächlich zu Wohnzwecken genutzt, gilt trotz falscher Bezeichnung das Wohnraummietrecht!",
        isFlawIfTrue: true,
      },
    ],
    verdicts: {
      flawed: {
        title: "Sonderregelungen oder verringerte Schutzrechte beachten",
        description: "Prüfen Sie die tatsächliche Nutzung. Bei echter Wohnraumnutzung greift stets der volle Schutz des BGB.",
      },
      valid: {
        title: "Klassisches Wohnraummietverhältnis",
        description: "Es gelten die vollen Schutzvorschriften für Kündigungsschutz, Mietpreisbremse und Kaution.",
      },
    },
    actionSteps: [
      "Prüfen Sie den Vertragsgegenstand im Vertragstext.",
      "Stellen Sie sicher, dass Wohn- und Gewerbenutzung im Vertrag klar getrennt sind.",
    ],
    templateHint: "Hinweis: Bei Mischmietverhältnissen entscheidet der überwiegende vertragliche Zweck.",
  },
  {
    id: "nebenkostenabrechnung",
    title: "Nebenkostenabrechnung & 12-Monats-Frist",
    category: "Miete & Kosten",
    icon: CalendarCheck,
    legalBasis: "§ 556 Abs. 3 BGB, BetrKV",
    confidence: "high",
    summary:
      "Der Vermieter muss die Betriebskostenabrechnung spätestens 12 Monate nach Ende des Abrechnungszeitraums vorlegen. Nach Ablauf dieser Ausschlussfrist sind Nachforderungen ausgeschlossen!",
    checkPoints: [
      {
        id: "n_frist",
        label: "Abrechnung für das Vorjahr wurde erst nach mehr als 12 Monaten zugestellt",
        description: "Abrechnung für das Kalenderjahr 2024 muss spätestens am 31.12.2025 beim Mieter eingehen. Danach verfällt der Nachforderungsanspruch!",
        isFlawIfTrue: true,
      },
      {
        id: "n_schluessel",
        label: "Verteilerschlüssel fehlt oder weicht unbegründet vom Mietvertrag ab",
        description: "Die Abrechnung muss rechnerisch nachvollziehbar sein und den im Vertrag vereinbarten Umlageschlüssel nutzen.",
        isFlawIfTrue: true,
      },
      {
        id: "n_positionen",
        label: "Nicht umlagefähige Kosten enthalten (z. B. Verwaltungskosten, Reparaturschäden)",
        description: "Verwaltung, Instandhaltung und Reparaturen sind KEINE Betriebskosten und dürfen nicht abgewälzt werden.",
        isFlawIfTrue: true,
      },
    ],
    verdicts: {
      flawed: {
        title: "Abrechnung ist verspätet oder enthält unzulässige Kosten",
        description: "Eine Nachforderung nach Ablauf der 12-Monats-Frist ist ausgeschlossen. Ein Guthaben steht Ihnen dennoch zu!",
      },
      valid: {
        title: "Abrechnung fristgerecht zugestellt",
        description: "Sie haben 12 Monate Zeit, die Abrechnung zu prüfen und Belegeinsicht beim Vermieter anzufordern.",
      },
    },
    actionSteps: [
      "Prüfen Sie das Zustellungsdatum der Abrechnung und den Abrechnungszeitraum.",
      "Verlangen Sie bei Unklarheiten Einsicht in die Originalbelege beim Vermieter oder Hausverwaltung.",
      "Widersprechen Sie unzulässigen Positionen (z. B. 'Verwaltungshonorar', 'Instandhaltung Dach') schriftlich.",
    ],
    templateHint: "Widerspruch Nebenkosten: 'Der Nachforderung aus der Abrechnung vom [Datum] widerspreche ich, da die 12-monatige Ausschlussfrist gemäß § 556 Abs. 3 BGB abgelaufen ist.'",
  },
];

export default function MietrechtsCheckerPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedTopicId, setExpandedTopicId] = useState<string>("mieterhoehung");
  const [checkedPoints, setCheckPoints] = useState<Record<string, boolean>>({});

  // Toggle checklist checkbox
  function togglePoint(pointId: string) {
    setCheckPoints((prev) => ({
      ...prev,
      [pointId]: !prev[pointId],
    }));
  }

  // Filter topics
  const filteredTopics = useMemo(() => {
    return TENANT_TOPICS.filter((topic) => {
      const matchesCategory =
        !selectedCategory || topic.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        topic.title.toLowerCase().includes(q) ||
        topic.summary.toLowerCase().includes(q) ||
        topic.legalBasis.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const categories = useMemo(() => {
    const set = new Set(TENANT_TOPICS.map((t) => t.category));
    return Array.from(set);
  }, []);

  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar activePage="mietrechts-checker" />

      <div className="lg:pl-60">
        <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10">
          {/* Topbar */}
          <div className="mb-8 flex items-center justify-between border-b border-border/60 pb-5">
            <div>
              <p className="font-mono text-xs uppercase tracking-wide text-ink/45">
                CivicAI · Mieterrechte & Selbstprüfung
              </p>
              <h1 className="text-xl font-semibold text-ink">
                Mietrechts-Checker
              </h1>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="hidden text-sm text-ink/70 sm:inline">
                Geprüfte Rechtsgrundlagen
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-seal-light text-xs font-semibold text-seal">
                MC
              </span>
            </div>
          </div>

          {/* Hero Banner */}
          <div className="mb-8 rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
            <div className="max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-md bg-seal-light px-2.5 py-1 font-mono text-xs font-medium uppercase tracking-wider text-seal">
                <Home size={14} />
                <span>Interaktive Rechte-Analyse für Mieter</span>
              </div>
              <h2 className="mb-3 text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
                Sind Ihre Rechte als Mieter gewahrt?
              </h2>
              <p className="text-sm leading-relaxed text-ink/70 sm:text-base">
                Prüfen Sie typische Konfliktfelder von Mieterhöhung über Kaution bis Nebenkosten. Nutzen Sie die interaktiven Checklisten zur ersten rechtlichen Einordnung Ihres Falls.
              </p>
            </div>

            {/* Filter & Search Bar */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Thema suchen (z. B. 'Mieterhöhung', 'Kaution', 'Schimmel', 'Nebenkosten')..."
                  className="w-full rounded-xl border border-border bg-canvas/50 py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-ink/40 focus:border-seal focus:bg-surface focus:outline-none focus:ring-1 focus:ring-seal"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    selectedCategory === null
                      ? "bg-seal text-white"
                      : "border border-border bg-surface text-ink/70 hover:bg-seal-light"
                  }`}
                >
                  Alle Themen ({TENANT_TOPICS.length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() =>
                      setSelectedCategory(selectedCategory === cat ? null : cat)
                    }
                    className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                      selectedCategory === cat
                        ? "bg-seal text-white"
                        : "border border-border bg-surface text-ink/70 hover:bg-seal-light"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Topics Accordion List */}
          <div className="flex flex-col gap-4">
            <p className="font-mono text-xs uppercase tracking-wide text-seal">
              Mietrechtliche Prüfbereiche ({filteredTopics.length})
            </p>

            {filteredTopics.map((topic) => {
              const Icon = topic.icon;
              const isExpanded = expandedTopicId === topic.id;

              // Check if any flaws are selected for this topic
              const activeFlawsCount = topic.checkPoints.filter(
                (cp) => checkedPoints[cp.id] && cp.isFlawIfTrue
              ).length;

              const hasFlaws = activeFlawsCount > 0;

              return (
                <div
                  key={topic.id}
                  className={`rounded-2xl border transition-all ${
                    isExpanded
                      ? "border-seal bg-surface shadow-card ring-1 ring-seal/30"
                      : "border-border bg-surface hover:border-seal/40"
                  }`}
                >
                  {/* Accordion Header */}
                  <div
                    onClick={() =>
                      setExpandedTopicId(isExpanded ? "" : topic.id)
                    }
                    className="flex cursor-pointer items-start justify-between gap-4 p-5 sm:p-6"
                  >
                    <div className="flex items-start gap-3.5">
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                          isExpanded
                            ? "bg-seal text-white"
                            : "bg-seal-light text-seal"
                        }`}
                      >
                        <Icon size={20} />
                      </span>

                      <div>
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <span className="font-mono text-[10px] uppercase tracking-wider text-ink/40">
                            {topic.category}
                          </span>
                          <span className="rounded bg-canvas px-2 py-0.5 font-mono text-[10px] font-semibold text-seal">
                            {topic.legalBasis}
                          </span>
                          {hasFlaws && (
                            <span className="rounded bg-signal-red-light px-2 py-0.5 font-mono text-[10px] font-bold text-signal-red">
                              {activeFlawsCount} Unstimmigkeit(en)
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-bold text-ink sm:text-lg">
                          {topic.title}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink/65">
                          {topic.summary}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <TrustBadge confidence={topic.confidence} />
                      <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-canvas text-ink/50 hover:bg-seal-light hover:text-seal">
                        {isExpanded ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Content Body */}
                  {isExpanded && (
                    <div className="border-t border-border/70 p-5 sm:p-6 bg-surface">
                      {/* Interactive Checklist */}
                      <div className="mb-6 rounded-xl border border-border bg-canvas/30 p-5">
                        <h4 className="mb-1 font-mono text-xs uppercase tracking-wide text-seal font-semibold">
                          1. Selbstprüfung: Trifft einer der folgenden Punkte auf Sie zu?
                        </h4>
                        <p className="mb-4 text-xs text-ink/60">
                          Wählen Sie die zutreffenden Aussagen aus, um eine Einschätzung zu erhalten:
                        </p>

                        <div className="flex flex-col gap-3">
                          {topic.checkPoints.map((cp) => {
                            const isChecked = !!checkedPoints[cp.id];
                            return (
                              <label
                                key={cp.id}
                                className={`flex items-start gap-3 rounded-xl border p-3.5 cursor-pointer transition-all ${
                                  isChecked
                                    ? cp.isFlawIfTrue
                                      ? "border-signal-red/40 bg-signal-red-light/30"
                                      : "border-signal-green/40 bg-signal-green-light/30"
                                    : "border-border bg-surface hover:bg-canvas/50"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => togglePoint(cp.id)}
                                  className="mt-0.5 h-4 w-4 rounded border-border text-seal focus:ring-seal"
                                />
                                <div>
                                  <p className="text-xs font-bold text-ink">
                                    {cp.label}
                                  </p>
                                  <p className="mt-0.5 text-[11px] leading-relaxed text-ink/60">
                                    {cp.description}
                                  </p>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      {/* Live Diagnosis Verdict */}
                      <div
                        className={`mb-6 rounded-xl border p-5 ${
                          hasFlaws
                            ? "border-signal-red/30 bg-signal-red-light/40 text-signal-red"
                            : "border-signal-green/30 bg-signal-green-light/40 text-signal-green"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {hasFlaws ? (
                            <AlertTriangle size={20} className="shrink-0 mt-0.5" />
                          ) : (
                            <CheckCircle2 size={20} className="shrink-0 mt-0.5" />
                          )}
                          <div>
                            <h4 className="text-sm font-bold">
                              {hasFlaws
                                ? topic.verdicts.flawed.title
                                : topic.verdicts.valid.title}
                            </h4>
                            <p className="mt-1 text-xs leading-relaxed opacity-90">
                              {hasFlaws
                                ? topic.verdicts.flawed.description
                                : topic.verdicts.valid.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action Steps */}
                      <div className="mb-6">
                        <h4 className="mb-3 font-mono text-xs uppercase tracking-wide text-ink/50">
                          2. Empfohlene Handlungsschritte für Mieter
                        </h4>
                        <div className="grid gap-2 sm:grid-cols-3">
                          {topic.actionSteps.map((step, idx) => (
                            <div
                              key={idx}
                              className="rounded-xl border border-border bg-canvas/20 p-3.5 text-xs text-ink/80"
                            >
                              <span className="mb-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-seal text-[10px] font-bold text-white">
                                {idx + 1}
                              </span>
                              <p className="leading-relaxed">{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Template Hint */}
                      <div className="rounded-xl border border-seal/20 bg-seal-light/40 p-4">
                        <div className="flex items-start gap-2.5">
                          <FileText size={16} className="mt-0.5 text-seal shrink-0" />
                          <div>
                            <p className="font-mono text-[10px] uppercase tracking-wider text-seal font-semibold">
                              Muster-Formulierungshilfe
                            </p>
                            <p className="mt-1 text-xs italic text-ink/80">
                              &bdquo;{topic.templateHint}&ldquo;
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legal Disclaimer */}
          <div className="mt-12 rounded-xl border border-border bg-surface p-5 shadow-card">
            <div className="flex items-start gap-3">
              <Info size={18} className="mt-0.5 shrink-0 text-seal" />
              <div>
                <p className="font-mono text-xs uppercase tracking-wide text-seal font-medium">
                  Rechtlicher Hinweis (Keine Rechtsberatung)
                </p>
                <p className="mt-1 text-xs leading-relaxed text-ink/65">
                  Der Mietrechts-Checker dient der unverbindlichen Selbstinformation und Orientierung von Mieterinnen und Mietern. Er ersetzt keine Rechtsberatung durch einen Fachanwalt für Mietrecht oder einen Mieterschutzverein. Alle Inhalte basieren auf dem BGB sowie aktuellen Grundsatzurteilen des Bundesgerichtshofs (BGH).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
