"use client";

export function PasskeyInfo() {
  return (
    <div className="space-y-6">
      {/* Qué son los Passkeys */}
      <div className="glass rounded-2xl p-8 border border-blue-400">
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-blue-400">
          Logitec Passkeys
        </h3>
        <p className="mb-4 text-blue-200">
          Los passkeys son un método moderno sin contraseñas que utiliza <strong>criptografía de clave pública</strong> y autenticación biométrica.
        </p>
        <ul className="space-y-2 text-blue-200">
          <li><strong>Sin contraseñas:</strong> Usa Face ID, Touch ID o Windows Hello</li>
          <li><strong>Phishing-resistant:</strong> Las claves criptográficas están ligadas a dominios específicos</li>
          <li><strong>Sincronización segura:</strong> Compatible con iCloud Keychain y Google Password Manager</li>
        </ul>
      </div>

      {/* How it Works */}
      <div className="glass rounded-2xl p-8 border border-blue-400">
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-blue-400">Cómo funciona en Soroban</h3>
        <div className="space-y-4">
          <Step
            number="1"
            title="Register Passkey"
            description="Create a passkey using your device's biometric authentication (Face ID, Touch ID, etc.)"
          />
          <Step
            number="2"
            title="Store Public Key"
            description="The public key (secp256r1) is stored in the Soroban smart contract on Stellar blockchain"
          />
          <Step
            number="3"
            title="Authenticate"
            description="Sign transactions with your passkey - the contract verifies the signature using the stored public key"
          />
          <Step
            number="4"
            title="Execute Actions"
            description="Once authenticated, execute any contract function authorized by your account"
          />
        </div>
      </div>

      {/* Technical Details */}
      <div className="glass rounded-2xl p-8 border border-blue-400">
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-blue-400">Detalles técnicos</h3>
        <div className="space-y-3 text-sm">
          <DetailRow label="Algorithm" value="ES256 (secp256r1/P-256)" />
          <DetailRow
            label="Blockchain"
            value="Stellar (Soroban Smart Contracts)"
          />
          <DetailRow label="Authentication" value="WebAuthn Level 2" />
          <DetailRow
            label="Key Storage"
            value="Secure Enclave / TPM / Hardware Key"
          />
          <DetailRow label="Signature Size" value="64 bytes (r || s)" />
          <DetailRow label="Public Key" value="64 bytes (uncompressed)" />
        </div>
      </div>

      {/* Browser Support */}
      <div className="glass rounded-2xl p-8">
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span className="text-3xl">🌐</span>
          Navegadores compatibles
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <BrowserCard name="Chrome" version="67+" supported />
          <BrowserCard name="Safari" version="14+" supported />
          <BrowserCard name="Edge" version="18+" supported />
          <BrowserCard name="Firefox" version="60+" supported />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
          Requires HTTPS in production environments
        </p>
      </div>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
        {number}
      </div>
      <div>
        <h4 className="font-semibold text-gray-800 dark:text-white mb-1">
          {title}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {description}
        </p>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
      <span className="font-medium text-gray-700 dark:text-gray-300">
        {label}
      </span>
      <span className="text-gray-600 dark:text-gray-400 font-mono text-xs">
        {value}
      </span>
    </div>
  );
}

function BrowserCard({
  name,
  version,
  supported,
}: {
  name: string;
  version: string;
  supported: boolean;
}) {
  return (
    <div
      className={`p-4 rounded-lg border-2 ${
        supported
          ? "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20"
          : "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-gray-800 dark:text-white">{name}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">{version}</p>
        </div>
        <span className="text-2xl">{supported ? "✅" : "❌"}</span>
      </div>
    </div>
  );
}
