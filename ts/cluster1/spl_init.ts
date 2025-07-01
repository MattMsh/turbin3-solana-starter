import { Keypair, Connection, Commitment } from '@solana/web3.js';
import { createMint } from '@solana/spl-token';
import wallet from '../turbin3-wallet.json';

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = 'confirmed';
const connection = new Connection('https://api.devnet.solana.com', commitment);
const DECIMALS = 6;
const mintKeypair = Keypair.generate();

(async () => {
  try {
    const mint = await createMint(
      connection,
      keypair,
      keypair.publicKey,
      keypair.publicKey,
      DECIMALS,
      mintKeypair
    );
    console.log(`Mint created: ${mint.toBase58()}`);
  } catch (error) {
    console.log(`Oops, something went wrong: ${error}`);
  }
})();
