# ✅ Google OAuth и Google Drive настроены

## Установленные переменные

### Google OAuth 2.0 (для GoogleDriveOAuthService - новая система)
- ✅ `GOOGLE_CLIENT_ID=<ваш-client-id>.apps.googleusercontent.com`
- ✅ `GOOGLE_CLIENT_SECRET=<ваш-client-secret>`
- ✅ `GOOGLE_OAUTH_REDIRECT_URL=https://shortsai.ru/google-drive/callback`

### Google OAuth 2.0 (для authRoutes - старая система)
- ✅ `GOOGLE_OAUTH_CLIENT_ID=<ваш-oauth-client-id>.apps.googleusercontent.com`
- ✅ `GOOGLE_OAUTH_CLIENT_SECRET=<ваш-oauth-client-secret>`
- ✅ `GOOGLE_OAUTH_REDIRECT_URI=https://shortsai.ru/api/auth/google/callback`

### Google Drive Service Account
- ✅ `GOOGLE_DRIVE_CLIENT_EMAIL=drive-access@videobot-478618.iam.gserviceaccount.com`
- ✅ `GOOGLE_DRIVE_PRIVATE_KEY` (через Secret Manager: `google-drive-private-key`)
- ✅ `GOOGLE_DRIVE_DEFAULT_PARENT=1IYDSfMaPIjj-yqAhRMYM63j9Z0o3AcNo`

## Статус

- ✅ Все необходимые Google переменные установлены
- ✅ Сервис обновлен: `shortsai-backend-00037-zwb`
- ✅ Сервис работает корректно

## Проверка

После установки переменных:

1. **Откройте https://shortsai.ru**
2. **Попробуйте отправить промпт в Syntx и загрузить видео в Google Drive**
3. **Ошибка "Google OAuth credentials not configured" должна исчезнуть**

## Как это работает

Система использует два способа загрузки в Google Drive:

1. **OAuth интеграция пользователя** (если подключена):
   - Пользователь подключает свой Google Drive через интерфейс
   - Видео загружаются в его личный Google Drive
   - Использует `GOOGLE_CLIENT_ID` и `GOOGLE_CLIENT_SECRET`

2. **Service Account** (fallback):
   - Если OAuth интеграция не подключена, используется Service Account
   - Видео загружаются в папку, к которой Service Account имеет доступ
   - Использует `GOOGLE_DRIVE_CLIENT_EMAIL` и `GOOGLE_DRIVE_PRIVATE_KEY`

## Текущая конфигурация

### Firebase
- ✅ `FIREBASE_SERVICE_ACCOUNT` (через Secret Manager)
- ✅ `FIREBASE_PROJECT_ID=prompt-6a4fd`
- ✅ `FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@prompt-6a4fd.iam.gserviceaccount.com`
- ✅ `FRONTEND_ORIGIN=https://shortsai.ru`

### Telegram
- ✅ `TELEGRAM_API_ID=23896635`
- ✅ `TELEGRAM_API_HASH=f4d3ff7cce4d9b8bc6ea2388f32b5973`
- ✅ `SYNX_CHAT_ID=@syntxaibot`
- ✅ `TELEGRAM_SESSION_SECRET=<ваш-telegram-session-secret>`

### Google OAuth & Drive
- ✅ `GOOGLE_CLIENT_ID` - установлен (для GoogleDriveOAuthService)
- ✅ `GOOGLE_CLIENT_SECRET` - установлен (для GoogleDriveOAuthService)
- ✅ `GOOGLE_OAUTH_REDIRECT_URL` - установлен (для GoogleDriveOAuthService)
- ✅ `GOOGLE_OAUTH_CLIENT_ID` - установлен (для authRoutes)
- ✅ `GOOGLE_OAUTH_CLIENT_SECRET` - установлен (для authRoutes)
- ✅ `GOOGLE_OAUTH_REDIRECT_URI` - установлен (для authRoutes)
- ✅ `GOOGLE_DRIVE_CLIENT_EMAIL` - установлен
- ✅ `GOOGLE_DRIVE_PRIVATE_KEY` - установлен (через Secret Manager)
- ✅ `GOOGLE_DRIVE_DEFAULT_PARENT` - установлен

## Следующие шаги

1. Проверьте работу отправки промптов в Syntx
2. Проверьте загрузку видео в Google Drive
3. Если все работает - отлично! ✅

## Если есть проблемы

Проверьте логи Cloud Run:
```powershell
gcloud run services logs read shortsai-backend --region us-central1 --limit 50
```

Ищите сообщения:
- ✅ `Google Drive upload successful` - успех
- ❌ `Google OAuth credentials not configured` - проблема с OAuth
- ❌ `GOOGLE_DRIVE_CREDENTIALS_NOT_CONFIGURED` - проблема с Service Account

