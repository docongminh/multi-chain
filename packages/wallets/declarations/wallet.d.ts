/// <reference types="node" />
export declare type Bytes = ArrayLike<number>;
export declare type BytesLike = Bytes | string;
export declare type Path = string;
export declare class BaseWallet {
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
