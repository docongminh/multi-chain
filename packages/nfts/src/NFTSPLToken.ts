import SPL from "@coreproject/networks";
import { SPLToken } from "@coreproject/tokens";
import type { NFTTokenBalance } from "@coreproject/network";
import axios from "axios";

export default class NFTSPLToken extends SPLToken {
  _metadata = null;
  _metadata_uri = "";

  constructor(nftData: NFTTokenBalance, network: SPL) {
    super(nftData.name, nftData.symbol, nftData.decimals, null, nftData.address, null, network);
    this._metadata_uri = nftData.metadata_uri;
  }

  async metadata() {
    if (!this._metadata) {
      const res = await axios.get(this._metadata_uri);
      this._metadata = res.data;
    }

    return this._metadata;
  }
  getNFTExplorerUrl() {
    return `${this.network.explorerUrl}/account/${this.address}`;
  }
}
