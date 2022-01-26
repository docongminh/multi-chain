import { Network } from "@coreproject/networks";
import Wallet from "@coreproject/wallets";
import { ethers } from "ethers";
import { convertNumber } from "@coreproject/utils";
import * as _type from "./types"


export class Token {
  name: string;
  symbol: string;
  decimals: string;
  iconURL: string;
  address: string;
  abi: Array<object>;
  network: Network;

  constructor(
    name: string,
    symbol: string,
    decimals: string,
    iconURL: string,
    address: string,
    abi: Array<object>,
    network: Network
  ) {
    this.name = name;
    this.symbol = symbol;
    this.iconURL = iconURL;
    this.address = address;
    this.abi = abi;
    this.decimals = decimals;
    this.network = network;
  }

  async createTransferOrder(
    wallet: Wallet,
    to: string,
    value: string
  ): Promise<_type.TransferTransactionRequest> {
    throw new Error("Abstract Method has no implementation");
  }

  async balanceOf(address: string): Promise<string> {
    throw new Error("Abstract Method has no implementation");
  }

  async transfer(
    wallet: Wallet,
    transferTransactionRequest: _type.TransferTransactionRequest
  ): Promise<_type.TransferTransactionResponse> {
    throw new Error("Abstract Method has no implementation");
  }

  async getGas(transaction = { value: 0 }): Promise<void> {
    throw new Error("Abstract Method has no implementation");
  }

  subscribeBalanceChange(address: string, callback: any) {
    throw new Error("Abstract Method has no implementation");
  }

  subscribeOnce(tx: string, callback: any) {
    throw new Error("Abstract Method has no implementation");
  }

  subscribeReceiveToken(address: any, callback: string) {
    throw new Error("Abstract Method has no implementation");
  }

  async signTransaction(
    wallet: Wallet,
    to: string,
    amount: string,
    gas: string,
    nonce: string
  ): Promise<void> {
    throw new Error("Abstract Method has no implementation");
  }

  async sendSignedTransaction(signature: string): Promise<void> {
    throw new Error("Abstract Method has no implementation");
  }

  async getTransaction(hash: string): Promise<void> {
    throw new Error("Abstract Method has no implementation");
  }

  async getGasPrice(): Promise<void> {
    throw new Error("Abstract Method has no implementation");
  }

  async getGasLimit(transaction: any, wallet: Wallet): Promise<void> {
    throw new Error("Abstract Method has no implementation");
  }

  async getTransactions(walletAddress: string): Promise<void> {
    throw new Error("Abstract Method has no implementation");
  }

  async allowance(walletAddress: string, spenderAddress: string): Promise<string> {
    throw new Error("Abstract Method has no implementation");
  }

  async approve(
    wallet: Wallet,
    spenderAddress: string,
    amount = "1000000000000000000"
  ): Promise<string> {
    throw new Error("Abstract Method has no implementation");
  }

  async call(nameFunction: string, ...args: any) {
    throw new Error("Abstract Method has no implementation");
  }

  formatAmount(amount = "0", separator = "."): string {
    amount = convertNumber(amount);
    const arrAmount = amount.split(".");
    const natural = arrAmount[0];
    let decimal = arrAmount[1];
    if (decimal?.length > 0) {
      decimal = decimal.slice(0, parseInt(this.decimals));
      return `${natural}.${decimal}`;
    }

    return `${natural}`;
  }

  maxAmount(amount = "0", type = "transfer"): string {
    return this.formatAmount(amount);
  }

  greaterAmount(amount = "0", otherAmount = "0") {
    return ethers.utils
      .parseUnits(this.formatAmount(amount), parseInt(this.decimals))
      .gt(ethers.utils.parseUnits(this.formatAmount(otherAmount), this.decimals));
  }
}
