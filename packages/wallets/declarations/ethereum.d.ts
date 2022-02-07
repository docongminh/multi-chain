import { BaseWallet, BytesLike, Path } from './wallet';
export declare class EthereumWallet extends BaseWallet {
    constructor(provider: any, derivePathStr: Path);
    get address(): string;
    connect(provider: any): EthereumWallet;
    static walletFromSeed(seed: BytesLike, derivePathStr?: string): Promise<EthereumWallet>;
}
