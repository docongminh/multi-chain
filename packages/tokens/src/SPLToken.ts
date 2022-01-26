import { ethers } from "ethers";
import { Token, TransferTransactionRequest } from "./Token";
import Wallet from "../wallets/Wallet";

import * as splToken from "@solana/spl-token";
import { toDate } from "../utils/time";
import SPL from "../networks/SPL";
import { PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
// let solanaWeb3;
// try {
//   solanaWeb3 = require("../../lib/@solana/web3.js");
//   // do stuff
// } catch (ex) {
//   solanaWeb3 = require("@solana/web3.js");
// }
// const { PublicKey, Transaction } = solanaWeb3;

export type SPLTransferTransactionRequest = TransferTransactionRequest & {};

export type SPLTransferTransactionResponse = SPLTransferTransactionRequest & {};

export class SPLToken extends Token {
  constructor(name, symbol, decimals, iconURL, address, abi, network: SPL) {
    super(name, symbol, decimals, iconURL, address, abi, network);
  }

  async balanceOf(address): Promise<string> {
    const result = await this.network
      .getProvider()
      .getParsedTokenAccountsByOwner(new PublicKey(address), { mint: new PublicKey(this.address) });
    return result.value[0]?.account?.data?.parsed?.info?.tokenAmount?.uiAmountString ?? "0";
  }

  async _getLamportsPerSignature(): number {
    const response = await this.network.getProvider().getRecentBlockhash();
    return response?.feeCalculator?.lamportsPerSignature;
  }

  async createTransferOrder(wallet: Wallet, to: string, value: string): SPLTransferTransactionRequest {
    const fee = await this._getLamportsPerSignature();

    return {
      from: wallet.address.toString(),
      to: to.toString(),
      value: ethers.utils.parseUnits(value.toString(), this.decimals).toString(),
      gasFee: fee.toString(),
    };
  }

  async transfer(
    wallet: Wallet,
    transferTransactionRequest: SPLTransferTransactionRequest,
  ): Promise<SPLTransferTransactionResponse> {
    const mint = new PublicKey(this.address);
    const token = new splToken.Token(this.network.getProvider(), mint, TOKEN_PROGRAM_ID, wallet.provider);

    const fromTokenAccount = await token.getOrCreateAssociatedAccountInfo(new PublicKey(transferTransactionRequest.from));

    const destPublicKey = new PublicKey(transferTransactionRequest.to);

    // Get the derived address of the destination wallet which will hold the custom token
    const associatedDestinationTokenAddr = await splToken.Token.getAssociatedTokenAddress(
      token.associatedProgramId,
      token.programId,
      mint,
      destPublicKey,
    );

    const receiverAccount = await this.network.getProvider().getAccountInfo(associatedDestinationTokenAddr);

    const instructions: TransactionInstruction[] = [];

    if (receiverAccount === null) {
      instructions.push(
        splToken.Token.createAssociatedTokenAccountInstruction(
          token.associatedProgramId,
          token.programId,
          mint,
          associatedDestinationTokenAddr,
          destPublicKey,
          wallet.provider.publicKey,
        ),
      );
    }

    instructions.push(
      splToken.Token.createTransferCheckedInstruction(
        TOKEN_PROGRAM_ID,
        fromTokenAccount.address,
        mint,
        associatedDestinationTokenAddr,
        wallet.provider.publicKey,
        [],
        transferTransactionRequest.value.toString(),
        this.decimals,
      ),
    );

    const transaction = new Transaction().add(...instructions);
    // let toTokenAccount = await token.getOrCreateAssociatedAccountInfo(new PublicKey(transferTransactionRequest.to));

    // var signature = await token.transfer(
    //   fromTokenAccount.address,
    //   toTokenAccount.address,
    //   wallet.provider.publicKey,
    //   [wallet.provider],
    //   transferTransactionRequest.value.toString(),
    // );

    // var transaction = new Transaction().add(
    //   splToken.Token.createTransferInstruction(
    //     token.programId,
    //     fromTokenAccount.address,
    //     toTokenAccount.address,
    //     wallet.provider.publicKey,
    //     [],
    //     transferTransactionRequest.value.toString(),
    //   ),
    // );

    const signature = await this.network.getProvider().sendTransaction(transaction, [wallet.provider]);

    return {
      tx: signature,
      from: transferTransactionRequest.from,
      to: transferTransactionRequest.to,
      value: transferTransactionRequest.value.toString(),
      gasFee: transferTransactionRequest.gasFee,
    };
  }

  async getTransactions(walletAddress): Promise<void> {
    let transactions = [];

    const tokenAccounts = await this.network
      .getProvider()
      .getParsedTokenAccountsByOwner(new PublicKey(walletAddress), { mint: new PublicKey(this.address) });

    const accountAddress = tokenAccounts.value[0]?.pubkey;

    if (accountAddress) {
      const confirmedSignatures = await this.network
        .getProvider()
        .getConfirmedSignaturesForAddress2(new PublicKey(accountAddress));
      const signatures = confirmedSignatures.map(item => item.signature);
      const confirmedTransactions = await this.network.getProvider().getParsedConfirmedTransactions(signatures);

      transactions = confirmedTransactions.map(item => {
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
          if (
            instruction?.programId?.publicKey == TOKEN_PROGRAM_ID.publicKey &&
            instruction?.parsed?.type == "transfer"
          ) {
            const info = instruction?.parsed?.info;
            if (info) {
              const amount = ethers.utils.formatUnits(info.amount.toString(), this.decimals).toString();
              dataTransaction.from = info.source;
              dataTransaction.to = info.destination;

              if (dataTransaction.to == accountAddress) {
                dataTransaction.receive_token = this.address;
                dataTransaction.receive_value = amount;
                dataTransaction.receive_quote = "0";
                dataTransaction.type = "receive";
                dataTransaction.to = walletAddress;
              }

              if (dataTransaction.from == accountAddress) {
                dataTransaction.send_token = this.address;
                dataTransaction.send_value = amount;
                dataTransaction.send_quote = "0";
                dataTransaction.type = "send";
                dataTransaction.from = walletAddress;
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
    }

    return transactions;
    // return super.getTransactions(walletAddress);
  }
}
