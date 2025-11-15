import { Server, Keypair, TransactionBuilder, Networks, Operation, Asset } from 'stellar-sdk';

const HORIZON = process.env.NEXT_PUBLIC_HORIZON || 'https://horizon-testnet.stellar.org';
export const server = new Server(HORIZON);

export function createKeypairFromSecret(secret: string) {
  return Keypair.fromSecret(secret);
}

export async function buildPaymentTx(fromSecret: string, to: string, amount: string) {
  const kp = Keypair.fromSecret(fromSecret);
  const account = await server.loadAccount(kp.publicKey());
  const tx = new TransactionBuilder(account, { fee: '100', networkPassphrase: Networks.TESTNET })
    .addOperation(Operation.payment({ destination: to, asset: Asset.native(), amount }))
    .setTimeout(180)
    .build();
  tx.sign(kp);
  const txHash = await server.submitTransaction(tx);
  return txHash;
}
