/**
 * Mock de Stellar/Soroban para desarrollo local sin contrato wasm.
 * Guarda datos en localStorage y simula respuestas.
 */

const STORAGE_KEY = 'soroban-mock-state';

type MockState = {
  contracts: Record<string, { ownerPublicKey?: string }>
}

function readState(): MockState {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') as any;
    if (!raw || typeof raw !== 'object') return { contracts: {} };
    if (!raw.contracts || typeof raw.contracts !== 'object') raw.contracts = {};
    return raw as MockState;
  } catch {
    return { contracts: {} };
  }
}

function writeState(state: MockState) {
  try {
    const normalized: any = { contracts: {} };
    if (state && typeof state === 'object' && state.contracts && typeof state.contracts === 'object') {
      normalized.contracts = state.contracts;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  } catch (e) {
    console.warn('stellar-mock: failed to write state', e);
  }
}

// Minimal Keypair shim for dev (avoids importing @stellar/stellar-sdk in the browser)
export class Keypair {
  private _secret: string;
  private constructor(secret: string) { this._secret = secret; }

  static random(): Keypair {
    // Create a pseudo-secret (not secure, for dev only)
    const rnd = Array.from(crypto.getRandomValues(new Uint8Array(16))).map(b => b.toString(16).padStart(2,'0')).join('');
    return new Keypair('S' + rnd);
  }

  static fromSecret(secret: string): Keypair {
    return new Keypair(secret);
  }

  secret(): string { return this._secret; }

  publicKey(): string { return 'GMOCK' + this._secret.slice(0,8); }
}

function toHex(u8: Uint8Array) {
  return Array.from(u8).map(b => b.toString(16).padStart(2,'0')).join('');
}

export async function deployWebAuthnAccount(
  bundlerKey: Keypair,
  contractSalt: Uint8Array | ArrayBuffer | Buffer,
  publicKey: Uint8Array | ArrayBuffer | Buffer
): Promise<string> {
  const state = readState();
  // Ensure contracts map exists
  if (!state.contracts) state.contracts = {};
  // Generate a fake contract id
  const id = 'GMOCK' + Date.now().toString(16);
  const pubU8 = publicKey instanceof Uint8Array ? publicKey : new Uint8Array(publicKey as any);
  state.contracts[id] = { ownerPublicKey: toHex(pubU8) };
  console.log('stellar-mock: deployWebAuthnAccount created', id);
  writeState(state);
  return id;
}

export async function buildAuthTransaction(
  bundlerKey: Keypair,
  accountContractId: string,
  challenge: Uint8Array | ArrayBuffer | Buffer
): Promise<{ authHash: Uint8Array; lastLedger: number }> {
  const c = challenge instanceof Uint8Array ? challenge : new Uint8Array(challenge as any);
  return { authHash: c, lastLedger: 12345 };
}

export async function processWebAuthnSignature(
  accountContractId: string,
  webAuthnSignature: { authenticatorData: string; clientDataJSON: string; signature: string }
): Promise<any> {
  return { success: true, transactionId: 'mock-tx-' + Date.now(), accountAddress: accountContractId };
}

export async function getOwnerPublicKey(contractId: string): Promise<Uint8Array | null> {
  const state = readState();
  const c = state.contracts[contractId];
  if (!c || !c.ownerPublicKey) return null;
  // parse hex
  const hex = c.ownerPublicKey;
  const bytes = new Uint8Array(hex.length/2);
  for (let i=0;i<bytes.length;i++) bytes[i]=parseInt(hex.substr(i*2,2),16);
  return bytes;
}

export async function submitPasskeyTransaction(
  contractId: string,
  functionName: string,
  args: any[],
  signature: Uint8Array
): Promise<boolean> {
  return true;
}

export const validateStellarConfig = () => ({ rpcUrl: 'mock', networkPassphrase: 'mock', contractId: 'mock' });
