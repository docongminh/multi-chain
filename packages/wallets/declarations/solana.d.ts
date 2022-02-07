import { BaseWallet, BytesLike } from './wallet';
export declare class SolanaWallet extends BaseWallet {
    constructor(provider: any, derivePathStr: string);
    get address(): string;
    static walletFromSeed(seed: BytesLike, derivePathStr?: string): Promise<SolanaWallet>;
}
