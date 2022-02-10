import { Wallet } from '@ethersproject/wallet';
import { SolanaWallet } from '@coreproject/wallets';
import { Connection } from '@solana/web3.js';

declare type Web3Provider = {
    rpcUrl: string;
    explorer: string;
};
declare type Contract = {
    name: string;
    symbol: string;
    decimals: number;
    address: string;
    icon_url: string;
};
declare type NetworkInfo = {
    network_id: number;
    name: string;
    short_name: string;
    symbol: string;
    chain_id: number;
    wallet_derive_path: string;
    icon_url: string;
    native_token: {
        name: string;
        symbol: string;
        decimals: number;
        address: string;
    };
};
declare type OrderRequest = {
    to?: string;
    from?: string;
    nonce?: string;
    value?: string;
    data?: string;
    gasPrice?: string;
    gasLimit: string;
    gas?: string;
    gasFee?: string;
    maxPriorityFeePerGas?: string;
    maxFeePerGas?: string;
};
declare type TokenBalance = {
    address: string;
    network: string;
    amount: string;
};
declare type NativeToken = {
    name: string;
    symbol: string;
    decimals: number;
    address: string;
};
declare type TransactionRequest = OrderRequest;
declare type TransactionResponse = TransactionRequest & {
    tx: string;
};

declare class Network {
    nativeToken: NativeToken;
    name: string;
    rpcURL: string;
    chainID: number;
    symbol: string;
    explorerUrl: string;
    constructor(web3_provider: Web3Provider, network_info: NetworkInfo);
    getContractMetadata(contractAddress: string): Promise<Contract | null>;
    getBalance(address: string): Promise<string>;
    getSigner(wallet: any): any;
    getTransactionFee(gasFee: string): string;
    getUnitCost(): string;
    createTransactionOrder(wallet: any, order: OrderRequest): Promise<TransactionRequest>;
    sendTransaction(wallet: any, transactionRequest: TransactionRequest): Promise<TransactionResponse>;
    getTokenBalances(walletAddress: string): Promise<TokenBalance[]>;
    checkAddress(address: string): boolean;
    onTransactionConfirmed(txHash: string, callback: any): void;
    getExplorerUrl(type: string, value: string): string;
    signMessage(wallet: any, message: string): any;
}

declare class ERC20 extends Network {
    _provider: any;
    constructor(web3_providers: Web3Provider, network_info: NetworkInfo);
    set provider(value: any);
    getContractMetadata(contractAddress: string): Promise<Contract>;
    getProvider(): any;
    getBalance(address: string): Promise<string>;
    getSigner(wallet: Wallet): any;
    createTransactionOrder(wallet: Wallet, order: OrderRequest): Promise<TransactionRequest>;
    sendTransaction(wallet: Wallet, transactionRequest: TransactionRequest): Promise<TransactionResponse>;
    getTokenBalances(walletAddress: string): Promise<TokenBalance[]>;
    checkAddress(address: string): boolean;
    onTransactionConfirmed(tx: string, callback: any): void;
    getExplorerUrl(type: string, value: string): string;
    signMessage(wallet: Wallet, message: string): any;
}

declare class BEP20 extends Network {
    _provider: any;
    constructor(web3_provider: Web3Provider, network_info: NetworkInfo);
    newConfig(web3_provider: Web3Provider, network_info: NetworkInfo): void;
    getContractMetadata(contractAddress: string): Promise<Contract>;
    getProvider(): any;
    getBalance(address: string): Promise<string>;
    createTransactionOrder(wallet: Wallet, order: OrderRequest): Promise<TransactionRequest>;
    sendTransaction(wallet: Wallet, transactionRequest: TransactionRequest): Promise<TransactionResponse>;
    getTokenBalances(walletAddress: string): Promise<TokenBalance[]>;
    checkAddress(address: string): boolean;
    onTransactionConfirmed(tx: string, callback: any): void;
    getExplorerUrl(type: string, value: string): string;
    signMessage(wallet: Wallet, message: string): any;
}

declare class SPL extends Network {
    _provider: Connection;
    constructor(web3_providers: Web3Provider, network_info: NetworkInfo);
    getContractMetadata(contractAddress: string): Promise<Contract | null>;
    getProvider(): Connection;
    getBalance(address: string): Promise<string>;
    getTokenBalances(walletAddress: string): Promise<TokenBalance[]>;
    checkAddress(address: string): boolean;
    onTransactionConfirmed(tx: string, callback: any): void;
    getExplorerUrl(type: string, value: string): string;
    signMessage(wallet: SolanaWallet, message: any): any;
}

declare const SUFFIX_NFT_NETWORK = "NFT";

export { BEP20, ERC20, SPL, SUFFIX_NFT_NETWORK };
