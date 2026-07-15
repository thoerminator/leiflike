# LeifLike Design — Der Lichttisch

Portfolio-Plattform für **Leif Thörmer / LeifLike Design**: eine begehbare
Schreibtisch-Experience mit haptischen Bilderstapeln, Bleistift-Pfadführung,
Visitenkarten-Intro, DE/EN, Tag-/Nacht-Modus und lokalem Admin-Studio.

## Starten

```bash
npm install
npm run dev        # → http://localhost:3000
```

Als Desktop-App (startet den Dev-Server bei Bedarf selbst):

```bash
npm run desktop
```

## Bedienung

| Geste | Wirkung |
| --- | --- |
| **Ziehen** | frei über den Tisch driften (mit Schwung) |
| **Scrollen** | geführte Tour: ein Bleistiftpfad zeichnet sich zum nächsten Stapel und führt von Projekt zu Projekt („rauf/runter“) |
| **Klick auf Stapel** | Bilder fächern sich auf + Projektkarte |
| **Esc / Klick daneben / Scrollen** | Stapel legt sich zusammen |
| **Pfeiltasten** | vorheriges / nächstes Projekt |
| **Cmd-/Ctrl-Scroll oder Pinch** | zoomen |
| **Doppelklick auf leeren Tisch** | 🙂 probier's aus |
| Visitenkarte (unten links) | frei verschiebbar; Klick flippt zur Kontaktseite |
| Post-it auf dem Tisch | anklickbar |

Navigation oben: **Portfolio | Über mich**, DE/EN-Stempel, Schreibtischlampe = Dark Mode.

## Admin

`/admin` — Passwort: **unser-projekt**

- **Projekte**: Reihenfolge per Drag & Drop (= Pfad), Texte DE/EN, Jahr/Kategorie,
  Bilder hochladen (werden client-seitig zu WebP komprimiert), sortieren, löschen
- **Tisch**: Vogelperspektive — Stapel frei auf dem Canvas platzieren
- **Über mich**: Profiltexte, Werkzeuge, kompletter Lebenslauf
- **Daten**: Export/Import als JSON, Reset auf Seed

Alle Inhalte liegen lokal (localStorage + IndexedDB für Uploads) — keine ENV,
kein Account nötig. Öffentliche Seiten lesen live aus demselben Store.

## Architektur & Deployment

- Next.js (App Router) + TypeScript + framer-motion; Design-Tokens 1:1 aus dem
  LeifLike-Design-System-Handoff (`src/app/globals.css`, Fonts/Logos in `public/brand/`).
- Datenzugriff ausschließlich über `src/lib/store.ts` (useAppData/setData).
  `src/lib/remote.ts` ist der vorbereitete **Supabase-Adapter**: Keys in `.env.local`
  setzen, Adapter verdrahten — Oberfläche bleibt unverändert. Bild-Storage ist als
  eigene Schicht gekapselt und kann später auf **Cloudflare R2** zeigen.
- Vercel-Deploy: Repo pushen, importieren — läuft ohne weitere Konfiguration
  (lokaler Datenmodus). Domain später: leiflike.de.

## Seed-Inhalte

13 echte Projekte (Design / Illustration / Fotografie) mit 60+ Bildern und
Original-Texten der bisherigen leiflike.de, beim Build lokal unter `public/images/`.
