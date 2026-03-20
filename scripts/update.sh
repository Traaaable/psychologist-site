#!/bin/bash
set -e

COMPOSE_CMD="docker-compose"
if docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
fi

ensure_runtime_permissions() {
    mkdir -p data public/uploads

    if [ "$(id -u)" = "0" ]; then
        chown -R 1001:1001 data public/uploads
    fi

    chmod -R u+rwX data public/uploads 2>/dev/null || true
}

fix_container_permissions() {
    docker exec -u 0 psychologist-site sh -lc "
        mkdir -p /app/data /app/public/uploads &&
        chown -R nextjs:nodejs /app/data /app/public/uploads &&
        chmod -R u+rwX /app/data /app/public/uploads
    " >/dev/null 2>&1 || true
}

echo "=== Обновление психолог-сайта ==="

if [ -d .git ]; then
    echo "Загрузка обновлений из репозитория..."
    git pull origin main || git pull origin master
fi

echo "Пересборка и перезапуск..."
ensure_runtime_permissions
$COMPOSE_CMD -f docker-compose.production.yml down
$COMPOSE_CMD -f docker-compose.production.yml up -d --build
sleep 2
fix_container_permissions

echo "Ожидание запуска..."
sleep 15

if $COMPOSE_CMD -f docker-compose.production.yml ps | grep -q "Up"; then
    echo "Готово! Сайт обновлён."
    bash scripts/logs.sh
else
    echo "Ошибка: контейнер не запустился."
    exit 1
fi
