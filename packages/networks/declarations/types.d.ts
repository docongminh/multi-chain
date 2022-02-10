export declare type Network = "ETH" | "BSC" | "SPL";
export declare type NetType = 'testnet' | 'mainnet';
export declare type Web3Provider = {
    rpcUrl: string;
    explorer: string;
};
export declare type Contract = {
    name: string;
    symbol: string;
    decimals: number;
    address: string;
    icon_url: string;
};
export declare type NetworkInfo = {
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
export declare type OrderRequest = {
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
export declare type TokenBalance = {
    address: string;
    network: string;
    amount: string;
};
export declare type NFTTokenBalance = TokenBalance & {
    name: string;
    symbol: string;
    metadata_uri: string;
    decimals: number;
};
export declare type NativeToken = {
    name: string;
    symbol: string;
    decimals: number;
    address: string;
};
export declare type TransactionRequest = OrderRequest;
export declare type TransactionResponse = TransactionRequest & {
    tx: string;
};
