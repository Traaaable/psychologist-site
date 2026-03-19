#!/bin/bash
set -e

COMPOSE_CMD="docker-compose"
if docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
fi

echo "=== Обновление психолог-сайта ==="

if [ -d .git ]; then
    echo "Загрузка обновлений из репозитория..."
    git pull origin main || git pull origin master
fi

echo "Пересборка и перезапуск..."
$COMPOSE_CMD -f docker-compose.production.yml down
$COMPOSE_CMD -f docker-compose.production.yml up -d --build

echo "Ожидание запуска..."
sleep 15

if $COMPOSE_CMD -f docker-compose.production.yml ps | grep -q "Up"; then
    echo "Готово! Сайт обновлён."
    bash scripts/logs.sh
else
    echo "Ошибка: контейнер не запустился."
    exit 1
fi
