import wallet from '../turbin3-wallet.json';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  createSignerFromKeypair,
  signerIdentity,
} from '@metaplex-foundation/umi';
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys';

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader({ address: 'https://devnet.irys.xyz/' }));
umi.use(signerIdentity(signer));

(async () => {
  try {
    // Follow this JSON structure
    // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure
    const image =
      'https://gateway.irys.xyz/Bzf7qofQNeKBDedhCcGD7TxT6y6dHGdkNZUgCmPbvBt4';
    const metadata = {
      name: 'Turbin3',
      symbol: 'T3',
      description: 'Turbin3 Q3 Cohort NFT',
      image,
      attributes: [{ trait_type: 'boosted', value: 'true' }],
      properties: {
        files: [
          {
            type: 'image/png',
            uri: 'https://gateway.irys.xyz/Bzf7qofQNeKBDedhCcGD7TxT6y6dHGdkNZUgCmPbvBt4',
          },
        ],
        category: 'image',
      },
    };

    const myUri = await umi.uploader.uploadJson(metadata);
    console.log('Your metadata URI: ', myUri);
  } catch (error) {
    console.log('Oops.. Something went wrong', error);
  }
})();
