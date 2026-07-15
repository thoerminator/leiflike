#!/usr/bin/env bash
# Neuen Stand von GitHub holen und live schalten.
#   ./update.sh
set -euo pipefail
cd "$(dirname "$0")"

echo "→ Hole Änderungen von GitHub…"
git pull --ff-only

echo "→ Sichere die Inhalte vorher weg…"
./backup.sh >/dev/null

echo "→ Baue und starte neu…"
docker compose up -d --build

echo "→ Warte auf die Seite…"
for i in $(seq 1 30); do
  if docker compose exec -T web node -e "fetch('http://127.0.0.1:3000/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))" 2>/dev/null; then
    echo "✓ Läuft. Alte Images aufräumen…"
    docker image prune -f >/dev/null
    exit 0
  fi
  sleep 2
done

echo "✗ Die Seite antwortet nicht. Logs:"
docker compose logs --tail=40 web
exit 1
