import * as Bip39 from 'bip39';

///////////////////////////////
// Exported Types
export type Bytes = ArrayLike<number>;

export type BytesLike = Bytes | string;

export type Path = string;

// Export wallet base class

export class BaseWallet {
  derivePath: Path;

  constructor(provider: any, derivePath: Path) {
    this._provider = provider;
    this.derivePath = derivePath;
  }

  _provider: any;

  get provider() {
    return this._provider;
  }

  get address(): string {
    throw new Error('Abstract Method has no implementation');
  }

  get publicKey() {
    throw new Error('Abstract Method has no implementation');
  }
  connect(provider: any): BaseWallet{
    throw new Error('Abstract Method has no implementation');
  }
  static async walletFromSeed(
    seed: BytesLike,
    derivePath: Path
  ): Promise<BaseWallet> {
    throw new Error('Abstract Method has no implementation');
  }

  static async mnemonicToSeed(mnemonic: string) {
    if (!Bip39.validateMnemonic(mnemonic)) {
      throw new Error('Invalid seed words');
    }
    return await Bip39.mnemonicToSeed(mnemonic);
  }
}
