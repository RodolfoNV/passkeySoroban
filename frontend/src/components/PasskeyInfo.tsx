"use client";

import React, { useState } from 'react';
import usePasskey from '../hooks/usePasskey';

export default function PasskeyInfo() {
  const { isRegistered, registerPasskey, signIn, lastError } = usePasskey();
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    setLoading(true);
    try {
      await registerPasskey();
      alert('Passkey registrada (demo).');
    } catch (e) {
      console.error(e);
      alert('Error: ' + (e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignIn() {
    setLoading(true);
    try {
      await signIn();
      alert('Autenticado con passkey (demo).');
    } catch (e) {
      console.error(e);
      alert('Error: ' + (e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-medium">Estado</div>
          <div className="text-sm text-slate-600">{isRegistered ? 'Passkey registrada' : 'No registrada'}</div>
        </div>
      </div>
      <div className="flex gap-2">
        <button disabled={loading} onClick={handleRegister} className="px-4 py-2 bg-indigo-600 text-white rounded">
          Registrar Passkey
        </button>
        <button disabled={loading} onClick={handleSignIn} className="px-4 py-2 border rounded">
          Iniciar sesión (passkey)
        </button>
      </div>
      {lastError && <div className="text-sm text-red-600">Error: {lastError}</div>}
    </div>
  );
}
