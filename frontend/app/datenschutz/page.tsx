"use client";

import Link from "next/link";
import {
  ShieldCheck,
  ArrowLeft,
  Lock,
  UserCheck,
  FileText,
  Cookie,
  Mail,
  Scale,
  Building,
  AlertCircle,
  Clock,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar />

      <div className="lg:pl-60">
        <div className="mx-auto max-w-5xl px-6 py-10 sm:px-10">
          {/* Topbar / Navigation Header */}
          <div className="mb-8 flex items-center justify-between border-b border-border/60 pb-5">
            <div>
              <Link
                href="/"
                className="mb-2 inline-flex items-center gap-1.5 font-mono text-xs text-ink/60 transition-colors hover:text-seal"
              >
                <ArrowLeft size={14} />
                Zurück zum Dashboard
              </Link>
              <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                Datenschutzerklärung
              </h1>
              <p className="mt-1 text-sm text-ink/65">
                Informationen über die Verarbeitung Ihrer personenbezogenen
                Daten gemäß DSGVO bei CivicAI
              </p>
            </div>
            <div className="hidden sm:flex sm:items-center sm:gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-signal-green-light px-3 py-1 font-mono text-xs font-medium text-signal-green">
                <ShieldCheck size={14} />
                DSGVO-Konform
              </span>
            </div>
          </div>

          {/* Quick Summary Banner */}
          <div className="mb-10 rounded-xl border border-border bg-surface p-6 shadow-card">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-seal-light text-seal">
                  <Lock size={20} />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-ink">
                    Unsere Datenschutz-Garantie
                  </h2>
                  <p className="text-xs leading-relaxed text-ink/65">
                    CivicAI verarbeitet Ihre Daten ausschließlich in europäischen
                    Rechenzentren. Hochgeladene Behördenschreiben werden streng
                    vertraulich behandelt und niemals ohne Ihre explizite
                    Zustimmung für das Training von KI-Modellen verwendet.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Table of Contents / Overview Pills */}
          <div className="mb-10 rounded-xl border border-border bg-surface/50 p-4">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-wide text-ink/50">
              Inhaltsübersicht
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                { label: "01 · Verantwortlicher", href: "#sec-1" },
                { label: "02 · Datenerhebung", href: "#sec-2" },
                { label: "03 · Zwecke", href: "#sec-3" },
                { label: "04 · Rechtsgrundlagen", href: "#sec-4" },
                { label: "05 · Speicherdauer", href: "#sec-5" },
                { label: "06 · Ihre Rechte", href: "#sec-6" },
                { label: "07 · Cookies", href: "#sec-7" },
                { label: "08 · Datenschutzbeauftragter", href: "#sec-8" },
                { label: "09 · Beschwerderecht", href: "#sec-9" },
                { label: "10 · Verschlüsselung", href: "#sec-10" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-md border border-border bg-surface px-2.5 py-1 text-ink/70 hover:border-seal hover:text-seal"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Main Sections List */}
          <div className="space-y-8">
            {/* 01 · Verantwortlicher */}
            <section
              id="sec-1"
              className="scroll-mt-6 rounded-xl border border-border bg-surface p-6 shadow-card"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wide text-seal">
                  01 · Verantwortlicher
                </span>
                <Building size={18} className="text-seal/60" />
              </div>
              <h2 className="mb-3 text-xl font-bold text-ink">
                Wer ist für die Datenverarbeitung verantwortlich?
              </h2>
              <div className="text-sm leading-relaxed text-ink/75 space-y-3">
                <p>
                  Verantwortlicher im Sinne der Datenschutz-Grundverordnung
                  (DSGVO) und sonstiger nationaler Datenschutzgesetze der
                  Mitgliedsstaaten sowie sonstiger datenschutzrechtlicher
                  Bestimmungen ist:
                </p>
                <div className="rounded-lg bg-canvas p-4 text-xs font-mono border border-border/80 leading-relaxed text-ink">
                  <p className="font-bold text-sm text-seal font-body mb-1">
                    CivicAI gGmbH
                  </p>
                  <p>Plattform für digitale Bürgerrechte & Verwaltungstransparenz</p>
                  <p>Musterstraße 42, 10117 Berlin</p>
                  <p>Deutschland</p>
                  <p className="mt-2">E-Mail: datenschutz@civicai.de</p>
                  <p>Telefon: +49 (0) 30 123456-0</p>
                  <p>Website: https://civicai.de</p>
                </div>
              </div>
            </section>

            {/* 02 · Erhebung und Speicherung personenbezogener Daten */}
            <section
              id="sec-2"
              className="scroll-mt-6 rounded-xl border border-border bg-surface p-6 shadow-card"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wide text-seal">
                  02 · Erhebung & Speicherung
                </span>
                <FileText size={18} className="text-seal/60" />
              </div>
              <h2 className="mb-3 text-xl font-bold text-ink">
                Erhebung und Speicherung personenbezogener Daten
              </h2>
              <div className="text-sm leading-relaxed text-ink/75 space-y-3">
                <p>
                  Beim Aufrufen und Nutzen der Plattform CivicAI verarbeiten wir
                  personenbezogene Daten in folgenden Kategorien:
                </p>
                <ul className="list-disc space-y-2 pl-5 text-xs text-ink/80">
                  <li>
                    <strong className="text-ink">Server-Logfiles & Nutzungsdaten:</strong>{" "}
                    Beim Aufruf unserer Website sendet Ihr Browser automatisch
                    Informationen an unseren Server (IP-Adresse, Datum/Uhrzeit
                    des Zugriffs, Name der abgerufenen Datei, übertragenes
                    Datenvolumen, Browser-Typ und -Version, Betriebssystem).
                  </li>
                  <li>
                    <strong className="text-ink">Hochgeladene Dokumente & Freitexte:</strong>{" "}
                    Wenn Sie Behördenschreiben, Bescheide oder Fristdaten in den
                    Rechte-Coach oder Fristen-Rechner eingeben, werden diese
                    Inhalte zur Analyse verarbeitet.
                  </li>
                  <li>
                    <strong className="text-ink">Kontaktdaten:</strong> Bei Anfragen
                    über unser Kontaktformular oder per E-Mail speichern wir Ihre
                    E-Mail-Adresse sowie Ihre eingegebenen Daten zur Bearbeitung.
                  </li>
                </ul>
              </div>
            </section>

            {/* 03 · Zwecke der Datenverarbeitung */}
            <section
              id="sec-3"
              className="scroll-mt-6 rounded-xl border border-border bg-surface p-6 shadow-card"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wide text-seal">
                  03 · Verarbeitungszwecke
                </span>
                <UserCheck size={18} className="text-seal/60" />
              </div>
              <h2 className="mb-3 text-xl font-bold text-ink">
                Wofür verarbeiten wir Ihre Daten?
              </h2>
              <div className="text-sm leading-relaxed text-ink/75 space-y-3">
                <p>
                  Die Verarbeitung personenbezogener Daten erfolgt ausschließlich zu
                  folgenden Zwecken:
                </p>
                <div className="grid gap-3 sm:grid-cols-2 mt-2">
                  <div className="rounded-lg border border-border bg-canvas/60 p-3">
                    <p className="font-semibold text-xs text-ink mb-1">
                      1. Dokumentenanalyse & Übersetzung
                    </p>
                    <p className="text-xs text-ink/65">
                      Einordnung von Behördenbriefen, Ermittlung von Fristen und
                      Erklärung von Fachbegriffen in verständlicher Sprache.
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-canvas/60 p-3">
                    <p className="font-semibold text-xs text-ink mb-1">
                      2. Fristenberechnung & Erinnerung
                    </p>
                    <p className="text-xs text-ink/65">
                      Berechnung von Widerspruchs- und Klagefristen gemäß gesetzlicher
                      Vorgaben (§ 193 BGB) für Ihren persönlichen Überblick.
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-canvas/60 p-3">
                    <p className="font-semibold text-xs text-ink mb-1">
                      3. IT-Sicherheit & Systemstabilität
                    </p>
                    <p className="text-xs text-ink/65">
                      Gewährleistung eines reibungslosen Verbindungsaufbaus, Abwehr
                      von Cyberangriffen und Optimierung der Plattform.
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-canvas/60 p-3">
                    <p className="font-semibold text-xs text-ink mb-1">
                      4. Nutzersupport
                    </p>
                    <p className="text-xs text-ink/65">
                      Beantwortung von Rückfragen und technische Hilfestellung bei der
                      Nutzung unserer Assistenten.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 04 · Rechtsgrundlagen */}
            <section
              id="sec-4"
              className="scroll-mt-6 rounded-xl border border-border bg-surface p-6 shadow-card"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wide text-seal">
                  04 · Rechtsgrundlagen
                </span>
                <Scale size={18} className="text-seal/60" />
              </div>
              <h2 className="mb-3 text-xl font-bold text-ink">
                Auf welcher Rechtsgrundlage verarbeiten wir Ihre Daten?
              </h2>
              <div className="text-sm leading-relaxed text-ink/75 space-y-3">
                <p>
                  Die Verarbeitung Ihrer Daten stützt sich auf folgende
                  Bestimmungen der DSGVO:
                </p>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5 rounded-lg border border-border bg-canvas p-3">
                    <span className="rounded bg-seal/10 px-2 py-0.5 font-mono text-xs font-semibold text-seal shrink-0">
                      Art. 6 Abs. 1 lit. a DSGVO
                    </span>
                    <p className="text-xs text-ink/80">
                      <strong>Einwilligung:</strong> Für die Analyse hochgeladener
                      Dokumente und die Speicherung persönlicher Vorgänge erteilen Sie
                      uns vorab eine ausdrückliche Einwilligung. Sie können diese
                      jederzeit mit Wirkung für die Zukunft widerrufen.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5 rounded-lg border border-border bg-canvas p-3">
                    <span className="rounded bg-seal/10 px-2 py-0.5 font-mono text-xs font-semibold text-seal shrink-0">
                      Art. 6 Abs. 1 lit. b DSGVO
                    </span>
                    <p className="text-xs text-ink/80">
                      <strong>Vertragserfüllung & Vorvertragliche Maßnahmen:</strong>{" "}
                      Soweit die Verarbeitung zur Erbringung unserer Dienstleistungen
                      (z. B. der Fristenberechnung) erforderlich ist.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5 rounded-lg border border-border bg-canvas p-3">
                    <span className="rounded bg-seal/10 px-2 py-0.5 font-mono text-xs font-semibold text-seal shrink-0">
                      Art. 6 Abs. 1 lit. c DSGVO
                    </span>
                    <p className="text-xs text-ink/80">
                      <strong>Rechtliche Verpflichtung:</strong> Soweit gesetzliche
                      Aufbewahrungs- oder Nachweispflichten einzuhalten sind.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5 rounded-lg border border-border bg-canvas p-3">
                    <span className="rounded bg-seal/10 px-2 py-0.5 font-mono text-xs font-semibold text-seal shrink-0">
                      Art. 6 Abs. 1 lit. f DSGVO
                    </span>
                    <p className="text-xs text-ink/80">
                      <strong>Berechtigtes Interesse:</strong> Für den sicheren
                      Betrieb der IT-Infrastruktur, Abwehr von Missbrauch sowie
                      statistische Auswertungen ohne Personenbezug.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 05 · Speicherdauer */}
            <section
              id="sec-5"
              className="scroll-mt-6 rounded-xl border border-border bg-surface p-6 shadow-card"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wide text-seal">
                  05 · Speicherdauer
                </span>
                <Clock size={18} className="text-seal/60" />
              </div>
              <h2 className="mb-3 text-xl font-bold text-ink">
                Wie lange werden Ihre Daten gespeichert?
              </h2>
              <div className="text-sm leading-relaxed text-ink/75 space-y-3">
                <p>
                  Wir verarbeiten und speichern Ihre personenbezogenen Daten nur für
                  den Zeitraum, der zur Erreichung des Speicherungszwecks
                  erforderlich ist oder sofern dies durch gesetzliche Vorgaben
                  vorgesehen wurde.
                </p>
                <ul className="list-disc space-y-1.5 pl-5 text-xs text-ink/80">
                  <li>
                    <strong>Dokumentenanalysen & Eingaben:</strong> Werden nach
                    Abschluss der Sitzung bzw. spätestens nach 30 Tagen
                    automatisch gelöscht, sofern Sie keine Speicherung in Ihrem
                    Konto veranlasst haben.
                  </li>
                  <li>
                    <strong>Server-Logfiles:</strong> Werden zur IT-Sicherheitsüberwachung
                    für maximal 7 Tage gespeichert und anschließend anonymisiert oder
                    gelöscht.
                  </li>
                  <li>
                    <strong>Kontaktanfragen:</strong> Werden nach vollständiger
                    Bearbeitung gelöscht, sofern keine gesetzlichen
                    Aufbewahrungsfristen entgegenstehen.
                  </li>
                </ul>
              </div>
            </section>

            {/* 06 · Ihre Rechte */}
            <section
              id="sec-6"
              className="scroll-mt-6 rounded-xl border border-border bg-surface p-6 shadow-card"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wide text-seal">
                  06 · Ihre Rechte
                </span>
                <ShieldCheck size={18} className="text-seal/60" />
              </div>
              <h2 className="mb-3 text-xl font-bold text-ink">
                Welche Rechte stehen Ihnen zu?
              </h2>
              <p className="mb-4 text-sm text-ink/75">
                Nach den Bestimmungen der Art. 15–21 DSGVO haben Sie bezüglich Ihrer
                personenbezogenen Daten folgende Rechte gegenüber CivicAI:
              </p>
              <div className="grid gap-3 sm:grid-cols-2 text-xs">
                <div className="rounded-lg border border-border bg-canvas/40 p-3">
                  <p className="font-semibold text-ink text-sm mb-1">
                    Art. 15 DSGVO · Auskunftsrecht
                  </p>
                  <p className="text-ink/65">
                    Sie haben das Recht, Bestätigung darüber zu verlangen, ob
                    betreffende Daten verarbeitet werden, und Auskunft über diese
                    Daten zu erhalten.
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-canvas/40 p-3">
                  <p className="font-semibold text-ink text-sm mb-1">
                    Art. 16 DSGVO · Berichtigung
                  </p>
                  <p className="text-ink/65">
                    Sie können die Vervollständigung oder Berichtigung Sie betreffender
                    unrichtiger Daten verlangen.
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-canvas/40 p-3">
                  <p className="font-semibold text-ink text-sm mb-1">
                    Art. 17 DSGVO · Löschung
                  </p>
                  <p className="text-ink/65">
                    Das Recht auf "Vergessenwerden" gestattet Ihnen, die unverzügliche
                    Löschung Ihrer personenbezogenen Daten zu verlangen.
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-canvas/40 p-3">
                  <p className="font-semibold text-ink text-sm mb-1">
                    Art. 18 DSGVO · Einschränkung
                  </p>
                  <p className="text-ink/65">
                    Sie können verlangen, dass die Verarbeitung Ihrer Daten unter
                    bestimmten Voraussetzungen eingeschränkt wird.
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-canvas/40 p-3">
                  <p className="font-semibold text-ink text-sm mb-1">
                    Art. 20 DSGVO · Datenübertragbarkeit
                  </p>
                  <p className="text-ink/65">
                    Sie haben das Recht, Daten, die Sie uns bereitgestellt haben, in
                    einem strukturierten, gängigen und maschinenlesbaren Format zu
                    erhalten.
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-canvas/40 p-3">
                  <p className="font-semibold text-ink text-sm mb-1">
                    Art. 21 DSGVO · Widerspruchsrecht
                  </p>
                  <p className="text-ink/65">
                    Sie können der künftigen Verarbeitung der Sie betreffenden Daten
                    jederzeit aus Gründen, die sich aus Ihrer besonderen Situation
                    ergeben, widersprechen.
                  </p>
                </div>
              </div>
            </section>

            {/* 07 · Cookies und Tracking */}
            <section
              id="sec-7"
              className="scroll-mt-6 rounded-xl border border-border bg-surface p-6 shadow-card"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wide text-seal">
                  07 · Cookies & Tracking
                </span>
                <Cookie size={18} className="text-seal/60" />
              </div>
              <h2 className="mb-3 text-xl font-bold text-ink">
                Cookies und Web-Analysedienste
              </h2>
              <div className="text-sm leading-relaxed text-ink/75 space-y-3">
                <p>
                  CivicAI verwendet ausschließlich technisch notwendige Session-Cookies
                  und lokalen Browserspeicher (Local Storage), um Grundfunktionen
                  wie z. B. temporäre Eingaben im Fristen-Rechner bereitzustellen.
                </p>
                <div className="rounded-lg bg-signal-green-light/60 p-3 text-xs text-signal-green border border-signal-green/20">
                  <span className="font-semibold">Kein Werbe-Tracking: </span>
                  Wir setzen keine Marketing-Cookies oder Drittanbieter-Tracker
                  (wie Google Analytics oder Meta Pixel) ein. Ihre Aktivitäten auf
                  CivicAI werden nicht für Werbezwecke ausgewertet.
                </div>
              </div>
            </section>

            {/* 08 · Datenschutzbeauftragter */}
            <section
              id="sec-8"
              className="scroll-mt-6 rounded-xl border border-border bg-surface p-6 shadow-card"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wide text-seal">
                  08 · Datenschutzbeauftragter
                </span>
                <Mail size={18} className="text-seal/60" />
              </div>
              <h2 className="mb-3 text-xl font-bold text-ink">
                Kontakt zum Datenschutzbeauftragten
              </h2>
              <div className="text-sm leading-relaxed text-ink/75 space-y-3">
                <p>
                  Bei Fragen zur Verarbeitung Ihrer personenbezogenen Daten oder zur
                  Wahrnehmung Ihrer Betroffenenrechte wenden Sie sich direkt an unseren
                  betrieblichen Datenschutzbeauftragten:
                </p>
                <div className="rounded-lg bg-canvas p-4 text-xs font-mono border border-border/80">
                  <p className="font-bold font-body text-seal text-sm mb-1">
                    Datenschutzbeauftragter CivicAI
                  </p>
                  <p>c/o CivicAI gGmbH</p>
                  <p>Musterstraße 42, 10117 Berlin</p>
                  <p className="mt-2">E-Mail: datenschutzbeauftragter@civicai.de</p>
                </div>
              </div>
            </section>

            {/* 09 · Beschwerderecht bei der Aufsichtsbehörde */}
            <section
              id="sec-9"
              className="scroll-mt-6 rounded-xl border border-border bg-surface p-6 shadow-card"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wide text-seal">
                  09 · Beschwerderecht
                </span>
                <AlertCircle size={18} className="text-seal/60" />
              </div>
              <h2 className="mb-3 text-xl font-bold text-ink">
                Beschwerderecht bei der Aufsichtsbehörde
              </h2>
              <div className="text-sm leading-relaxed text-ink/75 space-y-3">
                <p>
                  Gemäß Art. 77 DSGVO haben Sie unbeschadet eines anderweitigen
                  verwaltungsrechtlichen oder gerichtlichen Rechtsbehelfs das Recht
                  auf Beschwerde bei einer Aufsichtsbehörde, insbesondere in dem
                  Mitgliedstaat Ihres gewöhnlichen Aufenthaltsorts, Ihres Arbeitsplatzes
                  oder des Orts des mutmaßlichen Verstoßes.
                </p>
                <p className="text-xs text-ink/65">
                  Zuständige Aufsichtsbehörde für CivicAI:
                  <br />
                  <span className="font-medium text-ink">
                    Berliner Beauftragte für Datenschutz und Informationsfreiheit
                  </span>
                  <br />
                  Alt-Moabit 143, 10557 Berlin · Telefon: +49 30 13889-0 · E-Mail:
                  mailbox@datenschutz-berlin.de
                </p>
              </div>
            </section>

            {/* 10 · SSL- bzw. TLS-Verschlüsselung */}
            <section
              id="sec-10"
              className="scroll-mt-6 rounded-xl border border-border bg-surface p-6 shadow-card"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wide text-seal">
                  10 · Verschlüsselung
                </span>
                <Lock size={18} className="text-seal/60" />
              </div>
              <h2 className="mb-3 text-xl font-bold text-ink">
                SSL- bzw. TLS-Verschlüsselung
              </h2>
              <div className="text-sm leading-relaxed text-ink/75 space-y-3">
                <p>
                  Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der
                  Übertragung vertraulicher Inhalte, wie zum Beispiel Anfragen oder
                  Dokumentenuploads, die Sie an uns als Seitenbetreiber senden, eine
                  SSL- bzw. TLS-Verschlüsselung.
                </p>
                <p className="text-xs text-ink/65">
                  Eine verschlüsselte Verbindung erkennen Sie daran, dass die
                  Adresszeile des Browsers von "http://" auf "https://" wechselt
                  und an dem Schloss-Symbol in Ihrer Browserzeile. Wenn die SSL- bzw.
                  TLS-Verschlüsselung aktiviert ist, können die Daten, die Sie an uns
                  übermitteln, nicht von Dritten mitgelesen werden.
                </p>
              </div>
            </section>
          </div>

          {/* Bottom Link Back to Dashboard */}
          <div className="mt-12 flex flex-col items-center justify-center gap-4 rounded-xl border border-border bg-surface p-8 text-center shadow-card">
            <h3 className="text-lg font-bold text-ink">
              Fragen zum Datenschutz oder zu Ihren Rechten?
            </h3>
            <p className="max-w-md text-xs text-ink/65">
              Unser Team steht Ihnen bei allen Anliegen zur Transparenz und
              Datensicherheit gerne zur Verfügung.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-lg bg-seal px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                <ArrowLeft size={16} />
                Zurück zum Dashboard
              </Link>
              <a
                href="mailto:datenschutz@civicai.de"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-medium text-ink hover:bg-seal-light"
              >
                <Mail size={16} />
                Datenschutz-Team kontaktieren
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
