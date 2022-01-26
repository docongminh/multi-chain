import BEP20 from "@coreproject/networks";
import * as _type from "./types";
import { Token } from "./Token";
import { BigNumber, ethers } from "ethers";
import Wallet from "@coreproject/wallets";
import { getTransactionAndPrices } from "../../services/unmarshalServices";

export class BNBToken extends Token {
  AMOUNT_NEED_TRANSFER_NATIVE = "0.00021";
  AMOUNT_NEED_SWAP_NATIVE = "0.002";

  constructor(
    name: string, 
    symbol: string, 
    decimals: string, 
    iconURL: string, 
    address: string, 
    abi: Array<object>, 
    network: BEP20) {
    super(name, symbol, decimals, iconURL, address, abi, network);
  }

  async balanceOf(address: string): Promise<string> {
    const result = await this.network.getBalance(address);
    return ethers.utils.formatUnits(result, this.decimals);
  }

  async createTransferOrder(
    wallet: Wallet, 
    to: string, 
    value: string
  ): Promise<_type.BEP20TransferTransactionRequest> {
    const transaction = {
      to,
      value: ethers.utils.parseUnits(value.toString(), this.decimals),
    };

    wallet = this.network.getSigner(wallet.provider);

    const transactionRequest = await wallet.populateTransaction(transaction);

    return {
      from: transactionRequest.from,
      to: transactionRequest.to,
      nonce: transactionRequest.nonce,
      value: BigNumber.from(transactionRequest.value).toString(),
      data: transactionRequest.data?.toString(),
      gasPrice: BigNumber.from(transactionRequest.gasPrice).toString(),
      gasLimit: BigNumber.from(transactionRequest.gasLimit).toString(),
      gasFee: BigNumber.from(transactionRequest.gasPrice).mul(transactionRequest.gasLimit).toString(),
    };
  }

  async transfer(
    wallet: Wallet,
    transferTransactionRequest: _type.BEP20TransferTransactionRequest,
  ): Promise<_type.BEP20TransferTransactionResponse> {
    const transactionRequest = {
      from: transferTransactionRequest.from,
      to: transferTransactionRequest.to,
      nonce: Number.parseInt(transferTransactionRequest.nonce),
      value: BigNumber.from(transferTransactionRequest.value.toString()),
      gasPrice: BigNumber.from(transferTransactionRequest.gasPrice.toString()),
      gasLimit: BigNumber.from(transferTransactionRequest.gasLimit.toString()),
    };

    wallet = this.network.getSigner(wallet.provider);

    const transactionResponse = await wallet.sendTransaction(transactionRequest);

    return {
      tx: transactionResponse.hash,
      from: transactionResponse.from,
      to: transactionResponse.to,
      nonce: transactionResponse.nonce,
      value: transactionResponse.value.toString(),
      data: transactionResponse.data?.toString(),
      gasPrice: transactionResponse.gasPrice.toString(),
      gasLimit: transactionResponse.gasLimit.toString(),
      gasFee: BigNumber.from(transferTransactionRequest.gasPrice).mul(transactionResponse.gasLimit).toString(),
    };
  }

  async getTransactions(walletAddress): Promise<void> {
    return await getTransactionAndPrices(this.network.symbol, walletAddress, this.address);
  }

  async allowance(walletAddress: string, spenderAddress: string): Promise<string> {
    return "100000000000000000000000000000000000000000000";
  }

  async approve(
    wallet: Wallet, 
    spenderAddress: string, 
    amount = "1000000000000000000"
  ): Promise<string> {
    return amount;
  }

  maxAmount(amount = "0", type = "transfer"): string {
    let maxAmount = this.formatAmount(amount);

    switch (type) {
      case "transfer":
        maxAmount = ethers.utils
          .parseUnits(amount, this.decimals)
          .sub(ethers.utils.parseUnits(this.AMOUNT_NEED_TRANSFER_NATIVE, this.decimals));
        break;
      case "swap":
        maxAmount = ethers.utils
          .parseUnits(amount, this.decimals)
          .sub(ethers.utils.parseUnits(this.AMOUNT_NEED_SWAP_NATIVE, this.decimals));
        break;
      default:
        break;
    }

    if (maxAmount.lt(BigNumber.from("0"))) {
      return "0";
    }
    return ethers.utils.formatUnits(maxAmount, this.decimals);
  }
}
