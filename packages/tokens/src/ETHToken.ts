import { Token } from "./Token";
import ERC20 from "@coreproject/networks";
import { BigNumber, ethers } from "ethers";
import * as _type from "./types";
import Wallet from "@coreproject/wallets";
import { getTransactionAndPrices } from "@coreproject/utils";


export class ETHToken extends Token {
  AMOUNT_NEED_TRANSFER_NATIVE = "0.00021";
  AMOUNT_NEED_SWAP_NATIVE = "0.02";

  constructor(
    name: string,
    symbol: string,
    decimals: string,
    iconURL: string,
    address: string,
    abi: Array<object>, 
    network: ERC20
  ) {
    super(
      name, 
      symbol, 
      decimals, 
      iconURL, 
      address, 
      abi, 
      network
    );
  }

  async balanceOf(address: string): Promise<string> {
    const result = await this.network.getBalance(address);
    return ethers.utils.formatUnits(result, this.decimals);
  }

  async createTransferOrder(
    wallet: Wallet, 
    to: string, 
    value: string
  ): Promise<_type.ERC20TransferTransactionRequest> {
    const transaction = {
      to,
      value: ethers.utils.parseUnits(value.toString(), this.decimals),
    };

    wallet = this.network.getSigner(wallet.provider);

    const transactionRequest = await wallet.populateTransaction(transaction);

    const maxPriorityFeePerGas = BigNumber.from("2000000000");

    return {
      from: transactionRequest.from,
      to: transactionRequest.to,
      nonce: transactionRequest.nonce,
      value: BigNumber.from(transactionRequest.value).toString(),
      maxPriorityFeePerGas: BigNumber.from(maxPriorityFeePerGas).toString(),
      maxFeePerGas: BigNumber.from(transactionRequest.maxFeePerGas).toString(),
      gasLimit: BigNumber.from(transactionRequest.gasLimit).toString(),
      gasPrice: BigNumber.from(transactionRequest.maxFeePerGas).toString(),
      gasFee: BigNumber.from(transactionRequest.maxFeePerGas)
        .add(maxPriorityFeePerGas)
        .mul(transactionRequest.gasLimit)
        .toString(),
    };
  }

  async transfer(
    wallet: Wallet,
    transferTransactionRequest: _type.ERC20TransferTransactionRequest,
  ): Promise<_type.ERC20TransferTransactionResponse> {

    const transactionRequest = {
      type: 2,
      from: transferTransactionRequest.from,
      to: transferTransactionRequest.to,
      nonce: Number.parseInt(transferTransactionRequest.nonce, 10),
      value: BigNumber.from(transferTransactionRequest.value.toString()),
      maxPriorityFeePerGas: BigNumber.from(transferTransactionRequest.maxPriorityFeePerGas.toString()),
      maxFeePerGas: BigNumber.from(transferTransactionRequest.maxFeePerGas.toString()),
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
      maxFeePerGas: BigNumber.from(transactionResponse.maxFeePerGas).toString(),
      maxPriorityFeePerGas: BigNumber.from(transactionResponse.maxPriorityFeePerGas).toString(),
      gasLimit: BigNumber.from(transactionResponse.gasLimit).toString(),
      gasPrice: BigNumber.from(transactionResponse.maxFeePerGas).toString(),
      gasFee: BigNumber.from(transactionResponse.maxFeePerGas)
        .add(transactionResponse.maxPriorityFeePerGas)
        .mul(transactionResponse.gasLimit)
        .toString(),
    };
  }

  async getTransactions(walletAddress: string): Promise<void> {
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
          .sub(ethers.utils.parseUnits(this.AMOUNT_NEED_TRANSFER_NATIVE, this.decimals)).toString();
        if (maxAmount.lt("0")) {
          maxAmount = "0";
        }
        break;
      case "swap":
        maxAmount = ethers.utils
          .parseUnits(amount, this.decimals)
          .sub(ethers.utils.parseUnits(this.AMOUNT_NEED_SWAP_NATIVE, this.decimals)).toString();
        if (maxAmount.lt("0")) {
          maxAmount = "0";
        }
        break;
      default:
        break;
    }

    return ethers.utils.formatUnits(maxAmount, this.decimals);
  }
}
