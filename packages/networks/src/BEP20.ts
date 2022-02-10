import { BigNumber } from '@ethersproject/bignumber';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { Contract } from '@ethersproject/contracts';
import { formatUnits } from "@ethersproject/units";
import Web3 from "web3";
import { SYMBOL_2_CHAINID } from "./config/constants";
import abi from "./config/abi";
import { Network } from "./Network";
import * as _type from "./types";
import { getTokenBalancesApi } from "./utils";



export default class BEP20 extends Network {
  _provider: any;

  constructor(web3_provider: _type.Web3Provider,
    network_info: _type.NetworkInfo
  ){
    super(web3_provider, network_info);
    this._provider = new JsonRpcProvider(this.rpcURL);
  }

  newConfig(web3_provider: _type.Web3Provider, network_info: _type.NetworkInfo){
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
    this._provider = new JsonRpcProvider(this.rpcURL)
  }
  async getContractMetadata(contractAddress: string): Promise<_type.Contract> {
    const contract = new Contract(contractAddress, abi[this.symbol], this._provider);
    const name = await contract.functions.name();
    const decimals = await contract.functions.decimals();
    const symbol = await contract.functions.symbol();
    return {
      name: name[0],
      decimals: decimals[0],
      symbol: symbol[0],
      address: contractAddress,
      icon_url: "https://d1j8r0kxyu9tj8.cloudfront.net/files/1628005345XtePsjK1WdF2qlN.png",
    };
  }

  getProvider(): any {
    return this._provider;
  }

  async getBalance(address: string): Promise<string> {
    return await this._provider.getBalance(address).toString();
  }

  async createTransactionOrder(wallet: Wallet, order: _type.OrderRequest): Promise<_type.TransactionRequest> {
    if (order.gas && !order.gasLimit) {
      order.gasLimit = order.gas;
      delete order.gas;
    }

    wallet = this.getSigner(wallet);

    console.log(order);

    const transactionRequest = await wallet.populateTransaction(order);

    return {
      from: transactionRequest.from,
      to: transactionRequest.to,
      nonce: transactionRequest.nonce?.toString(),
      value: BigNumber.from(transactionRequest.value ?? "0").toString(),
      data: transactionRequest.data?.toString(),
      gasPrice: BigNumber.from(transactionRequest.gasPrice).toString(),
      gasLimit: BigNumber.from(transactionRequest.gasLimit).toString(),
      gasFee: BigNumber.from(transactionRequest.gasPrice).mul(<string>transactionRequest.gasLimit).toString(),
    };
  }

  async sendTransaction(
    wallet: Wallet,
    transactionRequest: _type.TransactionRequest
  ): Promise<_type.TransactionResponse> {
    const transaction = {
      from: transactionRequest.from,
      to: transactionRequest.to,
      nonce: Number.parseInt(transactionRequest.nonce!),
      data: transactionRequest.data?.toString(),
      value: BigNumber.from(transactionRequest.value?.toString()),
      gasPrice: BigNumber.from(transactionRequest.gasPrice?.toString()),
      gasLimit: BigNumber.from(transactionRequest.gasLimit?.toString()),
    };

    wallet = this.getSigner(wallet);

    const transactionResponse = await wallet.sendTransaction(transaction);

    return {
      tx: transactionResponse.hash,
      from: transactionResponse.from,
      to: transactionResponse.to,
      nonce: transactionResponse.nonce.toString(),
      value: transactionResponse.value?.toString(),
      data: transactionResponse.data?.toString(),
      gasPrice: transactionResponse.gasPrice?.toString(),
      gasLimit: transactionResponse.gasLimit.toString(),
      gasFee: BigNumber.from(transactionResponse.gasPrice).mul(transactionResponse.gasLimit).toString(),
    };
  }

  async getTokenBalances(walletAddress: string): Promise<_type.TokenBalance[]> {
    const res = await getTokenBalancesApi(walletAddress, SYMBOL_2_CHAINID[this.symbol].toString());
    let tokensBalances = [];
    if (res.data) {
      tokensBalances = res.data.map((item: any) => {
        return {
          address: item.contract_address,
          symbol: item.contract_ticker_symbol,
          network: this.symbol,
          amount: formatUnits(item.balance, item.contract_decimals),
        };
      });
    }
    return tokensBalances;
  }

  checkAddress(address: string): boolean {
    if (address.length == 42 && address.slice(0, 2) == "0x") {
      const re = /^[0-9A-Fa-f]*$/g;
      return re.test(address.slice(2));
    }
    return false;
  }

  onTransactionConfirmed(tx: string, callback: any): void {
    setTimeout(() => {
      this._provider
        .getTransaction(tx)
        .then((transaction: any) => {
          if (transaction) {
            transaction
              .wait()
              .then((receipt: any) => {
                callback({
                  tx,
                  block: receipt.blockNumber,
                  fee: receipt.gasUsed?.mul(transaction.gasPrice).toString(),
                  status: receipt.status ? "completed" : "error",
                });
              })
              .catch((e: any) => {
                console.log("onTransactionConfirmed1" + e);
                callback();
              });
          } else {
            this.onTransactionConfirmed(tx, callback);
          }
        })
        .catch((e: any) => {
          console.log("onTransactionConfirmed2" + e);
          callback();
        });
    }, 2000);
  }

  getExplorerUrl(type: string, value: string): string {
    switch (type) {
      case "token":
        return this.explorerUrl + "/token/" + value;
      case "address":
        return this.explorerUrl + "/address/" + value;
      case "transaction":
        return this.explorerUrl + "/tx/" + value;
      default:
        return this.explorerUrl;
    }
  }

  signMessage(wallet: Wallet, message: string): any {
    const web3 = new Web3();
    return web3.eth.accounts.sign(message, wallet.privateKey).signature;
  }
}