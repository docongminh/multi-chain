import * as _type from "./types";
import { Network } from "./Network";
import { SolanaWallet } from "@coreproject/wallets";
import { Connection } from "@solana/web3.js";
export default class SPL extends Network {
    _provider: Connection;
    constructor(web3_providers: _type.Web3Provider, network_info: _type.NetworkInfo);
    getContractMetadata(contractAddress: string): Promise<_type.Contract | null>;
    getProvider(): Connection;
    getBalance(address: string): Promise<string>;
    getTokenBalances(walletAddress: string): Promise<_type.TokenBalance[]>;
    checkAddress(address: string): boolean;
    onTransactionConfirmed(tx: string, callback: any): void;
    getExplorerUrl(type: string, value: string): string;
    signMessage(wallet: SolanaWallet, message: any): any;
}
