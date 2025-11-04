"use client";

import React, { useEffect, useState } from 'react';
import { signAndSubmitXdr } from '@/lib/stellar-advanced';

interface Loan {
  id: string;
  amount: number;
  interest: number; // percent
  termMonths: number;
  borrower?: string;
  status: 'open' | 'requested' | 'funded' | 'repaid';
}

const STORAGE_KEY = 'logitec_loans_v1';

function loadLoans(): Loan[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLoans(loans: Loan[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(loans));
}

export default function LoansPanel({ onClose }: { onClose?: () => void }) {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [creating, setCreating] = useState(false);
  const [amount, setAmount] = useState(100);
  const [interest, setInterest] = useState(5);
  const [term, setTerm] = useState(12);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setLoans(loadLoans());
  }, []);

  const createLoan = () => {
    const newLoan: Loan = {
      id: 'loan-' + Date.now(),
      amount: Math.max(1, Math.floor(amount)),
      interest: Math.max(0, interest),
      termMonths: Math.max(1, Math.floor(term)),
      status: 'open',
    };
    const next = [newLoan, ...loans];
    setLoans(next);
    saveLoans(next);
    setCreating(false);
  };

  const requestLoan = async (loan: Loan) => {
    setLoadingAction(loan.id);
    setMessage(null);
    try {
      // In a production flow we'd build a Soroban transaction XDR here.
      // For demo, we create a small payload and attempt to sign+submit via Freighter.
      const fakeXdr = btoa(JSON.stringify({ action: 'requestLoan', loanId: loan.id }));
      const result = await signAndSubmitXdr(fakeXdr);
      if (result.success) {
        const updated = loans.map(l => l.id === loan.id ? { ...l, status: 'requested', borrower: 'me' } : l);
        setLoans(updated);
        saveLoans(updated);
        setMessage('Solicitud enviada. TxHash: ' + (result.hash || 'n/a'));
      } else {
        setMessage('No se pudo firmar/enviar: ' + (result.error || 'unknown'));
      }
    } catch (err: any) {
      setMessage('Error: ' + (err?.message || String(err)));
    } finally {
      setLoadingAction(null);
    }
  };

  const repayLoan = (loan: Loan) => {
    const updated = loans.map(l => l.id === loan.id ? { ...l, status: 'repaid' } : l);
    setLoans(updated);
    saveLoans(updated);
    setMessage('Préstamo marcado como pagado');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-xl shadow-2xl w-full max-w-4xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Plataforma de Préstamos — Demo</h3>
          <div className="flex items-center space-x-2">
            {message && <div className="text-sm text-green-300 mr-2">{message}</div>}
            <button onClick={() => onClose && onClose()} className="px-3 py-1 bg-white/5 rounded">Cerrar</button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Crear Préstamo</h4>
            <div className="space-y-2">
              <label className="block text-sm">Monto</label>
              <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full p-2 rounded bg-black/20" />
              <label className="block text-sm">Interés (%)</label>
              <input type="number" value={interest} onChange={(e) => setInterest(Number(e.target.value))} className="w-full p-2 rounded bg-black/20" />
              <label className="block text-sm">Plazo (meses)</label>
              <input type="number" value={term} onChange={(e) => setTerm(Number(e.target.value))} className="w-full p-2 rounded bg-black/20" />
              <div className="flex space-x-2">
                <button onClick={createLoan} className="px-4 py-2 bg-blue-600 rounded">Crear</button>
                <button onClick={() => { setAmount(100); setInterest(5); setTerm(12); }} className="px-4 py-2 bg-white/5 rounded">Reset</button>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Préstamos Existentes</h4>
            <div className="space-y-3 max-h-64 overflow-auto">
              {loans.length === 0 && <p className="text-sm text-gray-300">No hay préstamos aún.</p>}
              {loans.map(loan => (
                <div key={loan.id} className="p-3 bg-black/20 rounded flex items-center justify-between">
                  <div>
                    <div className="text-sm">{loan.id}</div>
                    <div className="text-xs text-gray-300">{loan.amount} — {loan.interest}% — {loan.termMonths} meses</div>
                    <div className="text-xs text-yellow-300">Status: {loan.status}</div>
                  </div>
                  <div className="flex space-x-2">
                    {loan.status === 'open' && (
                      <button onClick={() => requestLoan(loan)} disabled={loadingAction===loan.id} className="px-3 py-1 bg-green-600 rounded">Solicitar</button>
                    )}
                    {loan.status === 'requested' && (
                      <button onClick={() => repayLoan(loan)} className="px-3 py-1 bg-purple-600 rounded">Marcar pagado</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
