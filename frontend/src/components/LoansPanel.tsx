"use client";

import React, { useEffect, useState } from 'react';
import { signAndSubmitXdr } from '@/lib/stellar-advanced';
import { isFreighterAvailable, getFreighterPublicKey } from '@/lib/wallets';


interface Loan {
  id: string;
  amount: number;
  interest: number; // percent
  termMonths: number;
  borrower?: string;
  lender?: string;
  status: 'open' | 'requested' | 'funded' | 'repaid';
  createdAt: number;
  lastUpdated: number;
}

const STORAGE_KEY = 'logitec_loans_v1';

interface WalletStatus {
  connected: boolean;
  address?: string;
  error?: string;
}

function loadLoans(): Loan[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const loans = JSON.parse(raw);
    return loans.map((loan: any) => ({
      ...loan,
      status: loan.status as Loan['status'],
      createdAt: loan.createdAt || Date.now(),
      lastUpdated: loan.lastUpdated || Date.now()
    }));
  } catch {
    return [];
  }
}

function saveLoans(loans: Loan[]) {
  // Ensure all loans have the required properties before saving
  const validatedLoans = loans.map(loan => ({
    ...loan,
    status: loan.status as Loan['status'],
    createdAt: loan.createdAt || Date.now(),
    lastUpdated: Date.now()
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(validatedLoans));
}

export default function LoansPanel({ onClose }: { onClose?: () => void }) {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [creating, setCreating] = useState(false);
  const [amount, setAmount] = useState(100);
  const [interest, setInterest] = useState(5);
  const [term, setTerm] = useState(12);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [walletStatus, setWalletStatus] = useState<WalletStatus>({ connected: false });

  useEffect(() => {
    setLoans(loadLoans());
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (!isFreighterAvailable()) {
      setWalletStatus({ connected: false, error: 'Freighter no está instalado' });
      return;
    }

    try {
      const address = await getFreighterPublicKey();
      setWalletStatus({ connected: true, address });
    } catch (error: any) {
      setWalletStatus({ 
        connected: false, 
        error: `Error conectando con Freighter: ${error?.message || error}` 
      });
    }
  };

  const createLoan = async () => {
    if (!walletStatus.connected || !walletStatus.address) {
      setMessage('Por favor conecta tu wallet Freighter primero');
      return;
    }

    setLoadingAction('create');
    try {


      const timestamp = Date.now();
      const newLoan: Loan = {
        id: 'loan-' + timestamp,
        amount: Math.max(1, Math.floor(amount)),
        interest: Math.max(0, interest),
        termMonths: Math.max(1, Math.floor(term)),
        status: 'open' as const,
        lender: walletStatus.address,
        createdAt: timestamp,
        lastUpdated: timestamp
      };

      const currentLoans = loadLoans();
      saveLoans([...currentLoans, newLoan]);
      setLoans([...currentLoans, newLoan]);
      setCreating(false);
      setMessage('Préstamo creado exitosamente');
    } catch (error: any) {
      setMessage(`Error al crear el préstamo: ${error?.message || error}`);
    } finally {
      setLoadingAction(null);
    }

  };

  const requestLoan = async (loan: Loan) => {
    if (!walletStatus.connected || !walletStatus.address) {
      setMessage('Por favor conecta tu wallet Freighter primero');
      return;
    }

    setLoadingAction(`request-${loan.id}`);
    setMessage(null);
    try {


      // En un flujo de producción construiríamos una transacción Soroban aquí
      const fakeXdr = btoa(JSON.stringify({ 
        action: 'requestLoan', 
        loanId: loan.id,
        borrower: walletStatus.address 
      }));

      const result = await signAndSubmitXdr(fakeXdr);
      if (result.success) {
        const timestamp = Date.now();
        const updated = loans.map(l => 
          l.id === loan.id 
            ? { 
                ...l, 
                status: 'requested' as const,
                borrower: walletStatus.address,
                lastUpdated: timestamp 
              } 
            : l
        );
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

  const repayLoan = async (loan: Loan) => {
    if (!walletStatus.connected || !walletStatus.address) {
      setMessage('Por favor conecta tu wallet Freighter primero');
      return;
    }

    setLoadingAction(`repay-${loan.id}`);
    try {


      const timestamp = Date.now();
      const updated = loans.map(l => 
        l.id === loan.id 
          ? { ...l, status: 'repaid' as const, lastUpdated: timestamp }
          : l
      );
      setLoans(updated);
      saveLoans(updated);
      setMessage('Préstamo marcado como pagado exitosamente');
    } catch (error: any) {
      setMessage(`Error al procesar el pago: ${error?.message || error}`);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-xl shadow-2xl w-full max-w-4xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold">Plataforma de Préstamos — Demo</h3>
              <div className="text-sm text-gray-400">
                {walletStatus.connected ? (
                  <span className="text-green-400">Conectado: {walletStatus.address?.slice(0, 8)}...</span>
                ) : (
                  <span className="text-red-400">{walletStatus.error || 'No conectado'}</span>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {message && <div className="text-sm text-green-300 mr-2">{message}</div>}
              <button onClick={() => onClose && onClose()} className="px-3 py-1 bg-white/5 rounded">Cerrar</button>
            </div>
          </div>        <div className="grid md:grid-cols-2 gap-6">
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
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="text-sm font-medium">{loan.amount} XLM</div>
                      <div className={`text-xs px-2 py-0.5 rounded ${
                        loan.status === 'open' ? 'bg-blue-500/20 text-blue-300' :
                        loan.status === 'requested' ? 'bg-yellow-500/20 text-yellow-300' :
                        loan.status === 'funded' ? 'bg-green-500/20 text-green-300' :
                        'bg-purple-500/20 text-purple-300'
                      }`}>
                        {loan.status.toUpperCase()}
                      </div>
                    </div>
                    <div className="text-xs text-gray-300 mt-1">
                      <span className="inline-block mr-3">{loan.interest}% interés</span>
                      <span className="inline-block mr-3">{loan.termMonths} meses</span>
                      <span className="inline-block">
                        {new Date(loan.lastUpdated).toLocaleDateString()}
                      </span>
                    </div>
                    {(loan.lender || loan.borrower) && (
                      <div className="text-xs text-gray-400 mt-1">
                        {loan.lender && <span>Prestamista: {loan.lender.slice(0,8)}...</span>}
                        {loan.borrower && <span className="ml-2">Prestatario: {loan.borrower.slice(0,8)}...</span>}
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2 ml-4">
                    {loan.status === 'open' && (
                      <button 
                        onClick={() => requestLoan(loan)} 
                        disabled={loadingAction?.includes(loan.id)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-500 disabled:bg-green-600/50 rounded flex items-center"
                      >
                        {loadingAction?.includes(loan.id) ? (
                          <span className="animate-pulse">Procesando...</span>
                        ) : (
                          'Solicitar'
                        )}
                      </button>
                    )}
                    {loan.status === 'requested' && loan.borrower === walletStatus.address && (
                      <button 
                        onClick={() => repayLoan(loan)}
                        disabled={loadingAction?.includes(loan.id)}
                        className="px-3 py-1 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-600/50 rounded flex items-center"
                      >
                        {loadingAction?.includes(loan.id) ? (
                          <span className="animate-pulse">Procesando...</span>
                        ) : (
                          'Pagar'
                        )}
                      </button>
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
