#!/bin/bash
set -e

echo "=== Установка психолог-сайта ==="

if ! command -v docker &> /dev/null; then
    echo "Ошибка: Docker не установлен. Установите Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "Ошибка: docker-compose не установлен."
    exit 1
fi

COMPOSE_CMD="docker-compose"
if docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
fi

get_content_storage_dir() {
    local storage_dir
    storage_dir=$(grep -E '^CONTENT_STORAGE_DIR=' .env 2>/dev/null | tail -n 1 | cut -d= -f2-)

    if [ -n "$storage_dir" ]; then
        echo "$storage_dir"
    else
        echo "./runtime-data"
    fi
}

CONTENT_STORAGE_DIR="$(get_content_storage_dir)"

migrate_legacy_content_if_needed() {
    mkdir -p "$CONTENT_STORAGE_DIR"

    if [ ! -f "$CONTENT_STORAGE_DIR/content.json" ] && [ -f data/content.json ]; then
        cp data/content.json "$CONTENT_STORAGE_DIR/content.json"
        echo "Перенёс стартовый content.json в $CONTENT_STORAGE_DIR"
    fi
}

ensure_runtime_permissions() {
    mkdir -p "$CONTENT_STORAGE_DIR" public/uploads

    if [ "$(id -u)" = "0" ]; then
        chown -R 1001:1001 "$CONTENT_STORAGE_DIR" public/uploads
    fi

    chmod -R u+rwX "$CONTENT_STORAGE_DIR" public/uploads 2>/dev/null || true
}

fix_container_permissions() {
    docker exec -u 0 psychologist-site sh -lc "
        mkdir -p /app/runtime-data /app/public/uploads &&
        chown -R nextjs:nodejs /app/runtime-data /app/public/uploads &&
        chmod -R u+rwX /app/runtime-data /app/public/uploads
    " >/dev/null 2>&1 || true
}

if [ ! -f .env ]; then
    echo "Создание .env из .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "Отредактируйте .env и задайте значения:"
        echo "  ADMIN_PASSWORD=ваш_пароль_админа"
        echo "  ADMIN_SECRET=случайная_строка_не_менее_32_символов"
        echo ""
        echo "После редактирования запустите: bash scripts/install.sh"
        exit 0
    else
        echo "Ошибка: .env.example не найден"
        exit 1
    fi
fi

echo "Сборка и запуск контейнера..."
migrate_legacy_content_if_needed
ensure_runtime_permissions
$COMPOSE_CMD -f docker-compose.production.yml down 2>/dev/null || true
$COMPOSE_CMD -f docker-compose.production.yml up -d --build
sleep 2
fix_container_permissions

echo ""
echo "Ожидание запуска сайта..."
sleep 10

if $COMPOSE_CMD -f docker-compose.production.yml ps | grep -q "Up"; then
    echo ""
    echo "=== Готово! ==="
    echo "Сайт доступен по адресу: http://$(curl -s ifconfig.me 2>/dev/null || echo 'IP_сервера')"
    echo ""
    echo "Админ-панель: http://$(curl -s ifconfig.me 2>/dev/null || echo 'IP_сервера')/admin"
    echo "Логин: admin"
    echo ""
    echo "Команды управления:"
    echo "  bash scripts/logs.sh     — посмотреть логи"
    echo "  bash scripts/restart.sh — перезапустить"
    echo "  bash scripts/stop.sh     — остановить"
    echo "  bash scripts/update.sh   — обновить (git pull + rebuild)"
else
    echo "Ошибка: контейнер не запустился. Проверьте логи: bash scripts/logs.sh"
    exit 1
fi
