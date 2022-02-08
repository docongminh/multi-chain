import * as _type from "./types";
export declare class Network {
    name: string;
    rpcURL: string;
    chainID: number;
    symbol: string;
    explorerUrl: string;
    nativeToken: _type.NativeToken;
    constructor(name: string, rpcURL: string, chainID: number, symbol: string, nativeToken: _type.NativeToken, explorerUrl: string);
    getContractMetadata(contractAddress: string): Promise<_type.Contract | null>;
    getBalance(address: string): Promise<string>;
    getSigner(wallet: any): any;
    getTransactionFee(gasFee: string): string;
    getUnitCost(): string;
    createTransactionOrder(wallet: any, order: _type.OrderRequest): Promise<_type.TransactionRequest>;
    sendTransaction(wallet: any, transactionRequest: _type.TransactionRequest): Promise<_type.TransactionResponse>;
    getTokenBalances(walletAddress: string): Promise<_type.TokenBalance[]>;
    checkAddress(address: string): boolean;
    onTransactionConfirmed(txHash: string, callback: any): void;
    getExplorerUrl(type: string, value: string): string;
    signMessage(wallet: any, message: string): any;
}
