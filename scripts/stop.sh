#!/bin/bash

COMPOSE_CMD="docker-compose"
if docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
fi

echo "=== Остановка ==="
$COMPOSE_CMD -f docker-compose.production.yml down
echo "Готово. Контейнер остановлен."
