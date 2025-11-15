// src/lib/soroban.ts
export type Loan = { id: string; amount: number; status: 'requested' | 'funded' | 'repaid' };

/**
 * requestLoan: placeholder that should call your Soroban contract.
 * Replace the internals with soroban-client or your backend call.
 */
export async function requestLoan(amount: number): Promise<void> {
  console.log('[soroban] requestLoan stub amount=', amount);
  // TODO: implement real call to contract (signed transaction)
  return;
}

/**
 * fetchLoans: placeholder that should read contract state or indexer.
 */
export async function fetchLoans(): Promise<Loan[]> {
  // Demo static data
  return [
    { id: '1', amount: 10, status: 'requested' },
    { id: '2', amount: 25, status: 'funded' }
  ];
}
  