import * as _type from "./types";
import { Network } from "./Network";
import { ethers, Wallet } from "ethers";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { getTokenMetaApi } from "./utils";
import nacl from "tweetnacl";
import SolanaWallet from "@coreproject/wallets";
import { Connection, PublicKey } from "@solana/web3.js";

export default class SPL extends Network {
  _provider: Connection;

  constructor(config: _type.NetworkInfo) {
    //
    const native_token: _type.NativeToken = {
      name: config.native_token.name, 
      symbol: config.native_token.symbol, 
      decimals: config.native_token.decimals, 
      address: config.native_token.address
    }
    super(
      config.name,
      config.rpc_url,
      config.chain_id,
      config.symbol,
      native_token,
      config.explorer_url
    );
    this._provider = new Connection(this.rpcURL);
  }

  async getContractMetadata(contractAddress: string): Promise<_type.Contract | null>{
    const res = await getTokenMetaApi(contractAddress);
    const tokenInfo = res.data?.data;
    if (tokenInfo) {
      return {
        name: tokenInfo?.name,
        decimals: tokenInfo?.decimals,
        symbol: tokenInfo?.symbol,
        address: contractAddress,
        icon_url: tokenInfo?.icon,
      };
    }

    return null;
  }

  getProvider() {
    return this._provider;
  }

  async getBalance(address: string): Promise<string> {
    return (await this._provider.getBalance(new PublicKey(address))).toString();
  }

  getSigner(wallet: Wallet): any {
    // return wallet.connect(this._provider);
  }

  // async createTransactionOrder(wallet: Wallet, order: _type.OrderRequest): Promise<_type.TransactionRequest> {
    // var transaction = new web3.Transaction().add(
    //   web3.SystemProgram.transfer({
    //     fromPubkey: from.publicKey,
    //     toPubkey: to.publicKey,
    //     lamports: web3.LAMPORTS_PER_SOL / 100,
    //   }),
    // );
    //
    // // Sign transaction, broadcast, and confirm
    // var signature = await web3.sendAndConfirmTransaction(
    //   connection,
    //   transaction,
    //   [wallet.provider],
    // );
    // if (order.gas && !order.gasLimit) {
    //   order.gasLimit = order.gas;
    //   delete order.gas;
    // }
    //
    // wallet = this.getSigner(wallet);
    //
    // const transactionRequest = await wallet.populateTransaction(order);
    //
    // return {
    //   from: transactionRequest.from,
    //   to: transactionRequest.to,
    //   nonce: transactionRequest.nonce,
    //   value: BigNumber.from(transactionRequest.value ?? '0').toString(),
    //   data: transactionRequest.data.toString(),
    //   gasPrice: BigNumber.from(transactionRequest.gasPrice).toString(),
    //   gasLimit: BigNumber.from(transactionRequest.gasLimit).toString(),
    //   gasFee: BigNumber.from(transactionRequest.gasPrice).mul(transactionRequest.gasLimit).toString(),
    // };
  // }

  // async sendTransaction(wallet: Wallet, transactionRequest: TransactionRequest): TransactionResponse {
    // const transaction = {
    //   from: transactionRequest.from,
    //   to: transactionRequest.to,
    //   nonce: Number.parseInt(transactionRequest.nonce),
    //   data: transactionRequest.data.toString(),
    //   value: BigNumber.from(transactionRequest.value.toString()),
    //   gasPrice: BigNumber.from(transactionRequest.gasPrice.toString()),
    //   gasLimit: BigNumber.from(transactionRequest.gasLimit.toString()),
    // };
    //
    // wallet = this.getSigner(wallet);
    //
    // let transactionResponse = await wallet.sendTransaction(transaction);
    //
    // return {
    //   tx: transactionResponse.hash,
    //   from: transactionResponse.from,
    //   to: transactionResponse.to,
    //   nonce: transactionResponse.nonce,
    //   value: transactionResponse.value.toString(),
    //   data: transactionResponse.data.toString(),
    //   gasPrice: transactionResponse.gasPrice.toString(),
    //   gasLimit: transactionResponse.gasLimit.toString(),
    //   gasFee: BigNumber.from(transactionResponse.gasPrice).mul(transactionResponse.gasLimit).toString(),
    // };
  // }

  async getTokenBalances(walletAddress: string): Promise<_type.TokenBalance[]> {
    const result = await this._provider.getParsedTokenAccountsByOwner(new PublicKey(walletAddress), {
      programId: TOKEN_PROGRAM_ID,
    });

    const balanceNativeToken = await this.getBalance(walletAddress);
    const amountNativeToken = ethers.utils.formatUnits(balanceNativeToken, this.nativeToken.decimals);

    let tokensBalances = result.value.map(item => {
      return {
        address: item?.account?.data?.parsed?.info?.mint,
        amount: item?.account?.data?.parsed?.info?.tokenAmount?.uiAmountString,
        network: this.symbol,
      };
    });

    tokensBalances = [
      ...tokensBalances,
      {
        address: this.nativeToken.address,
        network: this.symbol,
        amount: amountNativeToken,
      },
    ];

    return tokensBalances;
  }

  checkAddress(address: string): boolean {
    try {
      const publicKey = new PublicKey(address);
      return true;
    } catch (e) {
      return false;
    }
  }

  onTransactionConfirmed(tx: string, callback: any) {
    setTimeout(() => {
      try {
        this._provider.onSignature(
          tx,
          async () => {
            const data = await this._provider.getConfirmedTransaction(tx);
            callback({
              tx,
              block: data?.slot,
              fee: data?.meta?.fee?.toString(),
              status: !data?.meta?.err ? "completed" : "error",
            });
          },
          "finalized",
        );
      } catch (e) {
        console.log("SPL.onTransactionConfirmed" + e);
      }
    }, 2000);
  }

  getExplorerUrl(type: string, value: string): string {
    switch (type) {
      case "token":
        return this.explorerUrl + "/token/" + value;
      case "address":
        return this.explorerUrl + "/account/" + value;
      case "transaction":
        return this.explorerUrl + "/tx/" + value;
      default:
        return this.explorerUrl;
    }
  }

  signMessage(wallet: SolanaWallet, message: any): any {
    return nacl.sign.detached(message, wallet.provider.secretKey);
  }
}
