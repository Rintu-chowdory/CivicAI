"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Building2,
  FileText,
  PhoneCall,
  Scale,
  CheckCircle2,
  MapPin,
  HelpCircle,
  Info,
  X,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Filter,
  UserCheck,
  Briefcase,
  Home,
  Globe2,
  Receipt,
  HeartPulse,
  HardHat,
  Baby,
  Coins,
  CreditCard,
  Store,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TrustBadge from "@/components/TrustBadge";

interface AuthorityCategory {
  id: string;
  category: string;
  shortLabel: string;
  icon: any;
  authority: string;
  subTitle: string;
  description: string;
  responsibilities: string[];
  contact: {
    generalPhone: string;
    website: string;
    openingHoursInfo: string;
    appointmentTip: string;
  };
  documents: string[];
  legalBasis: string;
  keywords: string[];
}

const AUTHORITIES: AuthorityCategory[] = [
  {
    id: "arbeitslosigkeit",
    category: "Arbeitslosigkeit / Arbeitsamt",
    shortLabel: "Arbeitslosigkeit",
    icon: Briefcase,
    authority: "Agentur für Arbeit (und Jobcenter)",
    subTitle: "Arbeitsvermittlung, Arbeitslosengeld I & Weiterbildungsförderung",
    description:
      "Die Agentur für Arbeit ist zuständig für versicherungsrechtliche Leistungen wie Arbeitslosengeld I, Jobsuche, Berufsberatung und Umschulungen. Bei Hilfebedürftigkeit übernimmt das Jobcenter (Grundsicherung/Bürgergeld).",
    responsibilities: [
      "Gewährung von Arbeitslosengeld I (ALG I)",
      "Vermittlung in Arbeits- und Ausbildungsverhältnisse",
      "Beratung und Förderung von Weiterbildungen / Umschulungen",
      "Berufsberatung für Jugendliche und Erwachsene",
      "Bearbeitung von Kurzarbeitergeld und Insolvenzgeld",
    ],
    contact: {
      generalPhone: "0800 4 5555 00 (kostenfrei)",
      website: "arbeitsagentur.de",
      openingHoursInfo: "Montag bis Freitag, meist 08:00 – 18:00 Uhr telefonisch erreichbar.",
      appointmentTip: "Arbeitssuchend-Meldung zwingend online oder persönlich spätestens 3 Monate vor Vertragsende erledigen.",
    },
    documents: [
      "Gültiger Personalausweis oder Reisepass mit Meldebescheinigung",
      "Sozialversicherungsausweis / Rentenversicherungsnummer",
      "Kündigungsschreiben oder Auflösungsvertrag",
      "Arbeitsvertrag der letzten Beschäftigung",
      "Lückenloser tabellarischer Lebenslauf",
      "Nachweise über bisheriges Gehalt (Gehaltsabrechnungen)",
    ],
    legalBasis: "Drittes Buch Sozialgesetzbuch (SGB III)",
    keywords: ["arbeitslos", "arbeitsamt", "alg 1", "alg i", "jobcenter", "bürgergeld", "weiterbildung", "kündigung", "jobsuche"],
  },
  {
    id: "wohngeld",
    category: "Wohngeld / Wohnungssuche",
    shortLabel: "Wohngeld & Wohnen",
    icon: Home,
    authority: "Wohnungsamt / Wohngeldbehörde",
    subTitle: "Mietzuschuss, Lastenzuschuss & Wohnberechtigungsschein (WBS)",
    description:
      "Das Wohnungsamt unterstützt Bürgerinnen und Bürger mit geringem Einkommen durch staatliche Mietzuschüsse (Wohngeld) oder Lastenzuschüsse für Wohneigentum sowie die Ausstellung eines Wohnberechtigungsscheins (WBS).",
    responsibilities: [
      "Bearbeitung und Bewilligung von Wohngeldanträgen",
      "Erteilung von Wohnberechtigungsscheinen (WBS)",
      "Vermittlung von sozial gebundenem Wohnraum",
      "Beratung bei drohender Wohnungslosigkeit",
    ],
    contact: {
      generalPhone: "Zentrale Behördenrufnummer 115 oder örtliches Rathaus",
      website: "serviceportal.de / städtisches Wohnungsamt",
      openingHoursInfo: "Miet- und Wohngeldberatung oft nach Terminvereinbarung.",
      appointmentTip: "Wohngeld wird erst ab dem Monat der Antragstellung gezahlt — Antrag frühzeitig einreichen!",
    },
    documents: [
      "Ausgefüllter und unterschriebener Wohngeldantrag",
      "Gültiger Mietvertrag inklusive aktueller Mietänderungsschreiben",
      "Mietbescheinigung (vom Vermieter ausgefüllt)",
      "Einkommensnachweise aller im Haushalt lebenden Personen der letzten 12 Monate",
      "Nachweise über Heiz- und Nebenkosten",
      "Nachweise über Unterhaltszahlungen oder Werbekosten",
    ],
    legalBasis: "Wohngeldgesetz (WoGG) & Wohngeldverordnung (WoGV)",
    keywords: ["wohngeld", "wohnung", "miete", "wbs", "wohnberechtigungsschein", "mietzuschuss", "lastenzuschuss", "vermieter"],
  },
  {
    id: "auslaenderrecht",
    category: "Ausländerrecht / Aufenthalt",
    shortLabel: "Ausländerrecht",
    icon: Globe2,
    authority: "Ausländerbehörde (Migrationsamt)",
    subTitle: "Aufenthaltstitel, Visa, Fiktionsbescheinigung & Einbürgerung",
    description:
      "Die Ausländerbehörde ist für die Regelung des Aufenthalts von ausländischen Staatsangehörigen zuständig. Sie erteilt Aufenthaltstitel, Visa, Arbeitserlaubnisse und prüft Einbürgerungsanträge.",
    responsibilities: [
      "Erteilung und Verlängerung von Aufenthaltstiteln (eAT)",
      "Bearbeitung von Visa-Anträgen und Aufenthaltserlaubnissen zum Zweck der Arbeit / Ausbildung / Familiennachzug",
      "Ausstellung von Fiktionsbescheinigungen und Duldungen",
      "Prüfung und Erteilung von Niederlassungserlaubnissen und Einbürgerungen",
    ],
    contact: {
      generalPhone: "Lokal erreichbar über das Stadt- / Landratsamt oder 115",
      website: "service.berlin.de / kommunales Migrationsamt Portal",
      openingHoursInfo: "Fast ausschließlich nach vorheriger Online-Terminvergabe.",
      appointmentTip: "Termine mindestens 3–4 Monate vor Ablauf des aktuellen Aufenthaltstitels sichern.",
    },
    documents: [
      "Gültiger Reisepass oder Passersatzpapier",
      "Aktuelles biometrisches Passbild (höchstens 6 Monate alt)",
      "Aktueller Aufenthaltstitel / Visum / Fiktionsbescheinigung",
      "Nachweis über die Sicherung des Lebensunterhalts (Arbeitsvertrag, Gehaltsabrechnungen der letzten 3 Monate)",
      "Krankenversicherungsnachweis (Mitgliedsbescheinigung)",
      "Mietvertrag und Wohnflächennachweis",
    ],
    legalBasis: "Aufenthaltsgesetz (AufenthG) & Aufenthaltsverordnung (AufenthV)",
    keywords: ["aufenthalt", "visum", "ausländerbehörde", "pass", "einbürgerung", "fiktionsbescheinigung", "niederlassungserlaubnis", "duldung"],
  },
  {
    id: "steuer",
    category: "Steuer / Steuern",
    shortLabel: "Steuern & Finanzamt",
    icon: Receipt,
    authority: "Finanzamt",
    subTitle: "Steuererklärung, Steuerklasse, Steuer-ID & Freibeträge",
    description:
      "Das Finanzamt verwaltet die Steuerfestsetzung und -erhebung für Einkommensteuer, Gewerbesteuer, Umsatzsteuer und Erbschaftsteuer. Es vergibt zudem die Steuer-Identifikationsnummer.",
    responsibilities: [
      "Festsetzung der Einkommen-, Umsatz- und Gewerbesteuer",
      "Vergabe und Verwaltung der Steuer-Identifikationsnummer",
      "Änderung von Lohnsteuerabzugsmerkmalen (Steuerklassenwechsel)",
      "Bearbeitung von Anträgen auf Lohnsteuer-Ermäßigung",
    ],
    contact: {
      generalPhone: "Steuerfachauskunft des örtlichen Finanzamts",
      website: "elster.de / finanzamt.de",
      openingHoursInfo: "Service-Center der Finanzämter meist vormittags geöffnet.",
      appointmentTip: "Steuererklärungen am einfachsten und schnellsten über das amtliche Portal ELSTER einreichen.",
    },
    documents: [
      "Steuer-Identifikationsnummer (Steuer-ID)",
      "Lohnsteuerbescheinigung des Arbeitgebers",
      "Nachweise über Werbekosten, Handwerkerleistungen oder Haushaltsnahe Dienstleistungen",
      "Spendenbescheinigungen & Belege für außergewöhnliche Belastungen",
      "Bankverbindung für eventuelle Rückerstattungen",
    ],
    legalBasis: "Abgabenordnung (AO) & Einkommensteuergesetz (EStG)",
    keywords: ["steuer", "finanzamt", "steuererklärung", "elster", "steuerklasse", "steuer-id", "freibetrag", "lohnsteuer"],
  },
  {
    id: "rente",
    category: "Renten / Rente",
    shortLabel: "Rentenversicherung",
    icon: Scale,
    authority: "Deutsche Rentenversicherung",
    subTitle: "Altersrente, Erwerbsminderungsrente, Kontenklärung & Reha",
    description:
      "Die Deutsche Rentenversicherung berechnet Rentenansprüche, führt Kontenklärungen durch, gewährt medizinische und berufliche Rehabilitationen und zahlt Alters- und Hinterbliebenenrenten aus.",
    responsibilities: [
      "Bearbeitung von Anträgen auf Altersrente, Erwerbsminderungsrente und Witwen-/Waisenrente",
      "Durchführung von Rentenkontenklärungen (Anrechnung von Ausbildungs- und Erziehungszeiten)",
      "Gewährung von Leistungen zur medizinischen und beruflichen Rehabilitation",
      "Individuelle Rentenberatung und Rentenauskunft",
    ],
    contact: {
      generalPhone: "0800 1000 4800 (kostenfreies Servicetelefon)",
      website: "deutsche-rentenversicherung.de",
      openingHoursInfo: "Auskunfts- und Beratungsstellen vor Ort mit Terminvereinbarung.",
      appointmentTip: "Reichen Sie Rentenanträge mindestens 3 Monate vor dem geplanten Rentenbeginn ein.",
    },
    documents: [
      "Gültiger Personalausweis oder Reisepass",
      "Versicherungsnummer der Deutschen Rentenversicherung",
      "Lückenloser Nachweis aller Ausbildungs- und Beschäftigungszeiten",
      "Geburtsurkunden der Kinder (für Kindererziehungszeiten)",
      "Nachweis über Krankengeld- oder Arbeitslosengeldbezug",
    ],
    legalBasis: "Sechstes Buch Sozialgesetzbuch (SGB VI)",
    keywords: ["rente", "rentenversicherung", "altersrente", "erwerbsminderung", "kontenklärung", "reha", "rente mit 63", "versicherungsverlauf"],
  },
  {
    id: "gesundheit",
    category: "Gesundheit / Krankenversicherung",
    shortLabel: "Gesundheit & Kasse",
    icon: HeartPulse,
    authority: "Krankenkasse / Gesundheitsamt",
    subTitle: "Krankenversicherungsschutz, Pflegegrad & Infektionsschutz",
    description:
      "Die gesetzlichen Krankenkassen regeln Behandlungen, Krankengeld und Pflegegrade. Das kommunale Gesundheitsamt kümmert sich um den öffentlichen Gesundheitsschutz, Gutachten und Schuluntersuchungen.",
    responsibilities: [
      "Sicherstellung des gesetzlichen Krankenversicherungsschutzes",
      "Auszahlung von Krankengeld bei längerer Arbeitsunfähigkeit",
      "Bearbeitung von Anträgen auf Pflegeleistungen und Pflegegrade",
      "Gesundheitsamt: Belehrungen nach dem Infektionsschutzgesetz, Impfberatung, amtsärztliche Atteste",
    ],
    contact: {
      generalPhone: "Kundenhotline Ihrer jeweiligen Krankenkasse (AOK, TK, Barmer etc.)",
      website: "krankenkasse.de / gesundheitsamt-portal.de",
      openingHoursInfo: "Krankenkassenfilialen meist werktags durchgehend geöffnet.",
      appointmentTip: "Krankmeldungen (AU) müssen unverzüglich elektronisch oder per Attest vorgelegt werden.",
    },
    documents: [
      "Elektronische Gesundheitskarte (eGK)",
      "Gültiges Ausweisdokument",
      "Arbeitsunfähigkeitsbescheinigung (AU-Bescheinigung) vom Arzt",
      "Ärztliche Befundberichte bei Pflegeanträgen oder Kuren",
    ],
    legalBasis: "Fünftes Buch Sozialgesetzbuch (SGB V) & Infektionsschutzgesetz (IfSG)",
    keywords: ["gesundheit", "krankenkasse", "krankengeld", "gesundheitsamt", "pflegegrad", "impfung", "attest", "versicherungsnachweis"],
  },
  {
    id: "baugenehmigung",
    category: "Baugenehmigung / Bauen",
    shortLabel: "Bauen & Bauamt",
    icon: HardHat,
    authority: "Bauamt / Bauaufsichtsbehörde",
    subTitle: "Baugenehmigungen, Flächennutzung & Denkmalschutz",
    description:
      "Das Bauamt prüft Bauanträge, erteilt Baugenehmigungen, überwacht Bauvorhaben gemäß der Landesbauordnung und verwaltet Flächennutzungs- und Bebauungspläne.",
    responsibilities: [
      "Prüfung und Erteilung von Baugenehmigungen für Neubau, Umbau und Nutzungsänderung",
      "Einsichtnahme in Bebauungspläne und das Baulastenverzeichnis",
      "Überwachung der Einhaltung von Bauvorschriften und Statik",
      "Erteilung von denkmalschutzrechtlichen Genehmigungen",
    ],
    contact: {
      generalPhone: "Bauaufsichtsamt der Stadt- oder Kreisverwaltung / 115",
      website: "bauamt.de / kommunales Bauportal",
      openingHoursInfo: "Sprechzeiten der Bauberatung meist Dienstag und Donnerstag.",
      appointmentTip: "Reichen Sie Bauanträge immer in Zusammenarbeit mit einem bauvorlageberechtigten Architekten ein.",
    },
    documents: [
      "Offizielles Bauantragsformular",
      "Amtlicher Lageplan mit Flurkarte (vom Katasteramt)",
      "Bauzeichnungen (Grundrisse, Schnitte, Ansichten im Maßstab 1:100)",
      "Baubeschreibung & Berechnungen (Wohnfläche, umbauter Raum)",
      "Standsicherheits- und Brandschutznachweis (Statik)",
    ],
    legalBasis: "Landesbauordnung (LBO) des jeweiligen Bundeslandes & Baugesetzbuch (BauGB)",
    keywords: ["bauen", "bauamt", "baugenehmigung", "umbau", "architekt", "bebauungsplan", "statik", "flurkarte", "denkmalschutz"],
  },
  {
    id: "meldeangelegenheiten",
    category: "Meldeangelegenheiten",
    shortLabel: "Meldewesen",
    icon: MapPin,
    authority: "Bürgeramt / Einwohnermeldeamt",
    subTitle: "Wohnsitz anmelden, Ummelden, Abmelden & Meldebescheinigung",
    description:
      "Das Bürgeramt ist die zentrale Anlaufstelle für Meldeangelegenheiten. Hier melden Sie Ihren Haupt- oder Nebenwohnsitz an, beantragen Meldebescheinigungen oder amtliche Beglaubigungen.",
    responsibilities: [
      "An-, Um- und Abmeldung von Wohnsitzen",
      "Ausstellung von einfachen und erweiterten Meldebescheinigungen",
      "Beantragung von Führungszeugnissen (privat / behördlich)",
      "Amtliche Beglaubigungen von Dokumenten und Unterschriften",
    ],
    contact: {
      generalPhone: "Einheitliche Behördenrufnummer 115",
      website: "serviceportal.de der Heimatgemeinde",
      openingHoursInfo: "Frühzeitige Online-Terminbuchung zwingend empfohlen.",
      appointmentTip: "Anmeldung muss laut Bundesmeldegesetz innerhalb von 2 Wochen nach dem Einzug erfolgen.",
    },
    documents: [
      "Gültiger Personalausweis oder Reisepass aller anzumeldenden Personen",
      "Wohnungsgeberbestätigung (vom Vermieter komplett ausgefüllt und unterschrieben)",
      "Ausgefülltes Anmeldeformular der Meldebehörde",
      "Bei Familien: Geburtsurkunden der Kinder und Eheurkunde",
    ],
    legalBasis: "Bundesmeldegesetz (BMG)",
    keywords: ["anmeldung", "ummelden", "bürgeramt", "einwohnermeldeamt", "wohnsitz", "wohnungsgeberbestätigung", "meldebescheinigung", "führungszeugnis"],
  },
  {
    id: "jugendamt",
    category: "Kind / Jugendhilfe",
    shortLabel: "Jugend & Familie",
    icon: Baby,
    authority: "Jugendamt",
    subTitle: "Unterhalt, Beistandschaft, Elterngeld, Kita-Platz & Kinderschutz",
    description:
      "Das Jugendamt unterstützt Eltern und Alleinerziehende bei der Erziehung, regelt Unterhaltsansprüche und Beistandschaften, unterstützt bei der Kita-Platz-Suche und wahrt das Kindeswohl.",
    responsibilities: [
      "Einrichtung von Beistandschaften zur Unterhaltsberechnung und Vaterschaftsanerkennung",
      "Auszahlung von Unterhaltsvorschuss für Alleinerziehende",
      "Beratung bei Trennung, Scheidung und Sorgerechtsfragen",
      "Unterstützung bei der Vermittlung von Kita-Plätzen / Tagespflege",
      "Wahrnehmung des Schutzauftrags bei Kindeswohlgefährdung",
    ],
    contact: {
      generalPhone: "Jugendamt der Stadtverwaltung / Kreisverwaltung",
      website: "bmfsfj.de / örtliches Jugendamt Portal",
      openingHoursInfo: "Allgemeiner Sozialdienst (ASD) während der Behördenzeiten erreichbar.",
      appointmentTip: "Unterhaltsvorschuss rückwirkend nur für maximal 1 Monat möglich — schnell beantragen!",
    },
    documents: [
      "Geburtsurkunde des Kindes",
      "Personalausweis oder Pass der sorgeberechtigten Elternteile",
      "Vaterschaftsanerkennung und Sorgeerklärung (falls zutreffend)",
      "Einkommensnachweise der letzten 12 Monate für Unterhaltsberechnungen",
      "Ggf. gerichtliche Scheidungs- oder Scheidungsfolgenvereinbarungen",
    ],
    legalBasis: "Achtes Buch Sozialgesetzbuch (SGB VIII) & Bürgerliches Gesetzbuch (BGB)",
    keywords: ["kind", "jugendamt", "unterhalt", "unterhaltsvorschuss", "kita", "elterngeld", "sorgerecht", "vaterschaft", "beistandschaft"],
  },
  {
    id: "sozialleistungen",
    category: "Sozialleistungen / Grundsicherung",
    shortLabel: "Sozialleistungen",
    icon: Coins,
    authority: "Sozialamt / Jobcenter",
    subTitle: "Grundsicherung im Alter, Bürgergeld & Hilfe zum Lebensunterhalt",
    description:
      "Das Sozialamt gewährt Grundsicherung im Alter, bei Erwerbsminderung sowie Hilfen zur Pflege. Das Jobcenter sichert den Lebensunterhalt erwerbsfähiger Hilfebedürftiger durch Bürgergeld.",
    responsibilities: [
      "Auszahlung von Bürgergeld (Jobcenter) bzw. Grundsicherung im Alter / Erwerbsminderung (Sozialamt)",
      "Übernahme angemessener Kosten der Unterkunft und Heizung (KdU)",
      "Gewährung von einmaligen Beihilfen (Erstausstattung Wohnung, Baby-Erstausstattung)",
      "Hilfe zur Pflege und Übernahme von Bestattungskosten",
    ],
    contact: {
      generalPhone: "Zentrale des zuständigen Sozialamts oder Jobcenters",
      website: "jobcenter.de / sozialamt.de",
      openingHoursInfo: "Persönliche Vorsprache oft nur mit festem Termin.",
      appointmentTip: "Kontoauszüge der letzten 3 Monate lückenlos und ungeschwärzt vorbereiten.",
    },
    documents: [
      "Ausgefüllter Hauptantrag auf Grundsicherung / Bürgergeld",
      "Personalausweis aller Mitglieder der Bedarfsgemeinschaft",
      "Mietvertrag, Mietbescheinigung und letzte Heizkostenabrechnung",
      "Lückenlose Kontoauszüge aller Bankkonten der letzten 3 Monate",
      "Nachweise über jegliches Einkommen und Vermögen (Sparkonten, Lebensversicherungen)",
    ],
    legalBasis: "Zwölftes Buch Sozialgesetzbuch (SGB XII) & Zweites Buch Sozialgesetzbuch (SGB II)",
    keywords: ["sozialamt", "jobcenter", "bürgergeld", "grundsicherung", "sozialhilfe", "erstausstattung", "unterkunftskosten", "heizkosten"],
  },
  {
    id: "pass",
    category: "Pass / Ausweis",
    shortLabel: "Pass & Ausweis",
    icon: CreditCard,
    authority: "Bürgeramt / Paßamt",
    subTitle: "Personalausweis, Reisepass, Kinderreisepass & Verlustmeldung",
    description:
      "Das Passamt / Bürgeramt stellt amtliche Identitätsdokumente wie Personalausweise, Reisepässe und Express-Pässe aus und schaltet Online-Ausweisfunktionen (eID) frei.",
    responsibilities: [
      "Ausstellung und Verlängerung von Personalausweisen",
      "Beantragung von e-Reisepässen und Express-Reisepässen",
      "Ausstellung vorläufiger Personalausweise und Reisepässe bei Eilbedürftigkeit",
      "Aktivierung der Online-Ausweisfunktion (PIN-Rücksetzdienst)",
    ],
    contact: {
      generalPhone: "Behördenrufnummer 115",
      website: "personalausweisportal.de / städtisches Bürgeramt",
      openingHoursInfo: "Termine meist 4–8 Wochen im Voraus ausgebucht, regelmäßige Frühmorgens-Slots prüfen.",
      appointmentTip: "Bei kurzfristigen Auslandsreisen Express-Reisepass (Herstellung ca. 3 Werktage) verlangen.",
    },
    documents: [
      "Bisheriger Personalausweis, Reisepass oder Kinderausweis",
      "Aktuelles biometrisches Passbild (35 x 45 mm, nicht älter als 6 Monate)",
      "Geburts- oder Eheurkunde im Original (bei Erstbeantragung am Wohnort)",
      "Gebühr (Personalausweis ca. 37 €, Reisepass ca. 70 € — meist EC-Karte nötig)",
    ],
    legalBasis: "Personalausweisgesetz (PAuswG) & Passgesetz (PassG)",
    keywords: ["pass", "ausweis", "personalausweis", "reisepass", "expresspass", "passbild", "bürgeramt", "paßamt", "verlustmeldung"],
  },
  {
    id: "gewerbe",
    category: "Gewerbe / Gewerbeanmeldung",
    shortLabel: "Gewerbeamt",
    icon: Store,
    authority: "Gewerbeamt / Ordnungsamt",
    subTitle: "Gewerbeanmeldung, Ummeldung, Abmeldung & Gewerbeschein",
    description:
      "Das Gewerbeamt ist für die Erfassung von Gewerbebetrieben verantwortlich. Wer eine selbstständige Tätigkeit aufnimmt, muss diese hier offiziell anzeigen (Gewerbeschein).",
    responsibilities: [
      "Bearbeitung von Gewerbeanmeldungen, -ummeldungen und -abmeldungen (GewA 1-3)",
      "Ausstellung des Gewerbescheins zur Vorlage bei Partnern und Banken",
      "Prüfung erlaubnispflichtiger Gewerbe (z.B. Gastronomie, Makler, Bewachungsgewerbe)",
      "Erteilung von Auskünften aus dem Gewerbezentralregister",
    ],
    contact: {
      generalPhone: "Gewerbeamt der Stadtverwaltung / Ordnungsamt",
      website: "gewerbeanmeldung.de / Online-Gewerbeportal des Bundeslandes",
      openingHoursInfo: "Gewerbeanmeldung in vielen Bundesländern komplett online möglich.",
      appointmentTip: "Prüfen Sie vorab, ob Ihre Tätigkeit freiberuflich (Finanzamt) oder gewerblich ist.",
    },
    documents: [
      "Gültiger Personalausweis oder Reisepass mit Meldebescheinigung",
      "Vollständig ausgefülltes Formular zur Gewerbeanmeldung (GewA 1)",
      "Bei juristischen Personen (GmbH, UG): Aktueller Handelsregisterauszug",
      "Bei erlaubnispflichtigem Gewerbe: Führungszeugnis & Gewerbezentralregisterauszug",
      "Bearbeitungsgebühr (ca. 15 € bis 65 € je nach Kommune)",
    ],
    legalBasis: "Gewerbeordnung (GewO)",
    keywords: ["gewerbe", "gewerbeamt", "gewerbeschein", "gewerbeanmeldung", "selbstständig", "ordnungsamt", "gewerberegister", "freiberufler"],
  },
];

export default function BehordenFinderPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedAuthorityId, setSelectedAuthorityId] = useState<string>("arbeitslosigkeit");

  // Filter authorities based on search query or selected category
  const filteredAuthorities = useMemo(() => {
    let result = AUTHORITIES;

    if (selectedCategoryId) {
      result = result.filter((item) => item.id === selectedCategoryId);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.category.toLowerCase().includes(q) ||
          item.authority.toLowerCase().includes(q) ||
          item.subTitle.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.legalBasis.toLowerCase().includes(q) ||
          item.keywords.some((k) => k.includes(q))
      );
    }

    return result;
  }, [searchQuery, selectedCategoryId]);

  // Selected active item details
  const activeAuthority = useMemo(() => {
    return (
      AUTHORITIES.find((a) => a.id === selectedAuthorityId) ||
      filteredAuthorities[0] ||
      AUTHORITIES[0]
    );
  }, [selectedAuthorityId, filteredAuthorities]);

  function handleCategoryClick(id: string) {
    if (selectedCategoryId === id) {
      setSelectedCategoryId(null);
    } else {
      setSelectedCategoryId(id);
      setSelectedAuthorityId(id);
    }
  }

  function handleResetFilters() {
    setSearchQuery("");
    setSelectedCategoryId(null);
  }

  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar />

      <div className="lg:pl-60">
        <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10">
          {/* Topbar */}
          <div className="mb-8 flex items-center justify-between border-b border-border/60 pb-5">
            <div>
              <p className="font-mono text-xs uppercase tracking-wide text-ink/45">
                CivicAI · Orientierung & Bürgerservice
              </p>
              <h1 className="text-xl font-semibold text-ink">Behörden-Finder</h1>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="hidden text-sm text-ink/70 sm:inline">
                Sichere Zuordnung
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-seal-light text-xs font-semibold text-seal">
                BF
              </span>
            </div>
          </div>

          {/* Hero Banner */}
          <div className="mb-8 rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
            <div className="max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-md bg-seal-light px-2.5 py-1 font-mono text-xs font-medium uppercase tracking-wider text-seal">
                <Building2 size={14} />
                <span>Anliegen matchen & Anlaufstellen finden</span>
              </div>
              <h2 className="mb-3 text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
                Welche Behörde ist für Ihr Problem zuständig?
              </h2>
              <p className="text-sm leading-relaxed text-ink/70 sm:text-base">
                Beschreiben Sie Ihr Anliegen oder wählen Sie ein Thema aus. Wir zeigen Ihnen auf einen Blick die richtige Anlaufstelle, erforderliche Unterlagen, Kontaktsysteme und gesetzliche Grundlagen.
              </p>
            </div>

            {/* Search Input */}
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
                  placeholder="Problem beschreiben (z.B. 'Ich brauche einen neuen Reisepass', 'Kündigung Arbeitsplatz', 'Mietzuschuss')..."
                  className="w-full rounded-xl border border-border bg-canvas/50 py-3 pl-10 pr-10 text-sm text-ink placeholder:text-ink/40 focus:border-seal focus:bg-surface focus:outline-none focus:ring-1 focus:ring-seal"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {(searchQuery || selectedCategoryId) && (
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-surface px-4 py-3 text-xs font-medium text-ink/70 hover:bg-seal-light hover:text-seal"
                >
                  <X size={14} />
                  Filter zurücksetzen
                </button>
              )}
            </div>
          </div>

          {/* Categories Grid (12 Categories) */}
          <div className="mb-10">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-mono text-xs uppercase tracking-wide text-seal">
                Themenkategorien (12 Lebenslagen)
              </p>
              {selectedCategoryId && (
                <span className="text-xs text-ink/50">
                  1 Kategorie ausgewählt
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {AUTHORITIES.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedCategoryId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleCategoryClick(item.id)}
                    className={`flex items-center gap-2.5 rounded-xl border p-3 text-left text-xs transition-all ${
                      isSelected
                        ? "border-seal bg-seal text-white shadow-sm font-medium"
                        : "border-border bg-surface text-ink hover:border-seal/40 hover:bg-seal-light/50"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                        isSelected ? "bg-white/20 text-white" : "bg-seal-light text-seal"
                      }`}
                    >
                      <Icon size={14} />
                    </span>
                    <span className="line-clamp-2 leading-tight">{item.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Result Summary Banner if searching */}
          {searchQuery && (
            <div className="mb-6 flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3 text-xs text-ink/70 shadow-sm">
              <span>
                Suchergebnisse für &quot;<span className="font-semibold text-ink">{searchQuery}</span>&quot;:{" "}
                <strong className="text-seal">{filteredAuthorities.length}</strong> Treffer gefunden
              </span>
              {filteredAuthorities.length === 0 && (
                <span className="text-signal-red font-medium">Keine passende Behörde gefunden. Versuchen Sie es mit allgemeineren Begriffen.</span>
              )}
            </div>
          )}

          {/* Main Display Area: Master / Detail */}
          <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
            {/* Left Column: Authority Match List */}
            <div className="flex flex-col gap-3">
              <p className="font-mono text-xs uppercase tracking-wide text-seal">
                Passende Behörden ({filteredAuthorities.length})
              </p>

              {filteredAuthorities.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-surface p-6 text-center">
                  <HelpCircle className="mx-auto mb-2 text-ink/30" size={32} />
                  <p className="text-sm font-semibold text-ink">Kein Treffer</p>
                  <p className="mt-1 text-xs text-ink/60">
                    Bitte ändern Sie die Suchbegriffe oder setzen Sie den Filter zurück.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-seal underline"
                  >
                    Alle 12 Behörden anzeigen
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {filteredAuthorities.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeAuthority.id === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedAuthorityId(item.id)}
                        className={`group cursor-pointer rounded-xl border p-4 transition-all ${
                          isActive
                            ? "border-seal bg-surface shadow-card ring-1 ring-seal"
                            : "border-border bg-surface hover:border-seal/40 hover:bg-canvas/50"
                        }`}
                      >
                        <div className="mb-2 flex items-start justify-between gap-2">
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                              isActive
                                ? "bg-seal text-white"
                                : "bg-seal-light text-seal group-hover:bg-seal group-hover:text-white"
                            }`}
                          >
                            <Icon size={16} />
                          </span>
                          <span className="font-mono text-[10px] uppercase tracking-wider text-ink/40">
                            {item.shortLabel}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-ink group-hover:text-seal">
                          {item.authority}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink/65">
                          {item.subTitle}
                        </p>

                        <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2 text-[11px] font-medium text-seal">
                          <span>Details & Mitzubringen</span>
                          <ChevronRight
                            size={14}
                            className={`transition-transform ${
                              isActive ? "translate-x-1 text-seal" : "text-ink/30 group-hover:text-seal"
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Column: Detailed View for Active Authority */}
            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-wide text-seal">
                Detailübersicht & Checkliste
              </p>

              {activeAuthority && (
                <div className="rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
                  {/* Header */}
                  <div className="mb-6 border-b border-border/70 pb-6">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-seal-light px-3 py-1 font-mono text-xs font-semibold uppercase text-seal">
                        <Building2 size={13} />
                        Zuständige Stelle
                      </span>
                      <span className="font-mono text-xs text-ink/50">
                        {activeAuthority.category}
                      </span>
                    </div>

                    <h2 className="text-2xl font-bold text-ink sm:text-3xl">
                      {activeAuthority.authority}
                    </h2>
                    <p className="mt-1 text-base font-medium text-seal">
                      {activeAuthority.subTitle}
                    </p>

                    <p className="mt-4 text-sm leading-relaxed text-ink/75">
                      {activeAuthority.description}
                    </p>
                  </div>

                  {/* Tasks / Responsibilities */}
                  <div className="mb-8">
                    <h3 className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-ink/50">
                      <CheckCircle2 size={15} className="text-seal" />
                      Hauptaufgaben & Zuständigkeiten
                    </h3>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {activeAuthority.responsibilities.map((resp, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 rounded-lg border border-border/60 bg-canvas/30 p-3 text-xs text-ink/80"
                        >
                          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-seal/10 text-[10px] font-bold text-seal">
                            ✓
                          </span>
                          <span>{resp}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Documents Checklist */}
                  <div className="mb-8 rounded-xl border border-seal/20 bg-seal-light/30 p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-seal font-semibold">
                        <FileText size={16} />
                        Mitzubringende Unterlagen (Checkliste)
                      </h3>
                      <span className="rounded bg-seal/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-seal">
                        Wichtig
                      </span>
                    </div>

                    <p className="mb-4 text-xs text-ink/65">
                      Halten Sie folgende Dokumente für Ihren Termin oder die Online-Antragstellung vollständig bereit:
                    </p>

                    <ul className="flex flex-col gap-2.5">
                      {activeAuthority.documents.map((doc, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-xs text-ink">
                          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded bg-surface border border-seal/40 text-seal text-[10px]">
                            ✓
                          </span>
                          <span className="font-medium">{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Contact Info & Opening */}
                  <div className="mb-8 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-border bg-canvas/30 p-4">
                      <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-ink">
                        <PhoneCall size={15} className="text-seal" />
                        <span>Kontakt & Erreichbarkeit</span>
                      </div>
                      <p className="text-xs font-mono font-medium text-seal">
                        {activeAuthority.contact.generalPhone}
                      </p>
                      <p className="mt-1 text-xs text-ink/60">
                        Website:{" "}
                        <span className="font-medium text-ink underline">
                          {activeAuthority.contact.website}
                        </span>
                      </p>
                      <p className="mt-2 text-[11px] leading-normal text-ink/60">
                        {activeAuthority.contact.openingHoursInfo}
                      </p>
                    </div>

                    <div className="rounded-xl border border-border bg-canvas/30 p-4">
                      <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-ink">
                        <Sparkles size={15} className="text-signal-amber" />
                        <span>Praxis-Tipp zur Antragstellung</span>
                      </div>
                      <p className="text-xs leading-relaxed text-ink/75">
                        {activeAuthority.contact.appointmentTip}
                      </p>
                    </div>
                  </div>

                  {/* Legal Basis */}
                  <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-4">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-seal-light text-seal">
                        <Scale size={16} />
                      </span>
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-wide text-ink/40">
                          Gesetzliche Grundlage
                        </p>
                        <p className="text-xs font-semibold text-ink">
                          {activeAuthority.legalBasis}
                        </p>
                      </div>
                    </div>
                    <span className="rounded bg-canvas px-2.5 py-1 font-mono text-[11px] text-ink/60">
                      Bundesrecht
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Legal Disclaimer */}
          <div className="mt-12 rounded-xl border border-border bg-surface p-5 shadow-card">
            <div className="flex items-start gap-3">
              <Info size={18} className="mt-0.5 shrink-0 text-seal" />
              <div>
                <p className="font-mono text-xs uppercase tracking-wide text-seal font-medium">
                  Rechtlicher Hinweis & Haftungsausschluss
                </p>
                <p className="mt-1 text-xs leading-relaxed text-ink/65">
                  Die auf dieser Seite bereitgestellten Informationen dienen der allgemeinen Orientierung und verständlichen Erstinformation im Behördendschungel. Sie stellen keine Rechtsberatung dar und ersetzen nicht die individuelle Kontaktaufnahme mit der zuständigen Stelle. Zuständigkeiten, Unterlagenanforderungen und Fristen können je nach Bundesland oder Kommune im Einzelfall abweichen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
