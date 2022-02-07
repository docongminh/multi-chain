/// <reference types="node" />
declare type Bytes = ArrayLike<number>;
declare type BytesLike = Bytes | string;
declare type Path = string;
declare class BaseWallet {
    derivePath: Path;
    constructor(provider: any, derivePath: Path);
    _provider: any;
    get provider(): any;
    get address(): string;
    get publicKey(): void;
    connect(provider: any): BaseWallet;
    static walletFromSeed(seed: BytesLike, derivePath: Path): Promise<BaseWallet>;
    static mnemonicToSeed(mnemonic: string): Promise<Buffer>;
}

declare class EthereumWallet extends BaseWallet {
    constructor(provider: any, derivePathStr: Path);
    get address(): string;
    connect(provider: any): EthereumWallet;
    static walletFromSeed(seed: BytesLike, derivePathStr?: string): Promise<EthereumWallet>;
}

declare class SolanaWallet extends BaseWallet {
    constructor(provider: any, derivePathStr: string);
    get address(): string;
    static walletFromSeed(seed: BytesLike, derivePathStr?: string): Promise<SolanaWallet>;
}

export { BaseWallet, EthereumWallet, SolanaWallet };
