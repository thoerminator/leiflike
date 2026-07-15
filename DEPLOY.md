# Deployment — Debian-Server

## Einmalig einrichten

```bash
git clone <DEIN-REPO> leiflike && cd leiflike

cp .env.example .env
nano .env          # ADMIN_PASSWORD setzen + AUTH_SECRET einfügen
                   # AUTH_SECRET erzeugen:  openssl rand -base64 32

nano Caddyfile     # Domain eintragen (steht schon auf leiflike.de)

docker compose up -d --build
```

Fertig. Erreichbar auf Port 80/443 — Caddy holt das HTTPS-Zertifikat automatisch,
sobald die Domain auf den Server zeigt.

## Router & DNS

1. **Portfreigabe** im Router: extern `80` und `443` → interne IP des Servers, gleiche Ports.
2. **DNS** beim Registrar:
   - `A`-Record `leiflike.de` → eure öffentliche IPv4
   - `A`-Record `www` → dieselbe IP
3. **Dynamische IP?** DynDNS im Router aktivieren (z. B. deSEC, duckdns) und beim
   Registrar einen `CNAME` auf den DynDNS-Namen setzen — statt des A-Records.

Öffentliche IP prüfen: `curl -4 ifconfig.me` auf dem Server.
Stimmt sie **nicht** mit der IP im Router-Menü überein, hängt ihr hinter DS-Lite/CGNAT —
dann ist keine Portfreigabe möglich und ein Cloudflare Tunnel wäre der Weg.

## Alltag

| Was | Befehl |
| --- | --- |
| Update einspielen | `git pull && docker compose up -d --build` |
| Logs ansehen | `docker compose logs -f web` |
| Neustart | `docker compose restart` |
| Stoppen | `docker compose down` |

## Inhalte & Sicherung

Alles Redaktionelle liegt im Volume `leiflike_data`, **nicht** im Container —
Updates löschen also nichts.

- `content.json` — Projekte, CV, Profil, Notizen, Einstellungen
- `uploads/` — die im Admin hochgeladenen Bilder (WebP)

Sichern:

```bash
docker run --rm -v leiflike_leiflike_data:/data -v "$PWD":/backup alpine \
  tar czf /backup/leiflike-backup-$(date +%F).tar.gz -C /data .
```

Zurückspielen:

```bash
docker run --rm -v leiflike_leiflike_data:/data -v "$PWD":/backup alpine \
  tar xzf /backup/leiflike-backup-2026-07-15.tar.gz -C /data
docker compose restart web
```

Zusätzlich gibt es im Admin unter **Daten** einen JSON-Export/-Import.

## Admin

`https://leiflike.de/admin` — oder über den Schlüssel oben rechts auf der Seite.
Passwort = `ADMIN_PASSWORD` aus der `.env`. Die Sitzung läuft über ein signiertes
httpOnly-Cookie (30 Tage) und lässt sich nicht fälschen.

Passwort ändern: `.env` anpassen → `docker compose up -d` (kein Rebuild nötig).
Wird `AUTH_SECRET` geändert, werden alle bestehenden Sitzungen ungültig.
