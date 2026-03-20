#!/bin/bash

COMPOSE_CMD="docker-compose"
if docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
fi

echo "=== Перезапуск ==="
mkdir -p data public/uploads
if [ "$(id -u)" = "0" ]; then
    chown -R 1001:1001 data public/uploads
fi
chmod -R u+rwX data public/uploads 2>/dev/null || true

$COMPOSE_CMD -f docker-compose.production.yml restart
sleep 2
docker exec -u 0 psychologist-site sh -lc "
    mkdir -p /app/data /app/public/uploads &&
    chown -R nextjs:nodejs /app/data /app/public/uploads &&
    chmod -R u+rwX /app/data /app/public/uploads
" >/dev/null 2>&1 || true
echo "Готово."
