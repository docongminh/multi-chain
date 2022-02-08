interface IChainID {
    [key: string]: number;
}
export declare const CHAINID_2_SYMBOL: {
    1: string;
    56: string;
};
export declare const SYMBOL_2_CHAINID: IChainID;
export declare const NETWORKS: string[];
export declare const NETWORK_TOKEN: {
    BSC: {
        _id: string;
        name: string;
        address: string;
        symbol: string;
        decimals: number;
    };
    ETH: {
        _id: string;
        name: string;
        address: string;
        symbol: string;
        decimals: number;
    };
    SOL: {
        _id: string;
        name: string;
        address: string;
        symbol: string;
        decimals: number;
    };
};
export {};
