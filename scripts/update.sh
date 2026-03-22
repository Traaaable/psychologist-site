#!/bin/bash
set -e

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

prepare_git_pull() {
    if [ ! -d .git ]; then
        return
    fi

    if ! git diff --quiet -- data/content.json 2>/dev/null; then
        echo "Обнаружены локальные изменения в data/content.json. Переношу их в $CONTENT_STORAGE_DIR..."
        mkdir -p "$CONTENT_STORAGE_DIR"
        cp data/content.json "$CONTENT_STORAGE_DIR/content.json"
        git restore --source=HEAD --worktree --staged -- data/content.json 2>/dev/null || git checkout -- data/content.json 2>/dev/null || true
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

echo "=== Обновление психолог-сайта ==="

if [ -d .git ]; then
    echo "Загрузка обновлений из репозитория..."
    migrate_legacy_content_if_needed
    prepare_git_pull
    CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")
    git pull origin "$CURRENT_BRANCH"
fi

echo "Пересборка и перезапуск..."
migrate_legacy_content_if_needed
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
