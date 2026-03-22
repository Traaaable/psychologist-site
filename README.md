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
- `CONTENT_STORAGE_DIR` — папка на сервере, где хранится живой `content.json`
  Обычно достаточно оставить `./runtime-data`, но можно указать и абсолютный путь.

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
├── data/            # Стартовый seed-файл из репозитория
├── runtime-data/    # Живой контент сайта (JSON) — редактируется через админку
├── public/uploads/  # Загруженные фото
├── .env             # Пароли (не коммитится!)
└── docker-compose.production.yml
```

### Обновление

```bash
cd sait
bash scripts/update.sh
```

Скрипт обновления сам:
- перенесёт старый `data/content.json` в runtime-хранилище, если это первый переход на новую схему;
- очистит конфликтующий tracked-файл перед `git pull`, если сервер ещё жил на старой схеме;
- пересоберёт контейнер уже с отдельным runtime-файлом контента.

### Одноразовая миграция для уже работающего VPS

Если сайт уже редактировался через админку и `git pull` упирается в `data/content.json`, сделайте один раз:

```bash
cd ~/sait
mkdir -p runtime-data
cp data/content.json runtime-data/content.json
git restore data/content.json
git pull origin main
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

Скопируйте папки `runtime-data/` и `public/uploads/` на новый сервер — весь контент сохранится.

## Команды Docker

```bash
# Посмотреть статус
docker ps

# Зайти в контейнер
docker exec -it psychologist-site sh

# Пересобрать без pull
docker compose -f docker-compose.production.yml up -d --build --no-pull
```
