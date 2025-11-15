import { useState } from 'react';

type UsePasskeyReturn = {
  isRegistered: boolean;
  lastError?: string | null;
  registerPasskey: () => Promise<void>;
  signIn: () => Promise<void>;
};

export default function usePasskey(): UsePasskeyReturn {
  const [isRegistered, setIsRegistered] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  async function registerPasskey() {
    setLastError(null);
    if (!('credentials' in navigator) || !(navigator as any).credentials.create) {
      throw new Error('WebAuthn no soportado en este navegador');
    }

    const challenge = crypto.getRandomValues(new Uint8Array(32));

    const publicKey: PublicKeyCredentialCreationOptions = {
      challenge: challenge.buffer,
      rp: { name: 'Passkey Soroban Demo' },
      user: {
        id: Uint8Array.from(String(Date.now()), c => c.charCodeAt(0)),
        name: 'user@example.com',
        displayName: 'Demo User'
      },
      pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
      authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required' },
      timeout: 60000,
      attestation: 'none'
    };

    try {
      const cred = await (navigator as any).credentials.create({ publicKey });
      console.log('credential', cred);
      setIsRegistered(true);
    } catch (err: any) {
      setLastError(err?.message ?? String(err));
      throw err;
    }
  }

  async function signIn() {
    setLastError(null);
    if (!('credentials' in navigator) || !(navigator as any).credentials.get) {
      throw new Error('WebAuthn no soportado en este navegador');
    }

    const challenge = crypto.getRandomValues(new Uint8Array(32));
    const opts: PublicKeyCredentialRequestOptions = { challenge: challenge.buffer, timeout: 60000, userVerification: 'required' };

    try {
      const assertion = await (navigator as any).credentials.get({ publicKey: opts });
      console.log('assertion', assertion);
      return;
    } catch (err: any) {
      setLastError(err?.message ?? String(err));
      throw err;
    }
  }

  return { isRegistered, lastError, registerPasskey, signIn };
}
