import wallet from '../turbin3-wallet.json';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  createMetadataAccountV3,
  CreateMetadataAccountV3InstructionAccounts,
  CreateMetadataAccountV3InstructionArgs,
  DataV2Args,
  findMetadataPda,
  MPL_TOKEN_METADATA_PROGRAM_ID,
} from '@metaplex-foundation/mpl-token-metadata';
import {
  createSignerFromKeypair,
  signerIdentity,
  publicKey,
} from '@metaplex-foundation/umi';
import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';
import { PublicKey } from '@solana/web3.js';

// Define our Mint address
const mint = publicKey('CjW6hvCkdmURVPUoSpdLMPoXZ8qfGnBwxuR1PFqxhh9p');

// Create a UMI connection
const umi = createUmi('https://api.devnet.solana.com');
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(signer));

(async () => {
  try {
    const metadata_seeds = [
      Buffer.from('metadata'),
      new PublicKey(MPL_TOKEN_METADATA_PROGRAM_ID).toBuffer(),
      new PublicKey(mint).toBuffer(),
    ];
    const [metadata, _bump] = PublicKey.findProgramAddressSync(
      metadata_seeds,
      new PublicKey(MPL_TOKEN_METADATA_PROGRAM_ID)
    );
    // Alternative approach
    // const metadataUmi = findMetadataPda(
    //   { eddsa: umi.eddsa, programs: umi.programs },
    //   { mint }
    // );
    // console.log({ metadata, metadataUmi }); // SAME ADDRESS

    const accounts: CreateMetadataAccountV3InstructionAccounts = {
      mint,
      mintAuthority: signer,
      metadata: publicKey(metadata),
      updateAuthority: signer,
      payer: signer,
    };

    const data: DataV2Args = {
      name: 'Turbin3',
      symbol: 'TRB',
      uri: 'https://irys.xyz/',
      sellerFeeBasisPoints: 0,
      collection: null,
      creators: null,
      uses: null,
    };

    let args: CreateMetadataAccountV3InstructionArgs = {
      data,
      isMutable: true,
      collectionDetails: null,
    };

    let tx = createMetadataAccountV3(umi, {
      ...accounts,
      ...args,
    });

    let result = await tx.sendAndConfirm(umi);
    console.log(bs58.encode(result.signature));
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
