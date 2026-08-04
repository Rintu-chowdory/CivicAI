"""CivicAI backend API.

Provides endpoints for general legal questions (/ask), deadline calculations (/fristen),
authority search (/behorden-finder), legal cost estimation (/kostenrechner),
and tenancy law checks (/mietrechts-check).
"""

import calendar
import datetime
from typing import Any, Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title="CivicAI API")

# Keep existing CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================================
# Existing Models & Endpoints (/health, /ask)
# ============================================================================


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


# ============================================================================
# 1. /fristen Endpoint & Date Calculation Helpers
# ============================================================================


class FristenRequest(BaseModel):
    deadline_type: str = Field(
        ...,
        description="Typ der Frist, z.B. widerspruch_verwaltungsakt, klage_widerspruchsbescheid, wiedereinsetzung, untaetigkeitsklage, widerspruch_sozial, klage_sozial, widerspruch_steuer",
    )
    zustellungsdatum: str = Field(..., description="ISO Datum der Zustellung (YYYY-MM-DD)")
    zustellungsart: str = Field(
        "post", description="Zustellungsart: 'post', 'elektronisch', 'persoenlich'"
    )


class FristenResponse(BaseModel):
    frist_ende: str
    frist_dauer: str
    rechtliche_grundlage: str
    verbleibende_tage: int
    naechste_schritte: list[str]


def _get_easter_date(year: int) -> datetime.date:
    """Meeus/Jones/Butcher algorithm for Easter Sunday."""
    a = year % 19
    b = year // 100
    c = year % 100
    d = b // 4
    e = b % 4
    f = (b + 8) // 25
    g = (b - f + 1) // 3
    h = (19 * a + b - d - g + 15) % 30
    i = c // 4
    k = c % 4
    l = (32 + 2 * e + 2 * i - h - k) % 7
    m = (a + 11 * h + 22 * l) // 451
    month = (h + l - 7 * m + 114) // 31
    day = ((h + l - 7 * m + 114) % 31) + 1
    return datetime.date(year, month, day)


def _is_weekend_or_holiday(d: datetime.date) -> bool:
    """Check if a date falls on a weekend or nationwide German public holiday (§ 193 BGB)."""
    if d.weekday() >= 5:  # 5 = Saturday, 6 = Sunday
        return True

    # Fixed nationwide holidays
    fixed_holidays = [
        (1, 1),    # Neujahr
        (5, 1),    # Tag der Arbeit
        (10, 3),   # Tag der Deutschen Einheit
        (12, 25),  # 1. Weihnachtstag
        (12, 26),  # 2. Weihnachtstag
    ]
    if (d.month, d.day) in fixed_holidays:
        return True

    # Easter-dependent nationwide holidays
    easter = _get_easter_date(d.year)
    easter_holidays = [
        easter - datetime.timedelta(days=2),   # Karfreitag
        easter + datetime.timedelta(days=1),   # Ostermontag
        easter + datetime.timedelta(days=39),  # Christi Himmelfahrt
        easter + datetime.timedelta(days=50),  # Pfingstmontag
    ]
    if d in easter_holidays:
        return True

    return False


def _get_next_business_day(d: datetime.date) -> datetime.date:
    """Advance date to next business day if it falls on a weekend or public holiday (§ 193 BGB)."""
    while _is_weekend_or_holiday(d):
        d += datetime.timedelta(days=1)
    return d


def _add_months(sourcedate: datetime.date, months: int) -> datetime.date:
    """Add N months to a date, capping day at month-end if necessary."""
    month = sourcedate.month - 1 + months
    year = sourcedate.year + month // 12
    month = month % 12 + 1
    day = min(sourcedate.day, calendar.monthrange(year, month)[1])
    return datetime.date(year, month, day)


def _parse_date(date_str: str) -> datetime.date:
    """Parse ISO or German formatted date string."""
    s = date_str.strip()
    try:
        if "T" in s:
            return datetime.datetime.fromisoformat(s.replace("Z", "+00:00")).date()
        return datetime.date.fromisoformat(s)
    except ValueError:
        pass

    try:
        return datetime.datetime.strptime(s, "%d.%m.%Y").date()
    except ValueError:
        pass

    raise HTTPException(
        status_code=400,
        detail=f"Ungültiges Datumsformat '{date_str}'. Bitte ISO-Format (YYYY-MM-DD) verwenden.",
    )


DEADLINE_CONFIGS = {
    "widerspruch_verwaltungsakt": {
        "dauer": "1 Monat",
        "grundlage": "§ 70 VwGO",
        "type": "month",
        "value": 1,
        "schritte": [
            "Widerspruchsschreiben aufsetzen und unterzeichnen",
            "Begründung vorbereiten und gegebenenfalls Akteneinsicht beantragen",
            "Widerspruch fristgerecht bei der Behörde einreichen (Einschreiben oder EGVP)",
        ],
    },
    "klage_widerspruchsbescheid": {
        "dauer": "1 Monat",
        "grundlage": "§ 74 VwGO",
        "type": "month",
        "value": 1,
        "schritte": [
            "Klageschrift an das zuständige Verwaltungsgericht verfassen",
            "Widerspruchsbescheid und Ausgangsbescheid beifügen",
            "Klage beim Verwaltungsgericht einreichen",
        ],
    },
    "wiedereinsetzung": {
        "dauer": "2 Wochen",
        "grundlage": "§ 60 VwGO",
        "type": "week",
        "value": 2,
        "schritte": [
            "Grund für die unverschuldete Fristversäumnis dokumentieren (z. B. Ärztliches Attest)",
            "Versäumte Rechtshandlung (z. B. Widerspruch) unverzüglich nachholen",
            "Antrag auf Wiedereinsetzung in den vorigen Stand einreichen",
        ],
    },
    "untaetigkeitsklage": {
        "dauer": "3 Monate",
        "grundlage": "§ 75 VwGO",
        "type": "month",
        "value": 3,
        "schritte": [
            "Prüfen, ob ein zureichender Grund für die fehlende Entscheidung der Behörde vorliegt",
            "Sachstandsanfrage oder Erinnerung an die Behörde senden",
            "Untätigkeitsklage beim Verwaltungsgericht erheben",
        ],
    },
    "widerspruch_sozial": {
        "dauer": "1 Monat",
        "grundlage": "§ 84 SGG",
        "type": "month",
        "value": 1,
        "schritte": [
            "Widerspruch gegen den Sozialleistungsbescheid verfassen",
            "Nachweise und Begründung zusammenstellen",
            "Widerspruch beim zuständigen Leistungsträger (z. B. Jobcenter, Krankenkasse) einreichen",
        ],
    },
    "klage_sozial": {
        "dauer": "1 Monat",
        "grundlage": "§ 87 SGG",
        "type": "month",
        "value": 1,
        "schritte": [
            "Klage beim zuständigen Sozialgericht einreichen (gerichtsgebührenfrei)",
            "Widerspruchsbescheid beilegen",
            "Medizinische Befunde oder Einkommensnachweise als Beweismittel einreichen",
        ],
    },
    "widerspruch_steuer": {
        "dauer": "1 Monat",
        "grundlage": "§ 354 AO",
        "type": "month",
        "value": 1,
        "schritte": [
            "Einspruch gegen den Steuerbescheid beim Finanzamt einlegen",
            "Aussetzung der Vollziehung beantragen, falls Nachzahlung gefordert wird",
            "Einspruchsbegründung und Belege nachreichen",
        ],
    },
}


@app.post("/fristen", response_model=FristenResponse)
def fristen(payload: FristenRequest):
    dt_key = payload.deadline_type.lower().strip()
    art = payload.zustellungsart.lower().strip()

    # Map alias keys if needed
    if dt_key not in DEADLINE_CONFIGS:
        if "steuer" in dt_key:
            dt_key = "widerspruch_steuer"
        elif "sozial" in dt_key and "klage" in dt_key:
            dt_key = "klage_sozial"
        elif "sozial" in dt_key:
            dt_key = "widerspruch_sozial"
        elif "wiedereinsetzung" in dt_key:
            dt_key = "wiedereinsetzung"
        elif "untaetigkeit" in dt_key or "untätigkeit" in dt_key:
            dt_key = "untaetigkeitsklage"
        elif "klage" in dt_key:
            dt_key = "klage_widerspruchsbescheid"
        else:
            dt_key = "widerspruch_verwaltungsakt"

    cfg = DEADLINE_CONFIGS[dt_key]
    zustelldatum = _parse_date(payload.zustellungsdatum)

    # Delivery rule logic (§ 41 VwVfG / § 37 SGB X / § 122 AO)
    if art == "post":
        # 3-Tage-Fiktion: Bekanntgabe gilt am 3. Tag nach Aufgabe
        bekanntgabe_datum = zustelldatum + datetime.timedelta(days=3)
    else:
        # elektronisch oder persönlich: Bekanntgabe am gleichen Tag
        bekanntgabe_datum = zustelldatum

    # Calculate raw deadline end date according to BGB § 188 Abs. 2
    if cfg["type"] == "month":
        raw_ende = _add_months(bekanntgabe_datum, cfg["value"])
    elif cfg["type"] == "week":
        raw_ende = bekanntgabe_datum + datetime.timedelta(weeks=cfg["value"])
    else:
        raw_ende = _add_months(bekanntgabe_datum, 1)

    # Adjust for weekend or holiday (§ 193 BGB)
    final_ende = _get_next_business_day(raw_ende)

    today = datetime.date.today()
    verbleibend = (final_ende - today).days

    return FristenResponse(
        frist_ende=final_ende.isoformat(),
        frist_dauer=cfg["dauer"],
        rechtliche_grundlage=cfg["grundlage"],
        verbleibende_tage=verbleibend,
        naechste_schritte=cfg["schritte"],
    )


# ============================================================================
# 2. /behorden-finder Endpoint
# ============================================================================


class BehordenFinderRequest(BaseModel):
    kategorie: str = Field(
        ...,
        description="Kategorie, z.B. arbeitslosigkeit, wohngeld, auslaenderrecht, steuer, renten, gesundheit, bau, meldung, jugend, sozialleistungen, pass, gewerbe",
    )


class BehordenFinderResponse(BaseModel):
    behoerde: str
    zustaendigkeit: str
    kontakt_hinweis: str
    benoetigte_dokumente: list[str]
    rechtliche_grundlage: str


BEHOERDEN_DATA = {
    "arbeitslosigkeit": {
        "behoerde": "Agentur für Arbeit / Jobcenter",
        "zustaendigkeit": "Arbeitslosengeld I (Agentur für Arbeit) und Bürgergeld / Grundsicherung für Arbeitsuchende (Jobcenter)",
        "kontakt_hinweis": "Online-Portal der Bundesagentur für Arbeit nutzen, telefonisch über die Service-Hotline oder persönlich nach Terminvereinbarung.",
        "benoetigte_dokumente": [
            "Personalausweis oder Reisepass mit Meldebescheinigung",
            "Sozialversicherungsausweis",
            "Kündigungsschreiben bzw. Arbeitsvertrag",
            "Lückenloser Lebenslauf",
            "Kontoauszüge der letzten 3 Monate (bei Bürgergeld)",
        ],
        "rechtliche_grundlage": "SGB III (Arbeitsförderung) & SGB II (Bürgergeld)",
    },
    "wohngeld": {
        "behoerde": "Wohngeldbehörde / Wohngeldamt",
        "zustaendigkeit": "Bewilligung von Mietzuschuss für Mieter oder Lastenzuschuss für Eigentümer von selbstgenutztem Wohnraum",
        "kontakt_hinweis": "Schriftlicher Antrag bei der örtlichen Stadt- oder Gemeindeverwaltung oder online über das Bürgerservice-Portal.",
        "benoetigte_dokumente": [
            "Ausgefüllter Wohngeldantrag",
            "Mietvertrag und aktuelle Mietänderungsschreiben",
            "Mietzahlungsnachweise der letzten 3 Monate",
            "Einkommensnachweise aller Haushaltsmitglieder",
            "Personalausweis",
        ],
        "rechtliche_grundlage": "Wohngeldgesetz (WoGG)",
    },
    "auslaenderrecht": {
        "behoerde": "Ausländerbehörde / Landesamt für Einwanderung",
        "zustaendigkeit": "Erteilung und Verlängerung von Aufenthaltstiteln, Visa, Niederlassungserlaubnis, Arbeitserlaubnis und Einbürgerung",
        "kontakt_hinweis": "Online-Terminbuchung über die Website der zuständigen Ausländerbehörde an Ihrem Wohnort.",
        "benoetigte_dokumente": [
            "Gültiger Pass / Passersatz",
            "Aktuelles biometrisches Passfoto",
            "Mietvertrag und Wohngeberbestätigung",
            "Einkommens- / Beschäftigungsnachweis",
            "Nachweis über Krankenversicherungsschutz",
        ],
        "rechtliche_grundlage": "Aufenthaltsgesetz (AufenthG)",
    },
    "steuer": {
        "behoerde": "Finanzamt",
        "zustaendigkeit": "Festsetzung und Erhebung von Einkommensteuer, Umsatzsteuer, Gewerbesteuer sowie Vergabe der Steuer-ID",
        "kontakt_hinweis": "Elektronisch über ELSTER (www.elster.de) oder schriftlich per Post an das Wohnsitzfinanzamt.",
        "benoetigte_dokumente": [
            "Steueridentifikationsnummer",
            "Lohnsteuerbescheinigung",
            "Nachweise über Werbungskosten, Sonderausgaben und außergewöhnliche Belastungen",
            "Handwerker- und Haushaltshilfenrechnungen",
            "Spendenbescheinigungen",
        ],
        "rechtliche_grundlage": "Abgabenordnung (AO) & Einkommensteuergesetz (EStG)",
    },
    "renten": {
        "behoerde": "Deutsche Rentenversicherung (DRV)",
        "zustaendigkeit": "Altersrente, Erwerbsminderungsrente, Hinterbliebenenrente und medizinische/berufliche Rehabilitation",
        "kontakt_hinweis": "Online-Dienste der DRV nutzen, kostenlose Service-Hotline (0800 1000 4800) anrufen oder Auskunfts- und Beratungsstelle aufsuchen.",
        "benoetigte_dokumente": [
            "Rentenversicherungsnummer",
            "Personalausweis oder Pass",
            "Lückenloser Versicherungsverlauf",
            "Geburtsurkunden der Kinder (für Kindererziehungszeiten)",
            "Nachweise über Ausbildungs- und Studienzeiten",
        ],
        "rechtliche_grundlage": "SGB VI (Gesetzliche Rentenversicherung)",
    },
    "gesundheit": {
        "behoerde": "Gesundheitsamt / Krankenkasse",
        "zustaendigkeit": "Gesundheitsschutz, Infektionsschutz, amtsärztliche Gutachten sowie gesetzliche Krankenversicherung",
        "kontakt_hinweis": "Direktkontakt beim Gesundheitsamt des Landkreises / der kreisfreien Stadt bzw. der Geschäftsstelle Ihrer Krankenkasse.",
        "benoetigte_dokumente": [
            "Elektronische Gesundheitskarte (eGK)",
            "Personalausweis",
            "Ärztliche Atteste oder Befundberichte",
            "Impfpass",
        ],
        "rechtliche_grundlage": "SGB V (Krankenversicherung) & Infektionsschutzgesetz (IfSG)",
    },
    "bau": {
        "behoerde": "Bauordnungsamt / Untere Baurechtsbehörde",
        "zustaendigkeit": "Baugenehmigungen, Nutzungsänderungen, Denkmalschutz und bauordnungsrechtliche Prüfungen",
        "kontakt_hinweis": "Schriftlicher Bauantrag über einen bauvorlageberechtigten Entwurfsverfasser (Architekt/Ingenieur) einreichen.",
        "benoetigte_dokumente": [
            "Bauantragsformular",
            "Lageplan und Flurkarte",
            "Bauzeichnungen und Baubeschreibung",
            "Statischer Nachweis",
            "Entwässerungsplan",
        ],
        "rechtliche_grundlage": "Landesbauordnung (LBO) & Baugesetzbuch (BauGB)",
    },
    "meldung": {
        "behoerde": "Bürgeramt / Einwohnermeldeamt",
        "zustaendigkeit": "An-, Um- und Abmeldung des Wohnsitzes, Meldebescheinigungen, Führungszeugnisse",
        "kontakt_hinweis": "Persönliche Vorsprache im Bürgeramt nach vorheriger Online- oder telefonischer Terminvereinbarung.",
        "benoetigte_dokumente": [
            "Personalausweis oder Reisepass",
            "Wohngeberbestätigung des Vermieters",
            "Ausgefülltes Anmeldeformular",
            "Geburts- oder Heiratsurkunde (bei Erstanmeldung)",
        ],
        "rechtliche_grundlage": "Bundesmeldegesetz (BMG)",
    },
    "jugend": {
        "behoerde": "Jugendamt",
        "zustaendigkeit": "Kinder- und Jugendhilfe, Unterhaltsvorschuss, Beistandschaften, Kita-Gutscheine, Elterngeld",
        "kontakt_hinweis": "Direktkontakt beim Jugendamt der zuständigen Stadt- oder Kreisverwaltung.",
        "benoetigte_dokumente": [
            "Geburtsurkunde des Kindes",
            "Personalausweis der Erziehungsberechtigten",
            "Vaterschaftsanerkennung / Sorgeerklärung",
            "Einkommensnachweise (für Unterhaltsvorschuss oder Kita-Beiträge)",
        ],
        "rechtliche_grundlage": "SGB VIII (Kinder- und Jugendhilfe) & Unterhaltsvorschussgesetz (UVG)",
    },
    "sozialleistungen": {
        "behoerde": "Sozialamt",
        "zustaendigkeit": "Grundsicherung im Alter und bei Erwerbsminderung, Hilfe zum Lebensunterhalt, Hilfe zur Pflege, Eingliederungshilfe",
        "kontakt_hinweis": "Schriftlicher Antrag beim Sozialamt der Stadt- oder Kreisverwaltung.",
        "benoetigte_dokumente": [
            "Personalausweis",
            "Einkommens- und Vermögensnachweise",
            "Kontoauszüge der letzten 3 Monate",
            "Mietvertrag und aktuelle Heizkostenabrechnung",
            "Schwerbehindertenausweis / Pflegegradbescheid (falls vorhanden)",
        ],
        "rechtliche_grundlage": "SGB XII (Sozialhilfe)",
    },
    "pass": {
        "behoerde": "Bürgeramt / Passamt",
        "zustaendigkeit": "Ausstellung von Personalausweisen, Reisepässen und vorläufigen Ausweisdokumenten",
        "kontakt_hinweis": "Persönliches Erscheinen im Bürgeramt nach vorheriger Terminvereinbarung zwingend erforderlich.",
        "benoetigte_dokumente": [
            "Bisheriger Personalausweis oder Reisepass",
            "Aktuelles biometrisches Passfoto",
            "Geburts- oder Eheurkunde im Original",
            "Gebühr (Bar oder EC-Karte)",
        ],
        "rechtliche_grundlage": "Personalausweisgesetz (PAuswG) & Passgesetz (PassG)",
    },
    "gewerbe": {
        "behoerde": "Gewerbeamt / Ordnungsamt",
        "zustaendigkeit": "Gewerbeanmeldung, Gewerbeummeldung, Gewerbeabmeldung und Erteilung gewerblicher Erlaubnisse",
        "kontakt_hinweis": "Online-Gewerbeanmeldung über das Gewerbeportal des Bundeslandes oder persönlich beim Gewerbeamt.",
        "benoetigte_dokumente": [
            "Personalausweis oder Reisepass mit Meldebescheinigung",
            "Ausgefülltes Formular zur Gewerbeanmeldung",
            "Handelsregisterauszug (falls im HR eingetragen)",
            "Ggf. Qualifikationsnachweise / Erlaubnisse (z. B. Meisterbrief, Konzession)",
        ],
        "rechtliche_grundlage": "Gewerbeordnung (GewO)",
    },
}


@app.post("/behorden-finder", response_model=BehordenFinderResponse)
def behorden_finder(payload: BehordenFinderRequest):
    kat = payload.kategorie.lower().strip()

    # Normalization mapping for common variations
    category_map = {
        "arbeitslos": "arbeitslosigkeit",
        "jobcenter": "arbeitslosigkeit",
        "wohnen": "wohngeld",
        "ausländer": "auslaenderrecht",
        "auslaender": "auslaenderrecht",
        "finanzamt": "steuer",
        "steuern": "steuer",
        "rente": "renten",
        "krankenkasse": "gesundheit",
        "bauen": "bau",
        "baurecht": "bau",
        "anmeldung": "meldung",
        "ummeldung": "meldung",
        "einwohner": "meldung",
        "kinder": "jugend",
        "elterngeld": "jugend",
        "sozialamt": "sozialleistungen",
        "sozial": "sozialleistungen",
        "personalausweis": "pass",
        "reisepass": "pass",
        "gewerbeschein": "gewerbe",
    }

    matched_key = category_map.get(kat, kat)

    if matched_key in BEHOERDEN_DATA:
        data = BEHOERDEN_DATA[matched_key]
    else:
        # Fallback for unmatched categories
        data = {
            "behoerde": "Bürgeramt / Kommunalverwaltung",
            "zustaendigkeit": f"Allgemeine Bürgerdienste und Weiterleitung für die Kategorie '{payload.kategorie}'",
            "kontakt_hinweis": "Behördenrufnummer 115 anrufen oder beim örtlichen Bürgerbüro nachfragen.",
            "benoetigte_dokumente": [
                "Personalausweis oder Reisepass",
                "Relevante Unterlagen, Anträge oder Bescheide",
            ],
            "rechtliche_grundlage": "Verwaltungsverfahrensgesetz (VwVfG)",
        }

    return BehordenFinderResponse(**data)


# ============================================================================
# 3. /kostenrechner Endpoint
# ============================================================================


class KostenrechnerRequest(BaseModel):
    verfahrensart: str = Field(
        ...,
        description="Verfahrensart: 'verwaltungsgericht', 'sozialgericht', 'zivilgericht'",
    )
    streitwert: float = Field(..., description="Streitwert in Euro")


class KostenrechnerResponse(BaseModel):
    gerichtskosten: float
    anwaltskosten: float
    gesamtkosten: float
    aufschluesselung: dict[str, Any]
    hinweis_verfahrenskostenhilfe: str


def _calculate_rvg_base_fee(sw: float) -> float:
    """Calculate 1.0 base fee according to RVG fee schedule."""
    if sw <= 0:
        sw = 500.0

    brackets = [
        (500, 49.0),
        (1000, 88.0),
        (1500, 127.0),
        (2000, 166.0),
        (3000, 222.0),
        (4000, 278.0),
        (5000, 334.0),
        (6000, 371.0),
        (7000, 408.0),
        (8000, 445.0),
        (9000, 482.0),
        (10000, 519.0),
        (15000, 626.0),
        (20000, 733.0),
        (25000, 840.0),
        (30000, 947.0),
        (35000, 1003.0),
        (40000, 1059.0),
        (45000, 1115.0),
        (50000, 1173.0),
    ]
    for limit, fee in brackets:
        if sw <= limit:
            return fee

    extra_brackets = int((sw - 50000 - 1) // 10000) + 1
    return 1173.0 + max(0, extra_brackets) * 37.0


def _calculate_gkg_base_fee(sw: float) -> float:
    """Calculate 1.0 base fee according to GKG fee schedule."""
    if sw <= 0:
        sw = 500.0

    brackets = [
        (500, 38.0),
        (1000, 58.0),
        (1500, 78.0),
        (2000, 98.0),
        (3000, 119.0),
        (4000, 140.0),
        (5000, 161.0),
        (6000, 182.0),
        (7000, 203.0),
        (8000, 224.0),
        (9000, 245.0),
        (10000, 266.0),
        (15000, 324.0),
        (20000, 382.0),
        (25000, 440.0),
        (30000, 498.0),
        (35000, 538.0),
        (40000, 578.0),
        (45000, 618.0),
        (50000, 658.0),
    ]
    for limit, fee in brackets:
        if sw <= limit:
            return fee

    extra_brackets = int((sw - 50000 - 1) // 10000) + 1
    return 658.0 + max(0, extra_brackets) * 33.0


@app.post("/kostenrechner", response_model=KostenrechnerResponse)
def kostenrechner(payload: KostenrechnerRequest):
    art = payload.verfahrensart.lower().strip()
    sw = max(0.0, payload.streitwert)

    rvg_1_0 = _calculate_rvg_base_fee(sw)
    verfahrensgebuehr = 1.3 * rvg_1_0
    terminsgebuehr = 1.2 * rvg_1_0
    auslagen = min(20.0, 0.20 * (verfahrensgebuehr + terminsgebuehr))
    netto_anwalt = verfahrensgebuehr + terminsgebuehr + auslagen
    ust = 0.19 * netto_anwalt
    anwaltskosten = round(netto_anwalt + ust, 2)

    if art == "sozialgericht":
        gerichtskosten = 0.0
        gesamtkosten = anwaltskosten
        aufschluesselung = {
            "gerichtskosten": 0.0,
            "gerichtskosten_hinweis": "Gerichtskostenfrei für Versicherte und Leistungsempfänger gem. § 183 SGG",
            "anwalts_verfahrensgebuehr_1_3": round(verfahrensgebuehr, 2),
            "anwalts_terminsgebuehr_1_2": round(terminsgebuehr, 2),
            "auslagenpauschale": round(auslagen, 2),
            "umsatzsteuer_19_prozent": round(ust, 2),
            "anwaltskosten_gesamt": anwaltskosten,
            "prozesskostenrisiko": "Vor den Sozialgerichten besteht in der I. Instanz kein Anwaltszwang.",
        }
        hinweis_pkh = (
            "Im Sozialgerichtsverfahren können Sie bei geringem Einkommen und Vermögen "
            "Prozesskostenhilfe (PKH) beantragen. Bei Bewilligung übernimmt die Staatskasse "
            "die eigenen Anwaltskosten."
        )

    elif art == "verwaltungsgericht":
        gkg_1_0 = _calculate_gkg_base_fee(sw)
        gerichtskosten = round(3.0 * gkg_1_0, 2)
        gesamtkosten = round(gerichtskosten + anwaltskosten, 2)
        aufschluesselung = {
            "gerichtskosten_3_0_gebuehr": gerichtskosten,
            "anwalts_verfahrensgebuehr_1_3": round(verfahrensgebuehr, 2),
            "anwalts_terminsgebuehr_1_2": round(terminsgebuehr, 2),
            "auslagenpauschale": round(auslagen, 2),
            "umsatzsteuer_19_prozent": round(ust, 2),
            "anwaltskosten_gesamt": anwaltskosten,
            "prozesskostenrisiko": "Bei vollständigem Unterliegen müssen auch die gegnerischen Anwaltskosten getragen werden.",
        }
        hinweis_pkh = (
            "Bei Hilfebedürftigkeit und hinreichender Aussicht auf Erfolg kann Prozesskostenhilfe "
            "(PKH) nach § 166 VwGO i.V.m. § 114 ZPO beantragt werden."
        )

    else:  # zivilgericht or default
        gkg_1_0 = _calculate_gkg_base_fee(sw)
        gerichtskosten = round(3.0 * gkg_1_0, 2)
        gesamtkosten = round(gerichtskosten + anwaltskosten, 2)
        aufschluesselung = {
            "gerichtskosten_3_0_gebuehr": gerichtskosten,
            "anwalts_verfahrensgebuehr_1_3": round(verfahrensgebuehr, 2),
            "anwalts_terminsgebuehr_1_2": round(terminsgebuehr, 2),
            "auslagenpauschale": round(auslagen, 2),
            "umsatzsteuer_19_prozent": round(ust, 2),
            "anwaltskosten_gesamt": anwaltskosten,
            "prozesskostenrisiko": "Im Zivilprozess trägt die unterliegende Partei die gesamten Kosten des Rechtsstreits (§ 91 ZPO).",
        }
        hinweis_pkh = (
            "Wenn Sie die Kosten nach Ihren persönlichen und wirtschaftlichen Verhältnissen "
            "nicht aufbringen können, besteht Anspruch auf Prozesskostenhilfe (§ 114 ZPO)."
        )

    return KostenrechnerResponse(
        gerichtskosten=gerichtskosten,
        anwaltskosten=anwaltskosten,
        gesamtkosten=gesamtkosten,
        aufschluesselung=aufschluesselung,
        hinweis_verfahrenskostenhilfe=hinweis_pkh,
    )


# ============================================================================
# 4. /mietrechts-check Endpoint
# ============================================================================


class MietrechtsCheckRequest(BaseModel):
    thema: str = Field(
        ...,
        description="Thema im Mietrecht, z.B. mieterhoehung, kaution, schoenheitsreparaturen, eigenbedarf, maengel, energetische_sanierung, nebenkosten",
    )


class MietrechtsCheckResponse(BaseModel):
    frage: str
    rechtliche_grundlage: str
    pruefpunkte: list[str]
    handlungsempfehlung: str
    confidence: Literal["high", "medium", "low"]


MIETRECHT_DATA = {
    "mieterhoehung": {
        "frage": "Ist die Mieterhöhung bis zur Ortsüblichkeit oder nach Modernisierung rechtlich zulässig?",
        "rechtliche_grundlage": "§ 558 BGB (Ortsübliche Vergleichsmiete) / § 559 BGB (Modernisierung)",
        "pruefpunkte": [
            "Kappungsgrenze eingehalten? (Maximal 15-20% Erhöhung in 3 Jahren je nach Bundesland/Gemeinde)",
            "Sperrfrist beachtet? (Frühestens 12 Monate nach der letzten Mieterhöhung ankündigen)",
            "Begründung vorhanden? (Qualifizierter Mietspiegel, 3 Vergleichswohnungen oder Gutachten)",
            "Form- und Textform gewahrt (§ 558a BGB)?",
            "Überlegungsfrist des Mieters eingehalten? (Zustimmung bis zum Ablauf des 2. Kalendermonats nach Zugang gefordert)",
        ],
        "handlungsempfehlung": "Formelle Wirksamkeit und Begründung prüfen. Bei unberechtigter Erhöhung die Zustimmung innerhalb der Überlegungsfrist schriftlich verweigern oder nur in berechtigter Höhe zustimmen.",
        "confidence": "high",
    },
    "kaution": {
        "frage": "Welche Regeln gelten für die Höhe, Anlage und Rückzahlung der Mietkaution?",
        "rechtliche_grundlage": "§ 551 BGB (Begrenzung und Anlage von Mietsicherheiten)",
        "pruefpunkte": [
            "Höhe maximal 3 Nettokaltmieten (§ 551 Abs. 1 BGB)",
            "Recht zur Ratenzahlung in 3 gleichen monatlichen Teilzahlungen (§ 551 Abs. 2 BGB)",
            "Getrennte, verzinsliche Anlage durch den Vermieter zum üblichen Zinssatz für Spareinlagen (Insolvenzschutz)",
            "Rückzahlungsfrist: Angemessene Überlegungs- und Prüfungsfrist des Vermieters (i.d.R. 3 bis 6 Monate nach Auszug)",
            "Einbehalt nur für konkrete, noch offene Ansprüche (z. B. Nachforderung aus Nebenkostenabrechnung)",
        ],
        "handlungsempfehlung": "Kaution zu Beginn in 3 Raten zahlen. Nach Auszug und mängelfreier Wohnungsübergabe den Vermieter nach Ablauf der Prüfungsfrist (3-6 Monate) schriftlich zur Abrechnung und Auszahlung auffordern.",
        "confidence": "high",
    },
    "schoenheitsreparaturen": {
        "frage": "Sind die Klauseln zu Schönheitsreparaturen im Mietvertrag wirksam?",
        "rechtliche_grundlage": "§ 535 Abs. 1 BGB, BGH-Rechtsprechung zu AGB-Klauseln (§ 307 BGB)",
        "pruefpunkte": [
            "Wurde die Wohnung unrenoviert oder renoviert übergeben?",
            "Enthält der Vertrag starre Fristenpläne (z. B. 'Küche zwingend alle 3 Jahre streichen')? -> Unwirksam!",
            "Enthält der Vertrag eine Endrenovierungsklausel unabhängig vom Zustand? -> Unwirksam!",
            "Gibt es eine Quotenklausel für anteilige Kostenübernahme? -> Nach BGH-Rechtsprechung unwirksam!",
            "Bei Unwirksamkeit der Klausel obliegt die Instandhaltung komplett dem Vermieter (§ 535 BGB).",
        ],
        "handlungsempfehlung": "Mietvertragsklauseln genau prüfen. Starre Fristen oder Renovierungspflichten bei unrenoviert übernommenen Wohnungen ohne angemessenen Ausgleich machen die Klausel unwirksam — Sie müssen beim Auszug nicht renovieren.",
        "confidence": "high",
    },
    "eigenbedarf": {
        "frage": "Liegt ein berechtigtes Interesse des Vermieters an der Eigenbedarfskündigung vor?",
        "rechtliche_grundlage": "§ 573 Abs. 2 Nr. 2 BGB (Eigenbedarf) & § 574 BGB (Sozialklausel)",
        "pruefpunkte": [
            "Konkrete Benennung der Person, für die die Wohnung benötigt wird (Familienangehörige oder Haushaltsangehörige)",
            "Nachvollziehbare und vernünftige Gründe für den Bedarf im Kündigungsschreiben dargelegt",
            "Kein vorgetäuschter oder rechtsmissbräuchlicher Eigenbedarf",
            "Widerspruchsfrist nach der Sozialklausel (§ 574 BGB) beachten (spätestens 2 Monate vor Ablauf der Kündigungsfrist)",
            "Härtegründe prüfen (z. B. hohes Alter, schwere Krankheit, lange Wohndauer, fehlender Ersatzwohnraum)",
        ],
        "handlungsempfehlung": "Begründung im Kündigungsschreiben sorgfältig prüfen. Bei Unwirksamkeit oder unzumutbarer Härte zeitnah (spätestens 2 Monate vor Kündigungsende) schriftlich Widerspruch einlegen.",
        "confidence": "high",
    },
    "maengel": {
        "frage": "Welche Rechte (Mietminderung, Mängelbeseitigung) bestehen bei Mängeln der Mietsache?",
        "rechtliche_grundlage": "§ 536 BGB (Mietminderung), § 536a BGB (Schadensersatz / Selbstbeseitigung)",
        "pruefpunkte": [
            "Mängelanzeige unverzüglich an den Vermieter übermittelt (§ 536c BGB)",
            "Erhebliche Beeinträchtigung der Tauglichkeit der Wohnung zum vertragsgemäßen Gebrauch",
            "Mietminderung tritt kraft Gesetzes ab Zugang der Mängelanzeige ein",
            "Mietzahlung unter Vorbehalt erklären, um Rückforderungsansprüche zu sichern",
            "Angemessene Frist zur Mängelbeseitigung vor einer Selbstbeseitigung oder Ersatzvornahme setzen",
        ],
        "handlungsempfehlung": "Mangel umgehend schriftlich anzeigen, Fotos/Gedächtnisprotokoll anfertigen, angemessene Frist zur Beseitigung setzen und Mietzahlung schriftlich unter Vorbehalt erklären.",
        "confidence": "high",
    },
    "energetische_sanierung": {
        "frage": "Muss der Mieter eine energetische Sanierung dulden und darf die Miete gemindert werden?",
        "rechtliche_grundlage": "§ 555b BGB (Energetische Modernisierung), § 536 Abs. 1a BGB, § 559 BGB",
        "pruefpunkte": [
            "Ankündigungsfrist eingehalten? (Spätestens 3 Monate vor Beginn in Textform anzukündigen)",
            "Ankündigung enthält Angaben zu Art, Umfang, Beginn, Dauer und voraussichtlicher Mieterhöhung",
            "Ausschluss des Minderungsrechts für die ersten 3 Monate bei energetischer Sanierung (§ 536 Abs. 1a BGB)",
            "Härtefalleinwand prüfen wegen der Umstände der Baumaßnahme oder künftigen Miete (§ 555d BGB)",
            "Modernisierungsumlage gekappt auf max. 8% der Kosten p.a. und max. 2-3 €/m² innerhalb von 6 Jahren",
        ],
        "handlungsempfehlung": "Ankündigungsschreiben auf Einhaltung der 3-Monats-Frist und Vollständigkeit prüfen. Bei finanzieller Härte innerhalb von 1 Monat nach Zugang schriftlich Härtefall geltend machen.",
        "confidence": "high",
    },
    "nebenkosten": {
        "frage": "Ist die Betriebskostenabrechnung formell und materiell ordnungsgemäß?",
        "rechtliche_grundlage": "§ 556 BGB (Vereinbarung über Betriebskosten), Betriebskostenverordnung (BetrKV)",
        "pruefpunkte": [
            "Abrechnungsfrist eingehalten? (Innerhalb von 12 Monaten nach Ende des Abrechnungszeitraums zugestellt)",
            "Ausdrückliche Vereinbarung im Mietvertrag zur Umlage der Betriebskosten vorhanden",
            "Umlageschlüssel nachvollziehbar und korrekt angewendet",
            "Nur umlagefähige Betriebskosten gem. BetrKV enthalten (keine Instandhaltungs- oder Verwaltungskosten)",
            "Einwendungsfrist von 12 Monaten nach Zugang der Abrechnung beachten (§ 556 Abs. 3 BGB)",
        ],
        "handlungsempfehlung": "Abrechnungsfrist prüfen (nach 12 Monaten sind Nachforderungen des Vermieters ausgeschlossen). Belege einsehen bzw. Kopien anfordern und Einwendungen schriftlich erheben.",
        "confidence": "high",
    },
}


@app.post("/mietrechts-check", response_model=MietrechtsCheckResponse)
def mietrechts_check(payload: MietrechtsCheckRequest):
    thema_raw = payload.thema.lower().strip()

    # Normalization map for topic aliases
    topic_map = {
        "mieterhöhung": "mieterhoehung",
        "mieterhoehung": "mieterhoehung",
        "erhöhung": "mieterhoehung",
        "kaution": "kaution",
        "mietkaution": "kaution",
        "schönheitsreparaturen": "schoenheitsreparaturen",
        "schoenheitsreparaturen": "schoenheitsreparaturen",
        "renovierung": "schoenheitsreparaturen",
        "eigenbedarf": "eigenbedarf",
        "kündigung": "eigenbedarf",
        "mängel": "maengel",
        "maengel": "maengel",
        "mangel": "maengel",
        "mietminderung": "maengel",
        "energetische_sanierung": "energetische_sanierung",
        "sanierung": "energetische_sanierung",
        "modernisierung": "energetische_sanierung",
        "nebenkosten": "nebenkosten",
        "betriebskosten": "nebenkosten",
        "nebenkostenabrechnung": "nebenkosten",
    }

    matched_topic = topic_map.get(thema_raw, thema_raw)

    if matched_topic in MIETRECHT_DATA:
        data = MIETRECHT_DATA[matched_topic]
        return MietrechtsCheckResponse(**data)

    # Fallback for general or unrecognized topic
    return MietrechtsCheckResponse(
        frage=f"Rechtliche Einschätzung zum Mietrechtsthema '{payload.thema}'",
        rechtliche_grundlage="Bürgerliches Gesetzbuch (BGB) - Mietrecht (§§ 535 ff. BGB)",
        pruefpunkte=[
            "Prüfung der vertraglichen Vereinbarungen im Mietvertrag",
            "Prüfung gesetzlicher Fristen und Formvorschriften",
            "Gegenüberstellung der Pflichten von Mieter und Vermieter gem. § 535 BGB",
        ],
        handlungsempfehlung="Prüfen Sie Ihren Mietvertrag und schriftliche Korrespondenz. Bei Unklarheiten empfiehlt sich eine Beratung durch den örtlichen Mieterverein oder einen Fachanwalt für Mietrecht.",
        confidence="medium",
    )
