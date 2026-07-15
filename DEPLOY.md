# Deployment — Schritt für Schritt

Alles, was du brauchst, in der Reihenfolge, in der du es machst.

---

## Vorher: Code auf GitHub bringen

Auf deinem Mac, nach jeder Änderung:

```bash
cd ~/"LeifLike.de Claudes take"
git push
```

> Der Ordner hieß mal „Claude's take". Das Apostroph hat den Build zerlegt —
> deshalb heißt er jetzt **Claudes take** (ohne Apostroph).

---

## Schritt 1 — Auf dem Server einrichten (einmalig)

```bash
git clone https://github.com/thoerminator/leiflike.git
cd leiflike
```

Zugangsdaten anlegen:

```bash
cp .env.example .env
openssl rand -base64 32        # Ausgabe kopieren!
nano .env
```

In der Datei eintragen:

```
ADMIN_PASSWORD=dein-eigenes-passwort
AUTH_SECRET=<die-kopierte-zufallszeichenkette>
LEIFLIKE_DATA_DIR=/data
```

Speichern: `Strg+O`, `Enter`, `Strg+X`.

Starten:

```bash
docker compose up -d --build
```

Der erste Build dauert ein paar Minuten. Danach läuft die Seite.

---

## Schritt 2 — Erreichbarkeit prüfen (VOR dem DNS)

```bash
curl -4 ifconfig.me
```

Vergleiche die Ausgabe mit der öffentlichen IP im Router-Menü.

- **Gleich?** → Alles gut, weiter mit Schritt 3.
- **Verschieden / keine Ausgabe?** → Ihr hängt hinter DS-Lite (kein eigenes
  IPv4). Portfreigabe funktioniert dann **nicht**. Sag Bescheid, dann bauen wir
  auf einen Cloudflare Tunnel um.

---

## Schritt 3 — Router und DNS

1. **Router:** Portfreigabe `80` und `443` → interne IP des Servers, gleiche Ports.
2. **DNS beim Registrar:**
   - `A`-Record `leiflike.de` → eure öffentliche IPv4
   - `A`-Record `www` → dieselbe IP
3. **Dynamische IP?** DynDNS im Router aktivieren (z. B. deSEC oder duckdns) und
   beim Registrar statt des A-Records einen `CNAME` auf den DynDNS-Namen setzen.

Sobald die Domain zeigt, holt Caddy das HTTPS-Zertifikat von allein.
`www.leiflike.de` leitet automatisch auf `leiflike.de` um.

---

## Schritt 4 — Läuft es?

```bash
curl -I https://leiflike.de          # sollte "HTTP/2 200" zeigen
docker compose ps                    # beide Container "Up"
docker compose logs -f web           # Live-Logs, beenden mit Strg+C
```

Dann im Browser: `https://leiflike.de/admin` → mit `ADMIN_PASSWORD` anmelden.

---

## Alltag

| Was | Befehl |
| --- | --- |
| **Neue Version einspielen** | `./update.sh` |
| Inhalte sichern | `./backup.sh` |
| Logs ansehen | `docker compose logs -f web` |
| Neustart | `docker compose restart` |
| Stoppen | `docker compose down` |

`./update.sh` macht alles auf einmal: von GitHub holen → Inhalte sichern → neu
bauen → prüfen, ob die Seite antwortet → aufräumen. Antwortet sie nicht, zeigt
das Script die Logs, statt still kaputtzugehen.

---

## Inhalte pflegen

Über `https://leiflike.de/admin` — **nicht** über GitHub. Änderungen sind sofort
für alle Besucher live. Der Code kommt von GitHub, die Inhalte aus dem Volume.
Beides ist getrennt, deshalb löscht ein Update nie deine Texte oder Bilder.

---

## Sicherung & Wiederherstellung

Inhalte und Uploads liegen im Volume `leiflike_data`, nicht im Container.

```bash
./backup.sh                    # legt backups/leiflike-<datum>.tar.gz an
```

Automatisch täglich um 3 Uhr:

```bash
crontab -e
# folgende Zeile anfügen (Pfad anpassen):
0 3 * * * cd /pfad/zu/leiflike && ./backup.sh >> backups/cron.log 2>&1
```

Zurückspielen:

```bash
docker run --rm -v leiflike_leiflike_data:/data -v "$PWD/backups":/backup \
  alpine tar xzf /backup/leiflike-2026-07-16-0300.tar.gz -C /data
docker compose restart web
```

Zusätzlich gibt es im Admin unter **Daten** einen JSON-Export.

---

## Passwort ändern

`.env` anpassen, dann `docker compose up -d` — kein Rebuild nötig.
Änderst du `AUTH_SECRET`, werden alle offenen Sitzungen abgemeldet.
