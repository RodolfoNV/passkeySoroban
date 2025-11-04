/**
 * Stellar/Soroban integration utilities
 * Handles contract interactions and transaction signing with passkeys
 */

import * as StellarSdk from "@stellar/stellar-sdk";

// Contract configuration
const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;
const RPC_URL = "https://soroban-testnet.stellar.org";

/**
 * Initialize Soroban client
 */
export function initializeSorobanClient() {
  return new StellarSdk.SorobanRpc.Server(RPC_URL);
}

/**
 * Deploy the passkey account contract
 */
export async function deployPasskeyContract(
  wasmBytes: Buffer,
  sourceKeypair: StellarSdk.Keypair
): Promise<string> {
  const server = initializeSorobanClient();

  // Build the transaction to upload the contract
  const account = await server.getAccount(sourceKeypair.publicKey());
  
  const uploadTx = new StellarSdk.TransactionBuilder(account, {
    fee: "100000",
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      StellarSdk.Operation.uploadContractWasm({
        wasm: wasmBytes,
      })
    )
    .setTimeout(30)
    .build();

  uploadTx.sign(sourceKeypair);

  const uploadResult = await server.sendTransaction(uploadTx);
  
  // Wait for confirmation
  let uploadResponse = await server.getTransaction(uploadResult.hash);
  while (uploadResponse.status === "NOT_FOUND") {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    uploadResponse = await server.getTransaction(uploadResult.hash);
  }

  if (uploadResponse.status !== "SUCCESS") {
    throw new Error("Contract upload failed");
  }

  // Get the wasm hash from the result (SDKs may return different shapes)
  const wasmHashRaw = (uploadResponse as any).returnValue || (uploadResponse as any).wasmHash;
  const wasmHash = wasmHashRaw
    ? Buffer.isBuffer(wasmHashRaw)
      ? wasmHashRaw
      : Buffer.from(wasmHashRaw)
    : Buffer.alloc(0);

  // Deploy the contract
  const deployTx = new StellarSdk.TransactionBuilder(account, {
    fee: "100000",
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      StellarSdk.Operation.createCustomContract({
        wasmHash,
        address: new StellarSdk.Address(sourceKeypair.publicKey()),
      })
    )
    .setTimeout(30)
    .build();

  deployTx.sign(sourceKeypair);

  const deployResult = await server.sendTransaction(deployTx);
  
  let deployResponse = await server.getTransaction(deployResult.hash);
  while (deployResponse.status === "NOT_FOUND") {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    deployResponse = await server.getTransaction(deployResult.hash);
  }

  if (deployResponse.status !== "SUCCESS") {
    throw new Error("Contract deployment failed");
  }

  // Extract contract ID from the result
  const contractId = deployResponse.returnValue?.toString() || "";
  
  return contractId;
}

/**
 * Initialize a passkey account contract
 */
export async function initializePasskeyAccount(
  contractId: string,
  publicKey: Uint8Array,
  credentialId: string | null,
  sourceKeypair: StellarSdk.Keypair
): Promise<boolean> {
  const server = initializeSorobanClient();
  const account = await server.getAccount(sourceKeypair.publicKey());

  // Build the contract invocation
  const contract = new StellarSdk.Contract(contractId);
  
  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: "100000",
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      contract.call(
        "init",
        StellarSdk.xdr.ScVal.scvBytes(Buffer.from(publicKey)),
        credentialId
          ? StellarSdk.xdr.ScVal.scvBytes(Buffer.from(credentialId))
          : StellarSdk.xdr.ScVal.scvVoid()
      )
    )
    .setTimeout(30)
    .build();

  tx.sign(sourceKeypair);

  const result = await server.sendTransaction(tx);
  
  let response = await server.getTransaction(result.hash);
  while (response.status === "NOT_FOUND") {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    response = await server.getTransaction(result.hash);
  }

  return response.status === "SUCCESS";
}

/**
 * Get the owner's public key from the contract
 */
export async function getOwnerPublicKey(
  contractId: string
): Promise<Uint8Array | null> {
  const server = initializeSorobanClient();
  const contract = new StellarSdk.Contract(contractId);

  try {
    // Simulate the call to get the owner
    const result = await server.simulateTransaction(
      new StellarSdk.TransactionBuilder(
        new StellarSdk.Account(
          "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF",
          "0"
        ),
        {
          fee: "100",
          networkPassphrase: NETWORK_PASSPHRASE,
        }
      )
        .addOperation(contract.call("get_owner"))
        .setTimeout(30)
        .build()
    );

    // Some SDK versions put the returned values in different fields; cast to any for safety
    const anyResult: any = result;
    const possibleBytes = anyResult.result || anyResult.return_value || anyResult.returnValue || anyResult.xdr;
    if (possibleBytes) {
      const raw = Buffer.isBuffer(possibleBytes) ? possibleBytes : Buffer.from(possibleBytes);
      return new Uint8Array(raw);
    }

    return null;
  } catch (error) {
    console.error("Error getting owner:", error);
    return null;
  }
}

/**
 * Sign a transaction using a passkey signature
 */
export function signWithPasskey(
  transaction: StellarSdk.Transaction,
  signature: Uint8Array
): StellarSdk.Transaction {
  // In a real implementation, you would:
  // 1. Get the transaction hash that was signed by the passkey
  // 2. Attach the signature to the transaction's custom account auth
  // 3. Return the signed transaction
  
  // For now, this is a placeholder
  return transaction;
}

/**
 * Submit a passkey-signed transaction
 */
export async function submitPasskeyTransaction(
  contractId: string,
  functionName: string,
  args: StellarSdk.xdr.ScVal[],
  signature: Uint8Array
): Promise<boolean> {
  const server = initializeSorobanClient();
  
  // Build the transaction
  const contract = new StellarSdk.Contract(contractId);
  const contractAddress = new StellarSdk.Address(contractId);
  
  const tx = new StellarSdk.TransactionBuilder(
    new StellarSdk.Account(contractAddress.toString(), "0"),
    {
      fee: "100000",
      networkPassphrase: NETWORK_PASSPHRASE,
    }
  )
    .addOperation(contract.call(functionName, ...args))
    .setTimeout(30)
    .build();

  // Sign with passkey signature
  const signedTx = signWithPasskey(tx, signature);

  // Submit the transaction
  const result = await server.sendTransaction(signedTx);
  
  let response = await server.getTransaction(result.hash);
  while (response.status === "NOT_FOUND") {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    response = await server.getTransaction(result.hash);
  }

  return response.status === "SUCCESS";
}

/**
 * Utility: Convert hex string to bytes
 */
export function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Utility: Convert bytes to hex string
 */
export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
