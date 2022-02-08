import { formatUnits } from "@ethersproject/units";
import * as _type from "./types"

export class Network {
  name: string;
  rpcURL: string;
  chainID: number;
  symbol: string;
  explorerUrl: string;
  nativeToken: _type.NativeToken;

  constructor(
    name: string,
    rpcURL: string,
    chainID: number,
    symbol: string,
    nativeToken: _type.NativeToken,
    explorerUrl: string
  ) {
    this.name = name;
    this.rpcURL = rpcURL;
    this.chainID = chainID;
    this.symbol = symbol;
    this.explorerUrl = explorerUrl;
    if (!nativeToken) {
      throw new Error("Constructor do not add native token parameter");
    }
    this.nativeToken = nativeToken;
  }
  
  async getContractMetadata(contractAddress: string): Promise<_type.Contract | null> {
    throw new Error("Abstract Method has no implementation");
  }

  async getBalance(address: string): Promise<string> {
    throw new Error("Abstract Method has no implementation");
  }

  getSigner(wallet: any): any {
    throw new Error("Abstract Method has no implementation");
  }

  getTransactionFee(gasFee: string): string {
    return formatUnits(gasFee.toString(), this.nativeToken.decimals);
  }

  getUnitCost(): string {
    return this.nativeToken.symbol;
  }

  async createTransactionOrder(wallet: any, order: _type.OrderRequest): Promise<_type.TransactionRequest> {
    throw new Error("Abstract Method has no implementation");
  }

  async sendTransaction(wallet: any, transactionRequest: _type.TransactionRequest): Promise<_type.TransactionResponse> {
    throw new Error("Abstract Method has no implementation");
  }

  async getTokenBalances(walletAddress: string): Promise<_type.TokenBalance[]> {
    throw new Error("Abstract Method has no implementation");
  }

  checkAddress(address: string): boolean {
    throw new Error("Abstract Method has no implementation");
  }

  onTransactionConfirmed(txHash: string, callback: any) {
    throw new Error("Abstract Method has no implementation");
  }

  getExplorerUrl(type: string, value: string): string {
    throw new Error("Abstract Method has no implementation");
  }

  signMessage(wallet: any, message: string): any {
    throw new Error("Abstract Method has no implementation");
  }
}
