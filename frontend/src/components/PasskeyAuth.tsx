"use client";

import { useState } from "react";
import { usePasskey } from "@/hooks/usePasskey";
import { useEffect } from "react";
import { saveLocalKey, getLocalKey } from "../lib/webauthn";

interface PasskeyAuthProps {
  onLogin?: (username: string) => void;
}

export function PasskeyAuth({ onLogin }: PasskeyAuthProps) {
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState<string>("");
  const [localKey, setLocalKey] = useState<string | null>(null);

  // Revisar si hay llave local guardada al cargar
  useEffect(() => {
    const key = getLocalKey();
    if (key) {
      setLocalKey(key);
      setStatus("Llave local detectada. Puedes acceder sin autenticación externa.");
    }
  }, []);
  const { isSupported, createPasskey, authenticate, isLoading, error } =
    usePasskey();

  const handleRegister = async () => {
    if (!username.trim()) {
      setStatus("Please enter a username");
      return;
    }

    setStatus("Creating passkey...");
    const result = await createPasskey(username);

    if (result.success) {
      setStatus(
        `✅ Passkey created successfully! Credential ID: ${result.credentialId?.slice(0, 20)}...`
      );
      // Guardar la llave localmente tras registro exitoso
      saveLocalKey(username);
      setLocalKey(username);
      setStatus("Llave guardada localmente. Puedes acceder sin celular ni autenticación externa.");
    } else {
      setStatus(`❌ Failed: ${result.error}`);
    }
  };

  const handleAuthenticate = async () => {
    setStatus("Authenticating...");
    const result = await authenticate();

    if (result.success) {
      setStatus(`✅ Authenticated successfully! User: ${result.userHandle}`);
      if (onLogin) {
        onLogin(result.userHandle || localKey || "");
      }
    } else {
      setStatus(`❌ Failed: ${result.error}`);
    }
  };

  if (!isSupported) {
    return (
      <div className="glass rounded-2xl p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
            Passkeys No Soportados
          </h2>
          <p className="leading-relaxed" style={{ color: 'var(--muted-300)' }}>
            Tu navegador no soporta WebAuthn/Passkeys. Prueba con Chrome, Safari o Edge modernos.
          </p>
          <p className="text-sm mt-4" style={{ color: 'var(--muted-300)' }}>
            Asegúrate de usar HTTPS en producción.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-8 space-y-6">
      {/* Acceso rápido con llave local */}
      {localKey && (
        <div className="mt-4 p-2 bg-blue-100 text-blue-800 rounded">
          <strong>Acceso rápido:</strong> Usando llave local <span className="font-mono">{localKey}</span>
        </div>
      )}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
          Prueba
        </h2>
        <p style={{ color: 'var(--muted-300)' }}>
          Crea o autentícate con un passkey
        </p>
      </div>

      {/* Username Input */}
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium mb-2"
          style={{ color: 'var(--muted-300)' }}
        >
          Usuario
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          className="w-full px-4 py-3 rounded-lg border bg-[rgba(255,255,255,0.02)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent transition-all"
          disabled={isLoading}
        />
      </div>

      {/* Botón de registro siempre visible */}
      <div className="flex flex-col gap-4">
        <button
          onClick={handleRegister}
          disabled={isLoading || !username.trim()}
          className="px-6 py-4 text-black font-semibold rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(90deg, var(--primary-500), var(--accent-400))' }}
        >
          {isLoading ? (
            <>
              <Spinner />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Crear Passkey</span>
            </>
          )}
        </button>
        {/* Botón de login solo si hay llave local */}
        {localKey && (
          <button
            onClick={handleAuthenticate}
            disabled={isLoading}
            className="px-6 py-4 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(90deg, rgba(80,140,255,0.15), rgba(0,212,255,0.15))' }}
          >
            {isLoading ? (
              <>
                <Spinner />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
                <span>Login</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Status Display */}
      {(status || error) && (
        <div
          className={`p-4 rounded-lg ${
            error
              ? "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800"
              : status.includes("✅")
                  ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800"
                  : "bg-[rgba(0,0,0,0.04)] text-[var(--foreground)] border border-[rgba(255,255,255,0.03)]"
          }`}
        >
          <p className="text-sm font-medium break-words">{error || status}</p>
        </div>
      )}

      {/* Browser Info */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          🔒 Your biometric data never leaves your device
        </p>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}
