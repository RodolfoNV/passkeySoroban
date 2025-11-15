import React from 'react';
import PasskeyInfo from './PasskeyInfo';
import LoanPanel from './LoanPanel';
import AdvancedPasskey from './AdvancedPasskey';

export default function Dashboard(): JSX.Element {
  return (
    <div className="space-y-6">
      <section className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold">Wallet Stellar</h2>
        <p className="text-sm text-slate-600">Conecta tu passkey para gestionar tu wallet.</p>
        <PasskeyInfo />
      </section>

      <section className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold">Préstamos</h2>
        <LoanPanel />
      </section>

      <section className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold">Avanzado</h2>
        <AdvancedPasskey />
      </section>
    </div>
  );
}
