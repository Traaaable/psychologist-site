# Психолог-сайт — Нестерова Лариса Васильевна

Профессиональный сайт психолога на Next.js 15 + TypeScript + Tailwind CSS.

## Локальная разработка (Windows)

```bash
cd psychologist-site
npm install
npm run dev
```

Откройте http://localhost:3000

### Docker (локально)

```bash
docker compose up -d
```

## Развёртывание на VPS (Ubuntu/Debian)

### Быстрый старт

```bash
# 1. Клонируйте репозиторий
git clone <URL_репозитория> sait
cd sait

# 2. Первый запуск
bash scripts/install.sh
```

### Настройка

После первого запуска отредактируйте `.env`:

```bash
nano .env
```

Укажите:
- `ADMIN_PASSWORD` — пароль для входа в админку
- `ADMIN_SECRET` — случайная строка от 32 символов

Перезапустите:
```bash
bash scripts/install.sh
```

### Управление

| Команда | Описание |
|---------|----------|
| `bash scripts/logs.sh` | Логи сайта (Ctrl+C для выхода) |
| `bash scripts/restart.sh` | Перезапуск контейнера |
| `bash scripts/stop.sh` | Остановка сайта |
| `bash scripts/update.sh` | Обновление (git pull + пересборка) |

### Структура после установки

```
sait/
├── data/           # Контент сайта (JSON) — редактируется через админку
├── public/uploads/  # Загруженные фото
├── .env             # Пароли (не коммитится!)
└── docker-compose.production.yml
```

### Обновление

```bash
cd sait
bash scripts/update.sh
```

## Админ-панель

- URL: `http://<IP>/admin`
- Логин: `admin`
- Пароль: тот, что вы задали в `ADMIN_PASSWORD`

Через админку редактируется:
- ФИО, фото, описание специалиста
- Контакты (город, адрес, телефон, email)
- Услуги и цены
- FAQ
- SEO-метаданные

## Перенос данных на новый сервер

Скопируйте папки `data/` и `public/uploads/` на новый сервер — весь контент сохранится.

## Команды Docker

```bash
# Посмотреть статус
docker ps

# Зайти в контейнер
docker exec -it psychologist-site sh

# Пересобрать без pull
docker compose -f docker-compose.production.yml up -d --build --no-pull
```
