import {
  Commitment,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from '@solana/web3.js';
import wallet from '../turbin3-wallet.json';
import { getOrCreateAssociatedTokenAccount, transfer } from '@solana/spl-token';

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = 'confirmed';
const connection = new Connection('https://api.devnet.solana.com', commitment);

// Mint address
const mint = new PublicKey('CjW6hvCkdmURVPUoSpdLMPoXZ8qfGnBwxuR1PFqxhh9p');

// Recipient address
const to = new PublicKey('5QPM3D5NS2A82BAPV7BgHhR3dsxuq71Nu81XxDbVGpwK'); // Test key

(async () => {
  try {
    // Get the token account of the fromWallet address, and if it does not exist, create it
    const fromAta = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      keypair.publicKey
    );

    // Get the token account of the toWallet address, and if it does not exist, create it
    const toAta = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      to
    );

    // Transfer the new token to the "toTokenAccount" we just created
    const transferTx = await transfer(
      connection,
      keypair,
      fromAta.address,
      toAta.address,
      keypair,
      100n
    );
    console.log(`Transaction signature: ${transferTx}`);
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
