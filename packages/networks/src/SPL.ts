import * as _type from "./types";
import { Network } from "./Network";
import { formatUnits } from "@ethersproject/units";
import { getTokenMetaApi } from "./utils";
import nacl from "tweetnacl";
import { SolanaWallet } from "@coreproject/wallets";
import { Connection, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

export default class SPL extends Network {
  _provider: Connection;

  constructor(web3_providers: _type.Web3Provider,
    network_info: _type.NetworkInfo
  ){
    super(web3_providers, network_info);
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

  async getTokenBalances(walletAddress: string): Promise<_type.TokenBalance[]> {
    const result = await this._provider.getParsedTokenAccountsByOwner(new PublicKey(walletAddress), {
      programId: TOKEN_PROGRAM_ID,
    });

    const balanceNativeToken = await this.getBalance(walletAddress);
    const amountNativeToken = formatUnits(balanceNativeToken, this.nativeToken.decimals);

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
