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
  const { isSupported, createPasskey, authenticate, isLoading, error } = usePasskey();

  const handleRegister = async () => {
    if (!username.trim()) {
      setStatus("Por favor ingresa un usuario");
      return;
    }
    setStatus("Creando passkey...");
    const result = await createPasskey(username);
    if (result.success) {
      saveLocalKey(username);
      setLocalKey(username);
      setStatus("¡Listo! Acceso biométrico activado.");
    } else {
      setStatus(`Error: ${result.error}`);
    }
  };

  const handleAuthenticate = async () => {
    setStatus("Autenticando...");
    const result = await authenticate();
    if (result.success) {
      setStatus("");
      if (onLogin) {
        onLogin(result.userHandle || localKey || "");
      }
    } else {
      setStatus(`Error: ${result.error}`);
    }
  };

  if (!isSupported) {
    return (
      <div className="rounded-2xl p-8 bg-white/10 shadow-xl flex flex-col items-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold mb-4 text-blue-900">
            Passkeys no soportados
          </h2>
          <p className="leading-relaxed text-blue-700">
            Tu navegador no soporta Passkeys/WebAuthn.<br/>Prueba con Chrome, Safari o Edge modernos.
          </p>
          <p className="text-sm mt-4 text-blue-400">
            Usa HTTPS para máxima seguridad.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-8 max-w-md mx-auto mt-8 shadow-2xl bg-black/80 backdrop-blur-md border border-green-700 flex flex-col items-center">
      <div className="flex flex-col items-center w-full">
        <div className="text-5xl mb-2 text-green-400">🔑</div>
        <h2 className="text-2xl font-bold mb-2 text-green-300">Bienvenido</h2>
        <p className="text-green-200 mb-6 text-center">Accede con tu usuario y activa tu passkey biométrica.<br/>Rápido, seguro y sin contraseñas.</p>
        <input
          type="text"
          className="w-full px-4 py-2 rounded-lg border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 mb-4 bg-black/70 text-green-200 placeholder-green-400"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={!!localKey}
        />
        <div className="flex flex-col gap-3 w-full">
          {!localKey && (
            <button
              className="w-full py-2 rounded-lg bg-gradient-to-r from-green-600 to-blue-800 text-white font-bold shadow-md hover:from-green-700 hover:to-blue-900 transition-all"
              onClick={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? "Creando..." : "Crear Passkey"}
            </button>
          )}
          <button
            className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-900 to-green-600 text-white font-bold shadow-md hover:from-blue-800 hover:to-green-700 transition-all"
            onClick={handleAuthenticate}
            disabled={isLoading || (!localKey && !username)}
          >
            {isLoading ? "Autenticando..." : localKey ? "Entrar con Passkey" : "Entrar"}
          </button>
        </div>
        {status && (
          <div className="mt-4 text-center text-green-400 font-medium animate-pulse">
            {status}
          </div>
        )}
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
