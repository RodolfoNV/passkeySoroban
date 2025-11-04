// Utilities to detect and interact with browser Stellar wallets (Freighter)
// This file provides small, defensive wrappers so the app can offer
// an option to connect with the official Stellar wallet (Freighter).

export const FREIGHTER_INSTALL_URL = 'https://freighter.app/';

export function isFreighterAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  // Some versions expose `window.freighter` and newer ones `window.freighterApi`
  return !!((window as any).freighter || (window as any).freighterApi);
}

export async function getFreighterPublicKey(): Promise<string> {
  if (typeof window === 'undefined') throw new Error('No window');

  const freighter = (window as any).freighter || (window as any).freighterApi;
  if (!freighter) throw new Error('Freighter not available');

  // Try common methods defensively. Different Freighter versions and wrappers
  // may expose slightly different APIs; attempt the known ones.
  try {
    if (typeof freighter.getPublicKey === 'function') {
      const pk = await freighter.getPublicKey();
      return pk;
    }

    // Some freighter wrappers expose getAccount
    if (typeof freighter.getAccount === 'function') {
      const acc = await freighter.getAccount();
      // acc may be an object with accountId
      if (acc && typeof acc === 'object') return acc.accountId || acc.publicKey || '';
      if (typeof acc === 'string') return acc;
    }

    // Newer API may use request({ method: 'getPublicKey' }) style
    if (typeof freighter.request === 'function') {
      try {
        const resp = await freighter.request({ method: 'getPublicKey' });
        if (resp && resp.publicKey) return resp.publicKey;
        if (typeof resp === 'string') return resp;
      } catch (e) {
        // ignore and continue
      }
    }

    throw new Error('Freighter API not recognised or returned no public key');
  } catch (err: any) {
    throw new Error(`Failed to get Freighter public key: ${err?.message || String(err)}`);
  }
}

export function openFreighterInstallPage(): void {
  if (typeof window === 'undefined') return;
  window.open(FREIGHTER_INSTALL_URL, '_blank', 'noopener');
}

/**
 * Try to sign a transaction XDR using Freighter. Returns the signed XDR or throws.
 * This wrapper is defensive and attempts a few common Freighter APIs used by extensions.
 */
export async function signXdrWithFreighter(xdr: string, network: 'TESTNET' | 'PUBLIC' = 'TESTNET'): Promise<string> {
  if (typeof window === 'undefined') throw new Error('No window');
  const freighter = (window as any).freighter || (window as any).freighterApi;
  if (!freighter) throw new Error('Freighter not available');

  // Try known API shapes
  try {
    // Some Freighter versions expose signTransaction(xdr, network)
    if (typeof freighter.signTransaction === 'function') {
      const signed = await freighter.signTransaction(xdr, network);
      return signed.signedTransaction || signed.signedXDR || signed;
    }

    // Some expose request({ method: 'signTransaction', params: { transaction } })
    if (typeof freighter.request === 'function') {
      const resp = await freighter.request({ method: 'signTransaction', params: { transaction: xdr, network } });
      if (resp && (resp.signedTransaction || resp.signedXDR || resp.signed)) {
        return resp.signedTransaction || resp.signedXDR || resp.signed;
      }
      if (typeof resp === 'string') return resp;
    }

    // Older wrappers: signXDR
    if (typeof freighter.signXDR === 'function') {
      const signed = await freighter.signXDR(xdr);
      return signed;
    }

    throw new Error('No compatible Freighter signing API found');
  } catch (err: any) {
    throw new Error(`Freighter signing failed: ${err?.message || String(err)}`);
  }
}

