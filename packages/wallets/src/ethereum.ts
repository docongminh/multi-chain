import { BaseWallet, BytesLike, Path } from './wallet';
import { Wallet } from '@ethersproject/wallet';
import { HDNode } from '@ethersproject/hdnode';

export class EthereumWallet extends BaseWallet {
  constructor(provider: any, derivePathStr: Path) {
    super(provider, derivePathStr);
  }

  get address(): string {
    return this._provider.address.toString();
  }

  connect(provider: any): EthereumWallet {
      return new EthereumWallet(this, provider)
  }

  static async walletFromSeed(
    seed: BytesLike,
    derivePathStr = "m/44'/60'/0'/0/0"
  ): Promise<EthereumWallet> {
    const provider = new Wallet(
      HDNode.fromSeed(seed).derivePath(derivePathStr)
    );
    return new EthereumWallet(provider, derivePathStr);
  }
}
