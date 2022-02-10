import { formatUnits } from "@ethersproject/units";
import * as _type from "./types"

export class Network {

  nativeToken: _type.NativeToken;
  name: string;
  rpcURL: string;
  chainID: number;
  symbol: string;
  explorerUrl: string;

  constructor(
    web3_provider: _type.Web3Provider,
    network_info: _type.NetworkInfo
  ) {
    this.rpcURL = web3_provider.rpcUrl;
    this.explorerUrl = web3_provider.explorer;
    this.name = network_info.name;
    this.chainID = network_info.chain_id;
    this.symbol = network_info.symbol;
    //
    const native_token: _type.NativeToken = {
      name: network_info.native_token.name, 
      symbol: network_info.native_token.symbol, 
      decimals: network_info.native_token.decimals, 
      address: network_info.native_token.address
    }
    this.nativeToken = native_token;
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
