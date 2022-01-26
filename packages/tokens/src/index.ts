import { BEP20Token } from "./BEP20Token";
import { ERC20Token } from "./ERC20Token";
import { ETHToken } from "./ETHToken";
import { BNBToken } from "./BNBToken";
import { SOLToken } from "./SOLToken";
import { SPLToken } from "./SPLToken";
import { Network } from "@coreproject/networks";
import networks from "../networks";
import abi from "./config/abi";
import { Token } from "./Token";

const tokens = {
  BSC: BEP20Token,
  ETH: ERC20Token,
  ETHETH: ETHToken,
  BSCBNB: BNBToken,
  SOL: SPLToken,
  SOLSOL: SOLToken,
};

export function createToken(tokenSchema) {
  if (tokenSchema) {
    let ClassToken: Token;
    if (tokens[tokenSchema.network.symbol + tokenSchema.symbol]) {
      ClassToken = tokens[tokenSchema.network.symbol + tokenSchema.symbol];
    } else {
      ClassToken = tokens[tokenSchema.network.symbol];
    }

    const network: Network = networks[tokenSchema.network.symbol];
    return new ClassToken(
      tokenSchema.name,
      tokenSchema.symbol,
      tokenSchema.decimals,
      tokenSchema.icon_url,
      tokenSchema.address,
      tokenSchema.abi ? JSON.parse(tokenSchema.abi) : abi[tokenSchema.network.symbol],
      network,
    );
  }
  return null;
}

export default tokens;
