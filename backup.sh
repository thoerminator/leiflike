#!/usr/bin/env bash
# Inhalte + hochgeladene Bilder sichern. Behält die letzten 14 Sicherungen.
#   ./backup.sh
set -euo pipefail
cd "$(dirname "$0")"

DIR="${LEIFLIKE_BACKUP_DIR:-$PWD/backups}"
VOL="$(basename "$PWD")_leiflike_data"
mkdir -p "$DIR"
FILE="leiflike-$(date +%F-%H%M).tar.gz"

docker run --rm \
  -v "${VOL}:/data:ro" \
  -v "${DIR}:/backup" \
  alpine tar czf "/backup/${FILE}" -C /data . 2>/dev/null

echo "✓ Gesichert: ${DIR}/${FILE} ($(du -h "${DIR}/${FILE}" | cut -f1))"

# Nur die 14 jüngsten behalten
ls -1t "${DIR}"/leiflike-*.tar.gz 2>/dev/null | tail -n +15 | xargs -r rm --
