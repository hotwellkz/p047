import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { getAuthToken } from "../../utils/auth";
import { API_BASE_URL } from "../../config/api";

/**
 * Страница обработки OAuth callback от Google Drive
 * 
 * Ожидает параметр `code` в URL, отправляет его на бэкенд
 * и перенаправляет пользователя в настройки после успешной авторизации
 */
export default function GoogleDriveCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("Обработка авторизации...");

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const error = searchParams.get("error");

      // Проверяем наличие ошибки от Google
      if (error) {
        setStatus("error");
        setMessage(`Ошибка авторизации: ${error}`);
        setTimeout(() => {
          navigate("/settings");
        }, 3000);
        return;
      }

      // Проверяем наличие кода авторизации
      if (!code) {
        setStatus("error");
        setMessage("Код авторизации не получен");
        setTimeout(() => {
          navigate("/settings");
        }, 3000);
        return;
      }

      try {
        // Получаем токен авторизации
        const token = await getAuthToken();

        // Отправляем код на бэкенд
        const response = await fetch(`${API_BASE_URL}/api/google-drive-integration/oauth/callback`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ code })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP ${response.status}`);
        }

        const data = await response.json();

        setStatus("success");
        setMessage(
          data.email
            ? `Google Drive успешно подключен (${data.email})`
            : "Google Drive успешно подключен"
        );

        // Перенаправляем в настройки через 2 секунды
        setTimeout(() => {
          navigate("/settings");
        }, 2000);
      } catch (err) {
        console.error("Error processing Google Drive callback:", err);
        setStatus("error");
        setMessage(
          err instanceof Error
            ? `Ошибка подключения: ${err.message}`
            : "Ошибка подключения Google Drive"
        );
        setTimeout(() => {
          navigate("/settings");
        }, 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
      <div className="flex flex-col items-center gap-4 rounded-lg bg-slate-900 p-8 shadow-xl">
        {status === "loading" && (
          <>
            <Loader2 className="h-12 w-12 animate-spin text-brand-light" />
            <p className="text-lg text-slate-200">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <p className="text-lg text-slate-200">{message}</p>
            <p className="text-sm text-slate-400">Перенаправление в настройки...</p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="h-12 w-12 text-red-500" />
            <p className="text-lg text-slate-200">{message}</p>
            <p className="text-sm text-slate-400">Перенаправление в настройки...</p>
          </>
        )}
      </div>
    </div>
  );
}

