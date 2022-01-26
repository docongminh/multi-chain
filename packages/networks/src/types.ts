
export type Network = "ETH" | "BSC" | "SPL";

export type Contract = {
    name: string,
    symbol: string,
    decimals: number,
    address: string,
    icon_url: string,
  };
  
  export type NetworkInfo = {
    network_id: number,
    name: string,
    short_name: string,
    symbol: string,
    chain_id: number,
    rpc_url: string,
    explorer_url: string,
    wallet_derive_path: string,
    icon_url: string,
    is_testnet?: boolean,
    native_token: {
      name: string,
      symbol: string,
      decimals: number,
      address: string,
    },
  }
  
  export type OrderRequest = {
    to?: string,
    from?: string,
    nonce?: string,
    value?: string,
    data?: string,
    gasPrice?: string,
    gasLimit: string,
    gas?: string,
    gasFee?: string,
    maxPriorityFeePerGas?: string,
    maxFeePerGas?: string,
  };
  
  export type TokenBalance = {
    address: string,
    network: string,
    amount: string,
  };
  
  export type NFTTokenBalance = TokenBalance & {
    name: string,
    symbol: string,
    metadata_uri: string,
    decimals: number,
  };
  
  export type NativeToken = {
    name: string,
    symbol: string,
    decimals: number,
    address: string
  }
  
  export type TransactionRequest = OrderRequest;
  
  export type TransactionResponse = TransactionRequest & {
    tx: string,
  };