
// Wrapper que delega en stellar-mock durante desarrollo y carga stellar-advanced en producción.
const useMock = process.env.NEXT_PUBLIC_USE_MOCK === '1' || process.env.NODE_ENV !== 'production';

import * as StellarMock from './stellar-mock';

// Re-export Keypair shim or real one depending on environment
export const Keypair = StellarMock.Keypair;

// Helper to dynamically import the advanced implementation when needed (only in prod).
async function getAdvanced() {
  // dynamic import so bundlers don't include it in dev builds
  const m = await import('./stellar-advanced');
  return m;
}

export async function deployWebAuthnAccount(bundlerKey: any, contractSalt: any, publicKey: any): Promise<string> {
  if (useMock) return StellarMock.deployWebAuthnAccount(bundlerKey as any, contractSalt as any, publicKey as any);
  const adv = await getAdvanced();
  return adv.deployWebAuthnAccount(bundlerKey as any, contractSalt as any, publicKey as any);
}

export async function buildAuthTransaction(bundlerKey: any, accountContractId: string, challenge: any) {
  if (useMock) return StellarMock.buildAuthTransaction(bundlerKey as any, accountContractId, challenge as any);
  const adv = await getAdvanced();
  return adv.buildAuthTransaction(bundlerKey as any, accountContractId, challenge as any);
}

export async function processWebAuthnSignature(accountContractId: string, webAuthnSignature: any) {
  if (useMock) return StellarMock.processWebAuthnSignature(accountContractId, webAuthnSignature);
  const adv = await getAdvanced();
  return adv.processWebAuthnSignature(accountContractId, webAuthnSignature);
}

export async function getOwnerPublicKey(contractId: string) {
  // getOwnerPublicKey is only available in the mock helper; return null in prod wrapper
  if (useMock) return StellarMock.getOwnerPublicKey(contractId);
  return null;
}

export async function submitPasskeyTransaction(contractId: string, functionName: string, args: any[], signature: any) {
  if (useMock) return StellarMock.submitPasskeyTransaction(contractId, functionName, args, signature);
  // No direct equivalent in advanced; throw to indicate unsupported in this wrapper
  throw new Error('submitPasskeyTransaction no implementado en implementación avanzada');
}

export function validateStellarConfig() {
  if (useMock) return StellarMock.validateStellarConfig();
  // In production, synchronous validation from advanced
  // Note: advanced validateStellarConfig is synchronous
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  return (require('./stellar-advanced') as any).validateStellarConfig();
}

