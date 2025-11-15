/**
 * Librería mínima para interactuar con contratos Soroban.
 * Estas funciones son stubs/demo. Reemplaza por llamadas reales (soroban-client)
 */

export async function requestLoan(amount: number): Promise<void> {
  console.log('Simulando requestLoan', amount);
  // TODO: implementar llamada al contrato Soroban
  return;
}

export async function fetchLoans(): Promise<{ id: string; amount: number; status: 'requested'|'funded'|'repaid' }[]> {
  return [
    { id: '1', amount: 10, status: 'requested' },
    { id: '2', amount: 25, status: 'funded' }
  ];
}
