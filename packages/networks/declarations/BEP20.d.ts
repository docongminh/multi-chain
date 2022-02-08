import { Wallet } from '@ethersproject/wallet';
import { Network } from "./Network";
import * as _type from "./types";
export default class BEP20 extends Network {
    _provider: any;
    constructor(config: _type.NetworkInfo);
    set provider(value: any);
    getContractMetadata(contractAddress: string): Promise<_type.Contract>;
    getProvider(): any;
    getBalance(address: string): Promise<string>;
    createTransactionOrder(wallet: Wallet, order: _type.OrderRequest): Promise<_type.TransactionRequest>;
    sendTransaction(wallet: Wallet, transactionRequest: _type.TransactionRequest): Promise<_type.TransactionResponse>;
    getTokenBalances(walletAddress: string): Promise<_type.TokenBalance[]>;
    checkAddress(address: string): boolean;
    onTransactionConfirmed(tx: string, callback: any): void;
    getExplorerUrl(type: string, value: string): string;
    signMessage(wallet: Wallet, message: string): any;
}
