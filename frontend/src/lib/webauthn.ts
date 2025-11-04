/**
 * WebAuthn/Passkey utilities for browser-side authentication
 * Implements ES256 (secp256r1) signature generation for Soroban
 */

import type { PasskeyResult } from "@/hooks/usePasskey";

/**
 * Check if the browser supports WebAuthn
 */
export function browserSupportsWebAuthn(): boolean {
  return (
    typeof window !== "undefined" &&
    window.PublicKeyCredential !== undefined &&
    typeof window.PublicKeyCredential === "function"
  );
}

/**
 * Generate a random challenge for authentication
 */
function generateChallenge(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(32));
}

/**
 * Generate a random user ID
 */
function generateUserId(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(16));
}

/**
 * Convert a Uint8Array to a base64url string
 */
function bufferToBase64Url(buffer: Uint8Array): string {
  // Avoid spread on Uint8Array (downlevelIteration issues). Build string manually.
  let binary = "";
  for (let i = 0; i < buffer.length; i++) {
    binary += String.fromCharCode(buffer[i]);
  }
  const base64 = btoa(binary);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

/**
 * Convert a base64url string to a Uint8Array
 */
function base64UrlToBuffer(base64url: string): Uint8Array {
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

// Helper to produce a proper ArrayBuffer (exact slice) from a Uint8Array
function toArrayBuffer(u8: Uint8Array): ArrayBuffer {
  // Create a fresh ArrayBuffer and copy bytes to ensure the returned value is a real ArrayBuffer
  const ab = new ArrayBuffer(u8.byteLength);
  const view = new Uint8Array(ab);
  view.set(u8);
  return ab;
}

/**
 * Extract the public key from the credential response
 * Converts from COSE format to raw secp256r1 coordinates
 */
function extractPublicKey(credential: PublicKeyCredential): Uint8Array {
  const response = credential.response as AuthenticatorAttestationResponse;
  
  // Get the attestation object
  const attestationObject = response.attestationObject;
  
  // For simplicity, we'll extract from the raw public key bytes
  // In production, you'd want to properly parse the COSE key
  // This is a simplified version for demonstration
  
  // The public key is in the attestation object's authData
  // For now, return a placeholder - you'd need a COSE decoder in production
  const publicKeyBytes = new Uint8Array(64); // 32 bytes X + 32 bytes Y
  
  return publicKeyBytes;
}

/**
 * Start passkey registration (creation)
 */
export async function startRegistration(
  username: string
): Promise<PasskeyResult> {
  try {
    const challenge = generateChallenge();
    const userId = generateUserId();

    // Use module-level toArrayBuffer helper

    // Create credential options
    // Build RP object carefully: avoid forcing rp.id when running on localhost or unknown hosts
    const hostname = typeof window !== "undefined" ? window.location.hostname : "localhost";
  const rpObj: any = { name: "Logitec" };
    if (hostname && hostname !== "localhost" && !/^[0-9.]+$/.test(hostname)) {
      // Only set rp.id for proper hostnames (avoid IPs and localhost during dev)
      rpObj.id = hostname;
    }

    const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
      challenge: toArrayBuffer(challenge),
      rp: rpObj,
      user: {
        id: toArrayBuffer(userId),
        name: username,
        displayName: username,
      },
      pubKeyCredParams: [
        {
          type: "public-key",
          alg: -7, // ES256 (secp256r1)
        },
      ],
      // Prefer more permissive options for local/dev to avoid platform-only errors
      authenticatorSelection: {
        // Let the browser choose the authenticator attachment (platform vs cross-platform)
        // and don't require resident keys by default.
        residentKey: "discouraged",
        userVerification: "preferred",
      },
      timeout: 60000,
      attestation: "none",
    };

    // Create the credential
    const credential = (await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions,
    })) as PublicKeyCredential | null;

    if (!credential) {
      return { success: false, error: "Failed to create credential" };
    }

    // Extract the public key and credential ID
    const credentialId = bufferToBase64Url(new Uint8Array(credential!.rawId));
    const publicKey = extractPublicKey(credential);

    // Store credential ID in localStorage for later authentication
    if (typeof window !== "undefined") {
      const credentials =
        JSON.parse(localStorage.getItem("passkey-credentials") || "[]") || [];
      credentials.push({
        credentialId,
        username,
        userId: bufferToBase64Url(userId),
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("passkey-credentials", JSON.stringify(credentials));
    }

    return {
      success: true,
      credentialId,
      publicKey,
    };
  } catch (error) {
    console.error("Registration error:", error);
    
    if (error instanceof Error) {
      // Map common DOMException/WebAuthn messages to friendlier explanations
      if (error.name === "NotAllowedError" || /not allowed|timed out|operation either timed out/i.test(error.message)) {
        return {
          success: false,
          error:
            "Operación no permitida o tiempo agotado. Asegúrate de ejecutar desde HTTPS/localhost, tener interacción del usuario y que el sitio coincide con el autenticador. Más info: https://www.w3.org/TR/webauthn-2/#sctn-privacy-considerations-client",
        };
      }
      if (error.name === "InvalidStateError") {
        return {
          success: false,
          error: "Este autenticador ya está registrado",
        };
      }
      return { success: false, error: error.message };
    }

    return { success: false, error: "Error desconocido" };
  }
}

/**
 * Start passkey authentication
 */
export async function startAuthentication(): Promise<PasskeyResult> {
  try {
    const challenge = generateChallenge();

    // Get stored credentials
    const storedCredentials =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("passkey-credentials") || "[]")
        : [];

    if (storedCredentials.length === 0) {
      return {
        success: false,
        error: "No passkeys found. Please create one first.",
      };
    }

    // Prepare credential IDs for authentication
    // Prepare allowCredentials ensuring ids are passed as ArrayBuffer slices
    const allowCredentials = storedCredentials.map((cred: { credentialId: string }) => {
      const idU8 = base64UrlToBuffer(cred.credentialId);
      const idBuf = idU8.buffer.slice(idU8.byteOffset, idU8.byteOffset + idU8.byteLength);
      return {
        type: "public-key" as const,
        id: idBuf,
      };
    });

    // Create assertion options
    // Build rpId similarly to creation: avoid forcing it on localhost/IPs
    const hostname = typeof window !== "undefined" ? window.location.hostname : "localhost";
    const rpId = hostname && hostname !== "localhost" && !/^[0-9.]+$/.test(hostname) ? hostname : undefined;

    const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
      challenge: toArrayBuffer(challenge),
      allowCredentials,
      timeout: 60000,
      userVerification: "preferred",
      ...(rpId ? { rpId } : {}),
    };

    // Get the credential (authenticate)
    const credential = (await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions,
    })) as PublicKeyCredential;

    if (!credential) {
      return { success: false, error: "Authentication failed" };
    }

    const response = credential.response as AuthenticatorAssertionResponse;
    
    // Extract signature and other data
    const credentialId = bufferToBase64Url(new Uint8Array(credential.rawId));
    const signature = new Uint8Array(response.signature);
    const userHandle = response.userHandle
      ? bufferToBase64Url(new Uint8Array(response.userHandle))
      : undefined;

    // Find the matching credential
    const matchedCred = storedCredentials.find(
      (cred: { credentialId: string }) => cred.credentialId === credentialId
    );

    return {
      success: true,
      credentialId,
      signature,
      userHandle: matchedCred?.username || userHandle,
    };
  } catch (error) {
    console.error("Authentication error:", error);
    
    if (error instanceof Error) {
      if (error.name === "NotAllowedError" || /not allowed|timed out|operation either timed out/i.test(error.message)) {
        return {
          success: false,
          error:
            "Operación no permitida o tiempo agotado. Asegúrate de interacción del usuario, credenciales registradas y ejecutar desde HTTPS/localhost. Más: https://www.w3.org/TR/webauthn-2/#sctn-privacy-considerations-client",
        };
      }
      return { success: false, error: error.message };
    }

    return { success: false, error: "Error desconocido" };
  }
}

/**
 * Get all stored credentials
 */
export function getStoredCredentials(): Array<{
  credentialId: string;
  username: string;
  userId: string;
  createdAt: string;
}> {
  if (typeof window === "undefined") return [];
  
  try {
    return JSON.parse(localStorage.getItem("passkey-credentials") || "[]");
  } catch {
    return [];
  }
}
// Guardar y recuperar la llave localmente en el navegador
export function saveLocalKey(key: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('logitec_local_key', key);
  }
}

export function getLocalKey(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('logitec_local_key');
  }
  return null;
}

/**
 * Clear all stored credentials
 */
export function clearStoredCredentials(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("passkey-credentials");
  }
}
