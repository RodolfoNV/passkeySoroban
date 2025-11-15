import React, { useState } from 'react';
import { requestLoan, fetchLoans } from '../lib/soroban';

type Loan = { id: string; amount: number; status: 'requested' | 'funded' | 'repaid' };

export default function LoanPanel() {
  const [amount, setAmount] = useState<number>(10);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadLoans() {
    setLoading(true);
    try {
      const data = await fetchLoans();
      setLoans(data);
    } catch (e) {
      console.error(e);
      alert('Error cargando préstamos');
    } finally {
      setLoading(false);
    }
  }

  async function handleRequestLoan() {
    setLoading(true);
    try {
      await requestLoan(amount);
      alert('Solicitud enviada (simulada).');
      await loadLoans();
    } catch (e) {
      console.error(e);
      alert('Error al solicitar préstamo');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4 space-y-4">
      <div className="flex gap-2">
        <input type="number" className="border p-2 rounded" value={amount} min={1} onChange={(e) => setAmount(Number(e.target.value))} />
        <button onClick={handleRequestLoan} className="px-4 py-2 bg-green-600 text-white rounded">Solicitar préstamo</button>
        <button onClick={loadLoans} className="px-4 py-2 border rounded">Cargar préstamos</button>
      </div>

      <div>
        {loading && <div>Buscando...</div>}
        <ul className="space-y-2 mt-3">
          {loans.map((l) => (
            <li key={l.id} className="p-3 border rounded flex justify-between">
              <div>
                <div className="font-medium">Préstamo {l.id}</div>
                <div className="text-sm text-slate-600">Cantidad: {l.amount} XLM</div>
              </div>
              <div className="text-sm">{l.status}</div>
            </li>
          ))}
          {!loans.length && <div className="text-sm text-slate-500">No hay préstamos.</div>}
        </ul>
      </div>
    </div>
  );
}
