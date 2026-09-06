#!/bin/sh
# Ship Caddy JSON access-log lines to Gravwell HTTP ingest (tag=web).
set -eu

apk add --no-cache curl >/dev/null

URL="${GRAVWELL_INGEST_URL:-http://gravwell:8080/web}"
TOKEN="${GRAVWELL_INGEST_TOKEN:?GRAVWELL_INGEST_TOKEN is required}"
LOG="${CADDY_ACCESS_LOG:-/var/log/caddy/access.log}"

echo "waiting for $LOG"
i=0
while [ ! -f "$LOG" ]; do
	i=$((i + 1))
	if [ "$i" -ge 120 ]; then
		echo "error: $LOG not created by Caddy" >&2
		exit 1
	fi
	sleep 1
done

echo "shipping $LOG -> $URL"

tail -n0 -F "$LOG" | while IFS= read -r line || [ -n "$line" ]; do
	[ -z "$line" ] && continue
	curl -sS -m 10 \
		-H "Authorization: Bearer ${TOKEN}" \
		-H "Content-Type: application/json" \
		--data-binary "$line" \
		"$URL" >/dev/null || echo "warn: ingest failed" >&2
done
