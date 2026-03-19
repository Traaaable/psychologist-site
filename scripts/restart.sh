#!/bin/bash

COMPOSE_CMD="docker-compose"
if docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
fi

echo "=== Перезапуск ==="
$COMPOSE_CMD -f docker-compose.production.yml restart
echo "Готово."
