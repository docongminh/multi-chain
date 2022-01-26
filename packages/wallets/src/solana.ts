import { BaseWallet, BytesLike } from './wallet';
import { derivePath } from 'ed25519-hd-key';
import * as solanaWeb3 from '@solana/web3.js';

export class SolanaWallet extends BaseWallet {
  constructor(provider: any, derivePathStr: string) {
    super(provider, derivePathStr);
  }

  get address(): string {
    return this._provider.publicKey.toString();
  }

  static async walletFromSeed(
    seed: BytesLike,
    derivePathStr = "m/44'/501'/0'/0'"
  ): Promise<SolanaWallet> {
    // ERROR: Type 'Bytes' is not assignable to type 'string'
    // as type string to temporal fixed. Will check again
    const str_seed = seed as string;

    const _seed = derivePath(derivePathStr, str_seed).key as Uint8Array;
    const provider = solanaWeb3.Keypair.fromSeed(_seed);
    return new SolanaWallet(provider, derivePathStr);
  }
}
