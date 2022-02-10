import ERC20 from "./ERC20";
import BEP20 from "./BEP20";
import SPL from "./SPL";
// ----------------------------------
export const SUFFIX_NFT_NETWORK = "NFT";

//
// ----- TEST 
import * as mainet from './config/net.json'
import * as _type from "./types";

const TESTNET_PROVIDER: _type.Web3Provider = {
  rpcUrl: 'https://rinkeby.infura.io/v3/5ffc47f65c4042ce847ef66a3fa70d4c',
  explorer: 'https://testnet.bscscan.com'
}

// const MAINNET_PROVIDER: _type.Web3Provider = {
//   rpcUrl: process.env.BSC_MAINNET_PROVIDER || 'https://bsc-dataseed.binance.org/',
//   explorer: process.env.BSC_MAINNET_PROVIDER || 'https://bscscan.com'

// }

const MAINNET_PROVIDER: _type.Web3Provider = {
  rpcUrl: 'https://bsc-dataseed.binance.org/',
  explorer: 'https://bscscan.com'

}

const network = {
  mainnet: MAINNET_PROVIDER,
  testnet: TESTNET_PROVIDER
}

const bep20 =  new BEP20(network['mainnet'], mainet['BSC']);
console.log(bep20)

// --------------------------

export {
  ERC20,
  BEP20,
  SPL
}