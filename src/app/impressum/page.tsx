"use client";

import { LegalPage } from "@/components/legal/LegalPage";
import { useI18n } from "@/lib/i18n";
import { useAppData } from "@/lib/store";

export default function ImpressumPage() {
  const { locale } = useI18n();
  const { profile } = useAppData();
  const de = locale === "de";

  return (
    <LegalPage
      title={de ? "Impressum" : "Legal notice"}
      updated={de ? "Stand: Juli 2026" : "Last updated: July 2026"}
    >
      {de ? (
        <>
          <h2>Angaben gemäß § 5 DDG</h2>
          <p>
            Leif Thörmer
            <br />
            LeifLike Design
            <br />
            Calvisiusstraße 9
            <br />
            04177 Leipzig
            <br />
            Deutschland
          </p>

          <h2>Kontakt</h2>
          <p>
            Telefon: <a href="tel:+4915771265001">0157 71265001</a>
            <br />
            E-Mail: <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </p>

          <h2>Umsatzsteuer</h2>
          <p>
            {/* TODO(Leif): Zutreffendes bestätigen — entweder USt-IdNr. eintragen
                oder den Kleinunternehmer-Satz stehen lassen. */}
            Als Kleinunternehmer im Sinne von § 19 Abs. 1 UStG wird keine Umsatzsteuer berechnet und
            daher auch keine Umsatzsteuer-Identifikationsnummer geführt.
          </p>

          <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
          <p>Leif Thörmer, Anschrift wie oben.</p>

          <h2>Verbraucherstreitbeilegung</h2>
          <p>
            Ich bin nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>

          <h2>Bildnachweise</h2>
          <p>
            Sämtliche Fotografien, Illustrationen und Gestaltungen auf dieser Seite stammen von
            Leif Thörmer, sofern nicht anders angegeben. Abgebildete Personen haben der
            Veröffentlichung zugestimmt.
          </p>

          <h2>Haftung für Inhalte</h2>
          <p>
            Als Diensteanbieter bin ich nach § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach
            den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG bin ich als Diensteanbieter
            jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen
            oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
            Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den
            allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst
            ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden
            entsprechender Rechtsverletzungen werde ich diese Inhalte umgehend entfernen.
          </p>

          <h2>Haftung für Links</h2>
          <p>
            Diese Seite enthält Links zu externen Websites Dritter, auf deren Inhalte ich keinen
            Einfluss habe. Deshalb kann ich für diese fremden Inhalte auch keine Gewähr übernehmen.
            Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der
            Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf
            mögliche Rechtsverstöße überprüft; rechtswidrige Inhalte waren nicht erkennbar. Bei
            Bekanntwerden von Rechtsverletzungen werde ich derartige Links umgehend entfernen.
          </p>

          <h2>Urheberrecht</h2>
          <p>
            Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen
            dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
            Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung
            des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den
            privaten, nicht kommerziellen Gebrauch gestattet.
          </p>
        </>
      ) : (
        <>
          <p className="ll-note">
            This is a courtesy translation. The German version is legally binding.
          </p>

          <h2>Information pursuant to § 5 DDG</h2>
          <p>
            Leif Thörmer
            <br />
            LeifLike Design
            <br />
            Calvisiusstraße 9
            <br />
            04177 Leipzig
            <br />
            Germany
          </p>

          <h2>Contact</h2>
          <p>
            Phone: <a href="tel:+4915771265001">+49 157 71265001</a>
            <br />
            Email: <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </p>

          <h2>VAT</h2>
          <p>
            As a small business under § 19 (1) of the German VAT Act (UStG), no VAT is charged and no
            VAT identification number is held.
          </p>

          <h2>Responsible for content under § 18 (2) MStV</h2>
          <p>Leif Thörmer, address as above.</p>

          <h2>Consumer dispute resolution</h2>
          <p>
            I am neither willing nor obliged to participate in dispute resolution proceedings before a
            consumer arbitration board.
          </p>

          <h2>Image credits</h2>
          <p>
            All photography, illustration and design work shown on this site is by Leif Thörmer unless
            stated otherwise. People depicted have consented to publication.
          </p>

          <h2>Liability for content and links</h2>
          <p>
            As a service provider I am responsible for my own content on these pages under general law.
            However, I am not obliged to monitor third-party information transmitted or stored, nor to
            investigate circumstances indicating illegal activity. This site contains links to external
            websites over whose content I have no influence; the respective provider is always
            responsible. Should I become aware of any legal infringement, such content or links will be
            removed promptly.
          </p>

          <h2>Copyright</h2>
          <p>
            The content and works on these pages are subject to German copyright law. Reproduction,
            editing, distribution and any kind of use beyond the limits of copyright require written
            consent from the author. Downloads and copies of this site are permitted for private,
            non-commercial use only.
          </p>
        </>
      )}
    </LegalPage>
  );
}
