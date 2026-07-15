"use client";

import { LegalPage } from "@/components/legal/LegalPage";
import { useI18n } from "@/lib/i18n";
import { useAppData } from "@/lib/store";

export default function DatenschutzPage() {
  const { locale } = useI18n();
  const { profile } = useAppData();
  const de = locale === "de";

  return (
    <LegalPage
      title={de ? "Datenschutzerklärung" : "Privacy policy"}
      updated={de ? "Stand: Juli 2026" : "Last updated: July 2026"}
    >
      {de ? (
        <>
          <p className="ll-note">
            Kurz gesagt: Diese Seite läuft auf einem eigenen Server, bindet nichts von Dritten ein,
            trackt niemanden und setzt bei normalen Besucher:innen keine Cookies. Deshalb gibt es hier
            auch kein Cookie-Banner.
          </p>

          <h2>1. Verantwortlicher</h2>
          <p>
            Leif Thörmer · LeifLike Design
            <br />
            Calvisiusstraße 9, 04177 Leipzig, Deutschland
            <br />
            E-Mail: <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <br />
            Telefon: <a href="tel:+4915771265001">0157 71265001</a>
          </p>

          <h2>2. Hosting</h2>
          <p>
            Diese Website wird auf einem privat betriebenen Server in Deutschland gehostet. Es kommt
            kein externer Hosting-Dienstleister, kein Content-Delivery-Network und keine Cloud-Plattform
            zum Einsatz. Ihre Daten verlassen unsere Infrastruktur nicht.
          </p>

          <h2>3. Server-Logdateien</h2>
          <p>
            Beim Aufruf dieser Website verarbeitet der Server technisch notwendige Zugriffsdaten, die
            Ihr Browser automatisch übermittelt: IP-Adresse, Datum und Uhrzeit der Anfrage, aufgerufene
            Datei, übertragene Datenmenge, Statusmeldung, Referrer sowie Browser- und Betriebssystem-Kennung.
            Diese Daten sind für den Betrieb und die Sicherheit der Seite erforderlich, werden nicht mit
            anderen Datenquellen zusammengeführt und nicht zur Identifikation von Personen genutzt.
          </p>
          <p>
            <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO — berechtigtes Interesse an einem
            technisch fehlerfreien und sicheren Betrieb.
            <br />
            <strong>Speicherdauer:</strong> Logdaten werden spätestens nach 7 Tagen gelöscht, sofern sie
            nicht zur Aufklärung eines konkreten Sicherheitsvorfalls benötigt werden.
          </p>

          <h2>4. Verschlüsselung</h2>
          <p>
            Diese Seite wird ausschließlich über HTTPS (TLS) ausgeliefert. Alle Inhalte, die Sie
            aufrufen, sind auf dem Transportweg verschlüsselt.
          </p>

          <h2>5. Cookies</h2>
          <p>
            Für normale Besucher:innen werden <strong>keine Cookies</strong> gesetzt. Es gibt keine
            Tracking-, Marketing- oder Statistik-Cookies — deshalb ist auch keine Einwilligung und kein
            Cookie-Banner erforderlich.
          </p>
          <p>
            Ausschließlich beim Anmelden im geschützten Redaktionsbereich (<code>/admin</code>) wird ein
            technisch notwendiges Sitzungs-Cookie (<code>ll_session</code>) gesetzt. Es enthält keine
            personenbezogenen Daten, sondern nur eine signierte Gültigkeitsangabe, und läuft nach
            30 Tagen ab. Dieser Bereich steht nur dem Betreiber offen.
          </p>

          <h2>6. Lokale Speicherung im Browser</h2>
          <p>
            Ihre Einstellung für den Tag- oder Nachtmodus wird im <em>Local Storage</em> Ihres Browsers
            abgelegt (Schlüssel <code>leiflike-theme</code>), damit die Seite beim nächsten Besuch so
            aussieht wie zuletzt. Diese Angabe verbleibt auf Ihrem Gerät, wird nicht an den Server
            übertragen und lässt sich jederzeit über die Einstellungen Ihres Browsers löschen.
          </p>

          <h2>7. Schriften und externe Inhalte</h2>
          <p>
            Alle Schriften werden vom eigenen Server geladen. Es besteht <strong>keine Verbindung zu
            Google Fonts</strong> oder anderen Drittanbietern; Ihre IP-Adresse wird also nicht an Dritte
            übertragen. Es sind keine Analyse-Werkzeuge, keine Social-Media-Plugins, keine Karten- oder
            Video-Einbettungen im Einsatz.
          </p>

          <h2>8. Links zu sozialen Netzwerken</h2>
          <p>
            Diese Seite verlinkt auf ein Instagram-Profil. Der Link ist ein einfacher Verweis — es werden
            keine Daten an Meta übertragen, solange Sie ihn nicht anklicken. Nach dem Klick gelten die
            Datenschutzbestimmungen von Meta Platforms Ireland Ltd.
          </p>

          <h2>9. Kontaktaufnahme</h2>
          <p>
            Wenn Sie mir per E-Mail oder Telefon schreiben, verarbeite ich Ihre Angaben ausschließlich zur
            Bearbeitung Ihrer Anfrage. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO bei
            vertragsbezogenen Anfragen, sonst Art. 6 Abs. 1 lit. f DSGVO. Ihre Anfrage wird gelöscht,
            sobald sie erledigt ist und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
          </p>

          <h2>10. Ihre Rechte</h2>
          <p>
            Sie haben jederzeit das Recht auf Auskunft (Art. 15), Berichtigung (Art. 16), Löschung
            (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) sowie
            Widerspruch gegen die Verarbeitung (Art. 21 DSGVO). Eine formlose Nachricht an{" "}
            <a href={`mailto:${profile.email}`}>{profile.email}</a> genügt.
          </p>
          <p>
            Außerdem steht Ihnen ein Beschwerderecht bei einer Aufsichtsbehörde zu. Zuständig ist:
            <br />
            Die Sächsische Datenschutzbeauftragte, Devrientstraße 5, 01067 Dresden.
          </p>
        </>
      ) : (
        <>
          <p className="ll-note">
            Courtesy translation — the German version is legally binding. In short: this site runs on a
            private server, embeds nothing from third parties, tracks nobody and sets no cookies for
            ordinary visitors. That is why there is no cookie banner.
          </p>

          <h2>1. Controller</h2>
          <p>
            Leif Thörmer · LeifLike Design
            <br />
            Calvisiusstraße 9, 04177 Leipzig, Germany
            <br />
            Email: <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </p>

          <h2>2. Hosting</h2>
          <p>
            This website is hosted on a privately operated server in Germany. No external hosting
            provider, CDN or cloud platform is involved. Your data does not leave this infrastructure.
          </p>

          <h2>3. Server log files</h2>
          <p>
            When you access this site, the server processes technically necessary access data your
            browser transmits automatically: IP address, date and time, the file requested, volume
            transferred, status, referrer, browser and operating system. This data is required to run the
            site securely, is not merged with other sources and is not used to identify individuals.
            Legal basis: Art. 6 (1)(f) GDPR (legitimate interest). Logs are deleted after 7 days at the
            latest, unless needed to investigate a specific security incident.
          </p>

          <h2>4. Encryption</h2>
          <p>This site is served exclusively over HTTPS (TLS).</p>

          <h2>5. Cookies</h2>
          <p>
            <strong>No cookies are set for ordinary visitors.</strong> There is no tracking, marketing or
            analytics. A single technically necessary session cookie (<code>ll_session</code>) is set only
            when signing in to the protected editing area, contains no personal data and expires after
            30 days.
          </p>

          <h2>6. Local storage</h2>
          <p>
            Your light/dark preference is stored in your browser&rsquo;s local storage
            (<code>leiflike-theme</code>). It stays on your device, is never sent to the server and can be
            cleared in your browser settings at any time.
          </p>

          <h2>7. Fonts and third-party content</h2>
          <p>
            All fonts are served from our own server — there is <strong>no connection to Google Fonts</strong>
            or any other third party, so your IP address is not shared. No analytics, social plugins, maps
            or video embeds are used.
          </p>

          <h2>8. Social media links</h2>
          <p>
            This site links to an Instagram profile. It is a plain link — no data is transmitted to Meta
            unless you click it. After clicking, Meta Platforms Ireland Ltd.&rsquo;s privacy policy applies.
          </p>

          <h2>9. Contacting me</h2>
          <p>
            If you write to me by email or phone, your details are processed solely to handle your
            enquiry (Art. 6 (1)(b) or (f) GDPR) and deleted once it is resolved, unless retention
            obligations apply.
          </p>

          <h2>10. Your rights</h2>
          <p>
            You have the right to access, rectification, erasure, restriction, data portability and to
            object (Art. 15–21 GDPR). An informal message to{" "}
            <a href={`mailto:${profile.email}`}>{profile.email}</a> is sufficient. You also have the right
            to lodge a complaint with a supervisory authority: Die Sächsische Datenschutzbeauftragte,
            Devrientstraße 5, 01067 Dresden, Germany.
          </p>
        </>
      )}
    </LegalPage>
  );
}
