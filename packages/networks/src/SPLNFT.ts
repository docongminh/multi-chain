import SPL from "./SPL"
import * as _type from "./types";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import { ObjectUtils } from "@coreproject/utils";

export default class SPLNFT extends SPL {
  constructor(useMainNet: boolean) {
    super(useMainNet);
  }

  async getTokenBalances(walletAddress: string): Promise<_type.NFTTokenBalance[]> {
    let tokens = await Metadata.findDataByOwner(this.getProvider(), walletAddress);
    tokens = tokens
      .map((item: any) => {
        return {
          network: this.symbol,
          address: item.mint,
          name: item?.data?.name,
          symbol: item?.data?.symbol,
          metadata_uri: item?.data?.uri,
          amount: "1",
          decimals: "0",
        };
      })
      .filter((item: any) => !ObjectUtils.isEmpty(item.metadata_uri));
    return tokens;
  }
}
