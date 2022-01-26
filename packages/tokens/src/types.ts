//
export type TransferTransactionRequest = {
    to: string,
    from: string,
    nonce: string,
    value: string,
    data?: string,
    gasLimit: string,
    contractAddress?: string,
    gasFee: string,
  };
  
export type TransferTransactionResponse = TransferTransactionRequest & {
    tx: string,
};

export type BEP20TransferTransactionRequest = TransferTransactionRequest & {
    gasPrice: string,
};
  
export type BEP20TransferTransactionResponse = BEP20TransferTransactionRequest & {
    tx: string
};

export type ERC20TransferTransactionRequest = TransferTransactionRequest & {
    maxPriorityFeePerGas: string,
    maxFeePerGas: string,
    gasPrice: string
};
  
export type ERC20TransferTransactionResponse = ERC20TransferTransactionRequest & {
    tx: string
};
  