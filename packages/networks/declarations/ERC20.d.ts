import { Wallet } from '@ethersproject/wallet';
import * as _type from "./types";
import { Network } from "./Network";
export default class ERC20 extends Network {
    _provider: any;
    constructor(web3_providers: _type.Web3Provider, network_info: _type.NetworkInfo);
    set provider(value: any);
    getContractMetadata(contractAddress: string): Promise<_type.Contract>;
    getProvider(): any;
    getBalance(address: string): Promise<string>;
    getSigner(wallet: Wallet): any;
    createTransactionOrder(wallet: Wallet, order: _type.OrderRequest): Promise<_type.TransactionRequest>;
    sendTransaction(wallet: Wallet, transactionRequest: _type.TransactionRequest): Promise<_type.TransactionResponse>;
    getTokenBalances(walletAddress: string): Promise<_type.TokenBalance[]>;
    checkAddress(address: string): boolean;
    onTransactionConfirmed(tx: string, callback: any): void;
    getExplorerUrl(type: string, value: string): string;
    signMessage(wallet: Wallet, message: string): any;
}
