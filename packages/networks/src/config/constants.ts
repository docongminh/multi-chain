interface IChainID {
   [key: string]: number
};

export const CHAINID_2_SYMBOL = {
    1: "ETH",
    56: "BSC",
  };
  
export const SYMBOL_2_CHAINID: IChainID = {
    "BSC": 56,
    "ETH": 1,
    "MATIC": 137,
};
  
export const NETWORKS = ["ETH", "BSC", "SOL"];

export const NETWORK_TOKEN = {
  BSC: {
    _id: "BNB0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeBSC",
    name: "Binance Coin",
    address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    symbol: "BNB",
    decimals: 18,
  },
  ETH: {
    _id: "ETH0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeETH",
    name: "Ethereum",
    address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    symbol: "ETH",
    decimals: 18,
  },
  SOL: {
    _id: "SOL0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeSPL",
    name: "Solana",
    address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    symbol: "SOL",
    decimals: 9,
  },
};
