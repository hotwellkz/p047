# 🔧 Исправление Google Drive OAuth redirect_uri mismatch

## Проблема

Google показывает ошибку 400 с параметром `redirect_uri=https://shortsai.ru/google-drive/callback`, что означает несоответствие redirect_uri между приложением и Google Console.

## Решение

### 1. Изменения в коде

**Файлы изменены:**
- `backend/src/routes/authRoutes.ts` - использует `GOOGLE_DRIVE_REDIRECT_URI`
- `backend/src/services/GoogleDriveOAuthService.ts` - использует `GOOGLE_DRIVE_REDIRECT_URI`
- `backend/src/routes/googleDriveIntegrationRoutes.ts` - использует `GOOGLE_DRIVE_REDIRECT_URI`

**Что изменилось:**
- Убран хардкод формирования `redirect_uri` из `BACKEND_BASE_URL` + `GOOGLE_REDIRECT_PATH`
- Добавлена переменная окружения `GOOGLE_DRIVE_REDIRECT_URI` (должна быть frontend URL)
- Добавлено логирование `client_id`, `redirect_uri`, `scopes` при старте OAuth
- `redirect_uri` теперь единый и управляется через env переменную

### 2. Переменная окружения для Cloud Run

Установите в Cloud Run:

```powershell
gcloud run services update shortsai-backend --region us-central1 --update-env-vars "GOOGLE_DRIVE_REDIRECT_URI=https://shortsai.ru/google-drive/callback"
```

**Важно:** `GOOGLE_DRIVE_REDIRECT_URI` должен быть **frontend URL**, а не backend URL!

### 3. Настройка в Google Cloud Console

1. Откройте [Google Cloud Console](https://console.cloud.google.com/)
2. Перейдите в **APIs & Services** → **Credentials**
3. Найдите ваш OAuth 2.0 Client ID (используемый для Google Drive)
4. В разделе **Authorized redirect URIs** добавьте:
   ```
   https://shortsai.ru/google-drive/callback
   ```
5. Сохраните изменения

**Примечание:** Убедитесь, что redirect URI **точно совпадает** с `GOOGLE_DRIVE_REDIRECT_URI` в Cloud Run (включая протокол, домен и путь).

### 4. Проверка

После деплоя проверьте логи Cloud Run при старте OAuth:

```powershell
gcloud run services logs read shortsai-backend --region us-central1 --limit 50 | Select-String "OAuth"
```

Должны быть логи с:
- `clientId` (первые 20 символов для идентификации)
- `redirectUri` (должен быть `https://shortsai.ru/google-drive/callback`)
- `scopes` (список разрешений)

### 5. Проверка endpoint

Endpoint `/api/auth/google/drive`:
- ✅ Использует `requireSession` (cookie-based сессия)
- ✅ НЕ требует `Authorization` header
- ✅ Работает через браузерный redirect

## Команды деплоя

```powershell
# 1. Установить переменную окружения
gcloud run services update shortsai-backend --region us-central1 --update-env-vars "GOOGLE_DRIVE_REDIRECT_URI=https://shortsai.ru/google-drive/callback"

# 2. Задеплоить изменения (если нужно)
cd backend
gcloud run deploy shortsai-backend --source . --region us-central1
```

## Список изменённых файлов

1. `backend/src/routes/authRoutes.ts`
2. `backend/src/services/GoogleDriveOAuthService.ts`
3. `backend/src/routes/googleDriveIntegrationRoutes.ts`
4. `DEPLOYMENT_INSTRUCTIONS.md`
5. `backend/GOOGLE_DRIVE_REDIRECT_URI_FIX.md` (этот файл)

