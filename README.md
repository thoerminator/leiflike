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

`/admin` — oder über den Schlüssel oben rechts. Passwort = `ADMIN_PASSWORD` aus der `.env`
(lokal ohne `.env`: `unser-projekt`).

- **Projekte**: Reihenfolge per Drag & Drop (= Pfad), Texte DE/EN, Jahr/Kategorie,
  Bilder hochladen (werden client-seitig zu WebP komprimiert), sortieren, löschen
- **Tisch**: Vogelperspektive — Stapel frei auf dem Canvas platzieren
- **Über mich**: Profiltexte, Werkzeuge, kompletter Lebenslauf
- **Daten**: Export/Import als JSON, Reset auf Seed

Änderungen speichert der **Server** — jeder Besucher sieht sie sofort. Gespeichert wird
automatisch (entprellt), der Status steht oben in der Kopfzeile.

## Architektur

- Next.js (App Router) + TypeScript + framer-motion; Design-Tokens 1:1 aus dem
  LeifLike-Design-System-Handoff (`src/app/globals.css`, Fonts/Logos in `public/brand/`).
- **Inhalte:** Datei-Backend statt Datenbank. `content.json` + `uploads/` liegen unter
  `LEIFLIKE_DATA_DIR` (Docker-Volume `/data`, lokal `.data/`). Schreiben ist atomar.
- **API:** `GET /api/content` (öffentlich) · `PUT /api/content` (geschützt) ·
  `POST /api/upload` (geschützt, nimmt nur WebP) · `GET /api/uploads/<id>.webp` ·
  `/api/auth` (Login/Logout/Status).
- **Auth:** Passwort aus `ADMIN_PASSWORD`, Sitzung als HMAC-signiertes httpOnly-Cookie
  (`AUTH_SECRET`). Die Route-Handler sind die Schutzgrenze — die UI ist nur Komfort.
- **Client:** einziger Zugriffspunkt ist `src/lib/store.ts` (`useAppData` / `setData`).
  Bilder werden im Browser zu WebP komprimiert (max 1600 px), bevor sie hochgehen.

## Deployment

Siehe **[DEPLOY.md](DEPLOY.md)** — Docker Compose + Caddy (automatisches HTTPS) auf
dem eigenen Debian-Server. Domain: leiflike.de.

## Seed-Inhalte

13 echte Projekte (Design / Illustration / Fotografie) mit 60+ Bildern und
Original-Texten der bisherigen leiflike.de, beim Build lokal unter `public/images/`.
