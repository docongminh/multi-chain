import BEP20 from "@coreproject/networks";
import * as _type from "./types";
import { BigNumber, Contract, ethers } from "ethers";
import { Token } from "./Token";
import Wallet from "@coreproject/wallets";
import { getTransactionAndPrices } from "../../services/unmarshalServices";



export class BEP20Token extends Token {
  _contract: Contract; // ether contract

  constructor(
    name: string, 
    symbol: string, 
    decimals: string, 
    iconURL: string, 
    address: string, 
    abi: Array<object>, 
    network: BEP20){
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
  ): Promise<_type.BEP20TransferTransactionRequest> {
    const transactionValue = ethers.utils.parseUnits(value.toString(), this.decimals);

    wallet = this.network.getSigner(wallet.provider);

    const transaction = await this._contract.populateTransaction.transfer(to, transactionValue);
    const transactionRequest = await wallet.populateTransaction(transaction);

    return {
      from: transactionRequest.from,
      to: to,
      contractAddress: transactionRequest.to,
      nonce: transactionRequest.nonce,
      value: transactionValue.toString(),
      data: transactionRequest.data.toString(),
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
      to: transferTransactionRequest.contractAddress,
      nonce: Number.parseInt(transferTransactionRequest.nonce),
      data: transferTransactionRequest.data?.toString(),
      gasPrice: BigNumber.from(transferTransactionRequest.gasPrice.toString()),
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
      gasPrice: transactionResponse.gasPrice.toString(),
      gasLimit: transactionResponse.gasLimit.toString(),
      gasFee: BigNumber.from(transferTransactionRequest.gasPrice)
                    .mul(transactionResponse.gasLimit).toString(),
    };
  }

  async getTransactions(walletAddress: string): Promise<void> {
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
