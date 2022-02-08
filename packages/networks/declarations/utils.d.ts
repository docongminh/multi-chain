export interface Params {
    auth_key: string;
    page: number;
    pageSize: number;
    contract?: string;
}
export declare function getTransactionsApi(walletAddress: string, chainId: string, contractAddress: string, page?: number): Promise<import("axios").AxiosResponse<any, any>>;
export declare function getTokenBalancesApi(walletAddress: string, chainId: string): Promise<import("axios").AxiosResponse<any, any>>;
export declare function getAccountApi(address: string): Promise<import("axios").AxiosResponse<any, any>>;
export declare function getTokenMetaApi(tokenAddress: string): Promise<import("axios").AxiosResponse<any, any>>;
