# Supabase Backend - Snake 3D

Документ описывает первый backend-слой для регистрации пользователей и
сохранения игровых сессий.

## Что Добавлено

- Supabase client для frontend-приложения.
- Email/password auth helper.
- Таблицы `profiles` и `game_sessions`.
- RLS-политики: пользователь видит и записывает только свои игровые сессии.
- Сохранение протокола при завершении уровня, победе или game over.

## Переменные Окружения

Создайте локальный `.env` по примеру `.env.example`:

```text
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Эти значения берутся в Supabase Dashboard:

- Project Settings -> API -> Project URL;
- Project Settings -> API -> anon public key.

## SQL-Схема

Схема лежит в:

```text
supabase/migrations/202607260001_initial_backend.sql
```

Для ручного применения:

1. Откройте Supabase Dashboard.
2. Перейдите в SQL Editor.
3. Выполните содержимое файла миграции.

## Сохранение Сессий

Игра сохраняет запись в `game_sessions`, если:

- Supabase настроен через env;
- пользователь авторизован;
- уровень завершен, игра проиграна или игрок прошел все уровни.

Если Supabase не настроен или пользователь не вошел, игра продолжает работать как
раньше и сохраняет протокол в `localStorage`.

## Метрики

В `game_sessions` сохраняются:

- `level_number` - номер уровня;
- `game_mode` - `classic` или `training`;
- `status` - `completed`, `game_over` или `won`;
- `score` и `max_score`;
- `protocol` - полный JSON-протокол;
- `apple_time_overrun_avg` - средний коэффициент перерасхода времени;
- `apple_time_overrun_count` - количество яблок, по которым рассчитан коэффициент.

## Следующий Шаг

Следующий практический этап - добавить UI регистрации и входа:

- форма регистрации;
- форма входа;
- индикатор текущего пользователя;
- кнопка выхода;
- экран истории игровых сессий.

## Auth UI

В игре есть минимальная панель авторизации:

- вход по email/password;
- регистрация по email/password с именем игрока;
- отображение текущего email после входа;
- выход из аккаунта.

Панель использует переменные `VITE_SUPABASE_URL` и `VITE_SUPABASE_ANON_KEY`. Если они не заданы, игра продолжает работать без backend-сохранения.
