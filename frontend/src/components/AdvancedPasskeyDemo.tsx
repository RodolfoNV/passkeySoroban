import React from 'react';

export default function AdvancedPasskey() {
  return (
    <div>
      <p className="text-sm text-slate-600">Herramientas avanzadas para gestionar passkeys y debug.</p>
      <div className="mt-3 flex gap-2">
        <button className="px-3 py-2 border rounded">Exportar clave pública</button>
        <button className="px-3 py-2 border rounded">Forzar registro en contrato</button>
      </div>
      <p className="mt-2 text-xs text-slate-400">Aún por implementar: llamadas firmadas a Soroban y verificación on-chain.</p>
    </div>
  );
}
