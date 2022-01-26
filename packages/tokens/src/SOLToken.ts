import BEP20 from "../networks/BEP20";
import { Token } from "./Token";
import { ethers } from "ethers";
import { BEP20TransferTransactionRequest } from "./BEP20Token";
import Wallet from "../wallets/Wallet";
import { SPLTransferTransactionRequest, SPLTransferTransactionResponse } from "./SPLToken";
import { toDate } from "../utils/time";
import { PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
// let solanaWeb3;
// try {
//   solanaWeb3 = require("../../lib/@solana/web3.js");
//   // do stuff
// } catch (ex) {
//   solanaWeb3 = require("@solana/web3.js");
// }
// const { PublicKey, Transaction, SystemProgram } = solanaWeb3;

export class SOLToken extends Token {
  AMOUNT_NEED_TRANSFER_NATIVE = "0.000005";
  AMOUNT_NEED_SWAP_NATIVE = "0.00001";

  constructor(name, symbol, decimals, iconURL, address, abi, network: BEP20) {
    super(name, symbol, decimals, iconURL, address, null, network);
  }

  async balanceOf(address): Promise<string> {
    const result = await this.network.getBalance(address);
    return ethers.utils.formatUnits(result, this.decimals);
  }

  async _getLamportsPerSignature(): number {
    const response = await this.network.getProvider().getRecentBlockhash();
    return response?.feeCalculator?.lamportsPerSignature;
  }

  async createTransferOrder(wallet: Wallet, to: string, value: string): BEP20TransferTransactionRequest {
    // console.log(ethers.utils.parseUnits(value.toString(), this.decimals).toNumber());
    // var transaction = new Transaction().add(
    //   SystemProgram.transfer({
    //     fromPubkey: new PublicKey(wallet.address),
    //     toPubkey: new PublicKey(to),
    //     lamports: ethers.utils.parseUnits(value.toString(), this.decimals).toNumber(),
    //   }),
    // );

    const fee = await this._getLamportsPerSignature();

    return {
      from: wallet.address.toString(),
      to: to.toString(),
      value: ethers.utils.parseUnits(value.toString(), this.decimals).toString(),
      gasFee: fee.toString(),
    };

    // transaction.sign([wallet.provider]);
    //
    // console.log({ sign: transaction.signature });
    // const fee = await this.network.provider().getFeeCalculatorForBlockhash(transaction.signature);
    // console.log(fee);

    // console.log(transaction.instructions[0]);

    // Sign transaction, broadcast, and confirm
    // var signature = await this.network.getProvider().sendTransaction(
    //   transaction,
    //   [wallet.provider],
    // );

    // getFeeCalculatorForBlockhash;

    // console.log(signature);
  }

  async transfer(
    wallet: Wallet,
    transferTransactionRequest: SPLTransferTransactionRequest,
  ): Promise<SPLTransferTransactionResponse> {
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(transferTransactionRequest.from),
        toPubkey: new PublicKey(transferTransactionRequest.to),
        lamports: transferTransactionRequest.value.toString(),
      }),
    );

    const fee = await this._getLamportsPerSignature();
    const signature = await this.network.getProvider().sendTransaction(transaction, [wallet.provider]);

    return {
      tx: signature,
      from: transferTransactionRequest.from,
      to: transferTransactionRequest.to,
      value: transferTransactionRequest.value.toString(),
      gasFee: fee.toString(),
    };
  }

  async getTransactions(walletAddress): Promise<void> {
    let transactions = [];

    const confirmedSignatures = await this.network
      .getProvider()
      .getConfirmedSignaturesForAddress2(new PublicKey(walletAddress));
    const signatures = confirmedSignatures.map(item => item.signature);
    const confirmedTransactions = await this.network.getProvider().getParsedConfirmedTransactions(signatures);

    transactions = confirmedTransactions
      .filter(item => item.transaction?.message?.instructions[0]?.program == "system")
      .map(item => {
        const dataTransaction = {
          tx_hash: item.transaction?.signatures[0],
          status: "completed",
          fee: item.meta?.fee?.toString(),
          date: toDate(item.blockTime),
          block: item.slot?.toString(),
          type: "contract_execution",
          network: "SOL",
        };

        // item?.meta?.innerInstructions?.forEach((item) => {
        //   item?.instructions?.forEach((instruction) => {
        //     console.log(instruction);
        //     if (instruction?.programId?.publicKey == TOKEN_PROGRAM_ID.publicKey && instruction?.parsed?.type == "transfer") {
        //
        //     }
        //   });
        // });

        item.transaction?.message?.instructions.forEach(instruction => {
          if (instruction?.program == "system" && instruction?.parsed?.type == "transfer") {
            const info = instruction?.parsed?.info;

            if (info) {
              const amount = ethers.utils.formatUnits(info.lamports.toString(), this.decimals).toString();
              dataTransaction.from = info.source;
              dataTransaction.to = info.destination;

              if (dataTransaction.to == walletAddress) {
                dataTransaction.receive_token = this.address;
                dataTransaction.receive_value = amount;
                dataTransaction.receive_quote = "0";
                dataTransaction.type = "receive";
              }

              if (dataTransaction.from == walletAddress) {
                dataTransaction.send_token = this.address;
                dataTransaction.send_value = amount;
                dataTransaction.send_quote = "0";
                dataTransaction.type = "send";
              }
            }

            if (
              dataTransaction.from != dataTransaction.to &&
              dataTransaction.receive_token &&
              dataTransaction.send_token
            ) {
              dataTransaction.type = "swap";
            }
          }
        });

        if (!dataTransaction.send_token && !dataTransaction.receive_token) {
          dataTransaction.send_token = this.address;
        }

        return dataTransaction;
      });

    return transactions;
    // return super.getTransactions(walletAddress);
  }

  maxAmount(amount = "0", type = "transfer"): * {
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

    return ethers.utils.formatUnits(maxAmount, this.decimals);
  }
}
