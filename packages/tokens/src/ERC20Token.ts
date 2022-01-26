import { BigNumber, ethers, Contract } from "ethers";
import ERC20 from "@coreproject/networks";
import * as _type from "./types"
import { Token } from "./Token";
import Wallet from "@coreproject/wallets";
import { getTransactionAndPrices } from "@coreproject/utils";


export class ERC20Token extends Token {
  _contract: Contract;

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
    this._contract = new ethers.Contract(address, abi, network.getProvider());
  }

  async call(nameFunction: string, ...args: any): Promise<any> {
    return await this._contract.functions[nameFunction](args);
  }

  async balanceOf(address: string): Promise<string> {
    const result = await this._contract.functions.balanceOf(address);
    return ethers.utils.formatUnits(result[0], this.decimals);
  }

  async createTransferOrder(
    wallet: Wallet, 
    to: string, 
    value: string
  ): Promise<_type.ERC20TransferTransactionRequest> {

    const transactionValue = ethers.utils.parseUnits(value.toString(), this.decimals);

    wallet = this.network.getSigner(wallet.provider);

    const transaction = await this._contract.populateTransaction.transfer(to, transactionValue);
    const transactionRequest = await wallet.populateTransaction(transaction);
    const maxPriorityFeePerGas = BigNumber.from("2000000000");

    return {
      from: transactionRequest.from,
      to: to,
      contractAddress: transactionRequest.to,
      nonce: transactionRequest.nonce,
      value: transactionValue.toString(),
      data: transactionRequest.data.toString(),
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
      to: transferTransactionRequest.contractAddress,
      nonce: Number.parseInt(transferTransactionRequest.nonce, 10),
      data: transferTransactionRequest.data.toString(),
      maxPriorityFeePerGas: BigNumber.from(transferTransactionRequest.maxPriorityFeePerGas.toString()),
      maxFeePerGas: BigNumber.from(transferTransactionRequest.maxFeePerGas.toString()),
      gasLimit: BigNumber.from(transferTransactionRequest.gasLimit.toString()),
    };

    wallet = this.network.getSigner(wallet.provider);
    const transactionResponse = await wallet.sendTransaction(transactionRequest);

    return {
      tx: transactionResponse.hash,
      from: transactionResponse.from,
      to: transferTransactionRequest.to,
      nonce: transactionResponse.nonce,
      value: transferTransactionRequest.value.toString(),
      data: transactionResponse.data.toString(),
      maxFeePerGas: BigNumber.from(transactionResponse.maxFeePerGas).toString(),
      maxPriorityFeePerGas: BigNumber.from(transactionResponse.maxPriorityFeePerGas).toString(),
      gasLimit: transactionResponse.gasLimit.toString(),
      gasPrice: BigNumber.from(transactionResponse.maxFeePerGas).toString(),
      gasFee: BigNumber.from(transactionResponse.maxFeePerGas)
        .add(transactionResponse.maxPriorityFeePerGas)
        .mul(transactionResponse.gasLimit)
        .toString(),
    };
  }

  async getTransactions(walletAddress): Promise<void> {
    return await getTransactionAndPrices(this.network.symbol, walletAddress, this.address);
  }

  async allowance(walletAddress: string, spenderAddress: string): Promise<string> {
    const data = await this._contract.allowance(walletAddress, spenderAddress);
    return data.toString();
  }

  async approve(
    wallet: Wallet, 
    spenderAddress: string, 
    amount = "1000000000000000000"
  ): Promise<string> {
    wallet = this.network.getSigner(wallet.provider);

    const amountApprove = ethers.utils.parseUnits(amount.toString(), this.decimals).toString();

    const contract = this._contract.connect(wallet);

    const transRequest = await contract.approve(spenderAddress, amountApprove);
    await transRequest.wait();

    return amountApprove.toString();
  }
}
