'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var bignumber = require('@ethersproject/bignumber');
var providers = require('@ethersproject/providers');
var contracts = require('@ethersproject/contracts');
var units = require('@ethersproject/units');
var Web3 = require('web3');
var axios = require('axios');
var nacl = require('tweetnacl');
var web3_js = require('@solana/web3.js');
var splToken = require('@solana/spl-token');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Web3__default = /*#__PURE__*/_interopDefaultLegacy(Web3);
var axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);
var nacl__default = /*#__PURE__*/_interopDefaultLegacy(nacl);

class Network {
  constructor(name, rpcURL, chainID, symbol, nativeToken, explorerUrl) {
    this.name = void 0;
    this.rpcURL = void 0;
    this.chainID = void 0;
    this.symbol = void 0;
    this.explorerUrl = void 0;
    this.nativeToken = void 0;
    this.name = name;
    this.rpcURL = rpcURL;
    this.chainID = chainID;
    this.symbol = symbol;
    this.explorerUrl = explorerUrl;

    if (!nativeToken) {
      throw new Error("Constructor do not add native token parameter");
    }

    this.nativeToken = nativeToken;
  }

  async getContractMetadata(contractAddress) {
    throw new Error("Abstract Method has no implementation");
  }

  async getBalance(address) {
    throw new Error("Abstract Method has no implementation");
  }

  getSigner(wallet) {
    throw new Error("Abstract Method has no implementation");
  }

  getTransactionFee(gasFee) {
    return units.formatUnits(gasFee.toString(), this.nativeToken.decimals);
  }

  getUnitCost() {
    return this.nativeToken.symbol;
  }

  async createTransactionOrder(wallet, order) {
    throw new Error("Abstract Method has no implementation");
  }

  async sendTransaction(wallet, transactionRequest) {
    throw new Error("Abstract Method has no implementation");
  }

  async getTokenBalances(walletAddress) {
    throw new Error("Abstract Method has no implementation");
  }

  checkAddress(address) {
    throw new Error("Abstract Method has no implementation");
  }

  onTransactionConfirmed(txHash, callback) {
    throw new Error("Abstract Method has no implementation");
  }

  getExplorerUrl(type, value) {
    throw new Error("Abstract Method has no implementation");
  }

  signMessage(wallet, message) {
    throw new Error("Abstract Method has no implementation");
  }

}

const ethABI = [{
  constant: true,
  inputs: [],
  name: "name",
  outputs: [{
    name: "",
    type: "string"
  }],
  payable: false,
  stateMutability: "view",
  type: "function"
}, {
  constant: false,
  inputs: [{
    name: "_spender",
    type: "address"
  }, {
    name: "_value",
    type: "uint256"
  }],
  name: "approve",
  outputs: [{
    name: "success",
    type: "bool"
  }],
  payable: false,
  stateMutability: "nonpayable",
  type: "function"
}, {
  constant: true,
  inputs: [],
  name: "totalSupply",
  outputs: [{
    name: "",
    type: "uint256"
  }],
  payable: false,
  stateMutability: "view",
  type: "function"
}, {
  constant: false,
  inputs: [{
    name: "_from",
    type: "address"
  }, {
    name: "_to",
    type: "address"
  }, {
    name: "_value",
    type: "uint256"
  }],
  name: "transferFrom",
  outputs: [{
    name: "success",
    type: "bool"
  }],
  payable: false,
  stateMutability: "nonpayable",
  type: "function"
}, {
  constant: true,
  inputs: [],
  name: "decimals",
  outputs: [{
    name: "",
    type: "uint8"
  }],
  payable: false,
  stateMutability: "view",
  type: "function"
}, {
  constant: true,
  inputs: [],
  name: "version",
  outputs: [{
    name: "",
    type: "string"
  }],
  payable: false,
  stateMutability: "view",
  type: "function"
}, {
  constant: true,
  inputs: [{
    name: "_owner",
    type: "address"
  }],
  name: "balanceOf",
  outputs: [{
    name: "balance",
    type: "uint256"
  }],
  payable: false,
  stateMutability: "view",
  type: "function"
}, {
  constant: true,
  inputs: [],
  name: "symbol",
  outputs: [{
    name: "",
    type: "string"
  }],
  payable: false,
  stateMutability: "view",
  type: "function"
}, {
  constant: false,
  inputs: [{
    name: "_to",
    type: "address"
  }, {
    name: "_value",
    type: "uint256"
  }],
  name: "transfer",
  outputs: [{
    name: "success",
    type: "bool"
  }],
  payable: false,
  stateMutability: "nonpayable",
  type: "function"
}, {
  constant: true,
  inputs: [{
    name: "_owner",
    type: "address"
  }, {
    name: "_spender",
    type: "address"
  }],
  name: "allowance",
  outputs: [{
    name: "remaining",
    type: "uint256"
  }],
  payable: false,
  stateMutability: "view",
  type: "function"
}, {
  inputs: [{
    name: "_initialAmount",
    type: "uint256"
  }, {
    name: "_tokenName",
    type: "string"
  }, {
    name: "_decimalUnits",
    type: "uint8"
  }, {
    name: "_tokenSymbol",
    type: "string"
  }],
  payable: false,
  stateMutability: "nonpayable",
  type: "constructor"
}, {
  payable: false,
  stateMutability: "nonpayable",
  type: "fallback"
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    name: "_from",
    type: "address"
  }, {
    indexed: true,
    name: "_to",
    type: "address"
  }, {
    indexed: false,
    name: "_value",
    type: "uint256"
  }],
  name: "Transfer",
  type: "event"
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    name: "_owner",
    type: "address"
  }, {
    indexed: true,
    name: "_spender",
    type: "address"
  }, {
    indexed: false,
    name: "_value",
    type: "uint256"
  }],
  name: "Approval",
  type: "event"
}];
const abi = {
  "ETH": ethABI,
  "BSC": ethABI
};
var abi$1 = abi;

const SYMBOL_2_CHAINID = {
  "BSC": 56,
  "ETH": 1,
  "MATIC": 137
};

const API_URL = "https://api.unmarshal.com";
const KEY = "t3CB1qwJw84EGoIy6x3nM1472AeLya4EaVTfFO44"; // SOL

const BASE_URL = "https://api.solscan.io/";
const API = axios__default["default"].create({
  baseURL: BASE_URL
});
function getTokenBalancesApi(walletAddress, chainId) {
  const url = API_URL + `/v2/${chainId}/address/${walletAddress}/assets`;
  const params = {
    auth_key: KEY
  };
  return axios__default["default"].get(url, {
    params: params
  });
} ///
function getTokenMetaApi(tokenAddress) {
  const url = BASE_URL + "token/meta";
  return API.get(url, {
    params: {
      token: tokenAddress
    }
  });
}

class ERC20 extends Network {
  constructor(config) {
    //
    const native_token = {
      name: config.native_token.name,
      symbol: config.native_token.symbol,
      decimals: config.native_token.decimals,
      address: config.native_token.address
    };
    super(config.name, config.rpc_url, config.chain_id, config.symbol, native_token, config.explorer_url);
    this._provider = void 0;
    this._provider = new providers.JsonRpcProvider(this.rpcURL);
  }

  set provider(value) {
    this._provider = value;
  }

  async getContractMetadata(contractAddress) {
    const contract = new contracts.Contract(contractAddress, abi$1[this.symbol], this._provider);
    const name = await contract.functions.name();
    const decimals = await contract.functions.decimals();
    const symbol = await contract.functions.symbol();
    return {
      name: name[0],
      decimals: decimals[0],
      symbol: symbol[0],
      address: contractAddress,
      icon_url: "https://d1j8r0kxyu9tj8.cloudfront.net/files/1628005162N7PDZHhVuV8nXQf.png"
    };
  }

  getProvider() {
    return this._provider;
  }

  async getBalance(address) {
    return await this._provider.getBalance(address).toString();
  }

  getSigner(wallet) {
    return wallet.connect(this._provider);
  }

  async createTransactionOrder(wallet, order) {
    var _transactionRequest$d, _transactionRequest$v;

    if (order.gas && !order.gasLimit) {
      order.gasLimit = order.gas;
      delete order.gas;
    }

    wallet = this.getSigner(wallet);
    const transactionRequest = await wallet.populateTransaction(order);
    const maxPriorityFeePerGas = bignumber.BigNumber.from("2000000000");
    return {
      from: transactionRequest.from,
      to: transactionRequest.to,
      nonce: bignumber.BigNumber.from(transactionRequest.nonce).toString(),
      data: (_transactionRequest$d = transactionRequest.data) === null || _transactionRequest$d === void 0 ? void 0 : _transactionRequest$d.toString(),
      value: bignumber.BigNumber.from((_transactionRequest$v = transactionRequest.value) !== null && _transactionRequest$v !== void 0 ? _transactionRequest$v : "0").toString(),
      maxPriorityFeePerGas: bignumber.BigNumber.from(maxPriorityFeePerGas).toString(),
      maxFeePerGas: bignumber.BigNumber.from(transactionRequest.maxFeePerGas).toString(),
      gasLimit: bignumber.BigNumber.from(transactionRequest.gasLimit).toString(),
      gasPrice: bignumber.BigNumber.from(transactionRequest.maxFeePerGas).toString(),
      gasFee: bignumber.BigNumber.from(transactionRequest.maxFeePerGas).add(maxPriorityFeePerGas).mul(transactionRequest.gasLimit).toString()
    };
  }

  async sendTransaction(wallet, transactionRequest) {
    var _transactionRequest$d2, _transactionResponse$;

    const transaction = {
      type: 2,
      from: transactionRequest.from,
      to: transactionRequest.to,
      nonce: Number.parseInt(transactionRequest.nonce, 10),
      data: (_transactionRequest$d2 = transactionRequest.data) === null || _transactionRequest$d2 === void 0 ? void 0 : _transactionRequest$d2.toString(),
      value: bignumber.BigNumber.from(transactionRequest.value),
      maxPriorityFeePerGas: bignumber.BigNumber.from(transactionRequest.maxPriorityFeePerGas),
      maxFeePerGas: bignumber.BigNumber.from(transactionRequest.maxFeePerGas),
      gasLimit: bignumber.BigNumber.from(transactionRequest.gasLimit)
    };
    wallet = this.getSigner(wallet);
    const transactionResponse = await wallet.sendTransaction(transaction);
    return {
      tx: transactionResponse.hash,
      from: transactionResponse.from,
      to: transactionResponse.to,
      nonce: transactionResponse.nonce.toString(),
      data: (_transactionResponse$ = transactionResponse.data) === null || _transactionResponse$ === void 0 ? void 0 : _transactionResponse$.toString(),
      value: units.formatUnits(transactionResponse.value, this.nativeToken.decimals),
      maxFeePerGas: bignumber.BigNumber.from(transactionResponse.maxFeePerGas).toString(),
      maxPriorityFeePerGas: bignumber.BigNumber.from(transactionResponse.maxPriorityFeePerGas).toString(),
      gasLimit: bignumber.BigNumber.from(transactionResponse.gasLimit).toString(),
      gasPrice: bignumber.BigNumber.from(transactionResponse.maxFeePerGas).toString(),
      gasFee: bignumber.BigNumber.from(transactionResponse.maxFeePerGas).add(bignumber.BigNumber.from(transactionResponse.maxPriorityFeePerGas)).mul(transactionResponse.gasLimit).toString()
    };
  }

  async getTokenBalances(walletAddress) {
    const res = await getTokenBalancesApi(walletAddress, SYMBOL_2_CHAINID[this.symbol].toString());
    let tokensBalances = [];

    if (res.data) {
      tokensBalances = res.data.map(item => {
        return {
          address: item.contract_address,
          symbol: item.contract_ticker_symbol,
          network: this.symbol,
          amount: units.formatUnits(item.balance, item.contract_decimals)
        };
      });
    }

    return tokensBalances;
  }

  checkAddress(address) {
    if (address.length == 42 && address.slice(0, 2) == "0x") {
      const re = /^[0-9A-Fa-f]*$/g;
      return re.test(address.slice(2));
    }

    return false;
  }

  onTransactionConfirmed(tx, callback) {
    setTimeout(() => {
      this._provider.getTransaction(tx).then(transaction => {
        if (transaction) {
          transaction.wait().then(receipt => {
            var _receipt$gasUsed;

            callback({
              tx,
              block: receipt.blockNumber,
              fee: (_receipt$gasUsed = receipt.gasUsed) === null || _receipt$gasUsed === void 0 ? void 0 : _receipt$gasUsed.mul(transaction.gasPrice).toString(),
              status: receipt.status ? "completed" : "error"
            });
          }).catch(e => {
            console.log("onTransactionConfirmed1" + e);
            callback();
          });
        } else {
          this.onTransactionConfirmed(tx, callback);
        }
      }).catch(e => {
        console.log("onTransactionConfirmed2" + e);
        callback();
      });
    }, 2000);
  }

  getExplorerUrl(type, value) {
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

  signMessage(wallet, message) {
    const web3 = new Web3__default["default"]();
    return web3.eth.accounts.sign(message, wallet.privateKey).signature;
  }

}

class BEP20 extends Network {
  constructor(config) {
    //
    const native_token = {
      name: config.native_token.name,
      symbol: config.native_token.symbol,
      decimals: config.native_token.decimals,
      address: config.native_token.address
    };
    super(config.name, config.rpc_url, config.chain_id, config.symbol, native_token, config.explorer_url);
    this._provider = void 0;
    this._provider = new providers.JsonRpcProvider(this.rpcURL);
  }

  set provider(value) {
    this._provider = value;
  }

  async getContractMetadata(contractAddress) {
    const contract = new contracts.Contract(contractAddress, abi$1[this.symbol], this._provider);
    const name = await contract.functions.name();
    const decimals = await contract.functions.decimals();
    const symbol = await contract.functions.symbol();
    return {
      name: name[0],
      decimals: decimals[0],
      symbol: symbol[0],
      address: contractAddress,
      icon_url: "https://d1j8r0kxyu9tj8.cloudfront.net/files/1628005345XtePsjK1WdF2qlN.png"
    };
  }

  getProvider() {
    return this._provider;
  }

  async getBalance(address) {
    return await this._provider.getBalance(address).toString();
  }

  async createTransactionOrder(wallet, order) {
    var _transactionRequest$n, _transactionRequest$v, _transactionRequest$d;

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
      nonce: (_transactionRequest$n = transactionRequest.nonce) === null || _transactionRequest$n === void 0 ? void 0 : _transactionRequest$n.toString(),
      value: bignumber.BigNumber.from((_transactionRequest$v = transactionRequest.value) !== null && _transactionRequest$v !== void 0 ? _transactionRequest$v : "0").toString(),
      data: (_transactionRequest$d = transactionRequest.data) === null || _transactionRequest$d === void 0 ? void 0 : _transactionRequest$d.toString(),
      gasPrice: bignumber.BigNumber.from(transactionRequest.gasPrice).toString(),
      gasLimit: bignumber.BigNumber.from(transactionRequest.gasLimit).toString(),
      gasFee: bignumber.BigNumber.from(transactionRequest.gasPrice).mul(transactionRequest.gasLimit).toString()
    };
  }

  async sendTransaction(wallet, transactionRequest) {
    var _transactionRequest$d2, _transactionRequest$v2, _transactionRequest$g, _transactionRequest$g2, _transactionResponse$, _transactionResponse$2, _transactionResponse$3;

    const transaction = {
      from: transactionRequest.from,
      to: transactionRequest.to,
      nonce: Number.parseInt(transactionRequest.nonce),
      data: (_transactionRequest$d2 = transactionRequest.data) === null || _transactionRequest$d2 === void 0 ? void 0 : _transactionRequest$d2.toString(),
      value: bignumber.BigNumber.from((_transactionRequest$v2 = transactionRequest.value) === null || _transactionRequest$v2 === void 0 ? void 0 : _transactionRequest$v2.toString()),
      gasPrice: bignumber.BigNumber.from((_transactionRequest$g = transactionRequest.gasPrice) === null || _transactionRequest$g === void 0 ? void 0 : _transactionRequest$g.toString()),
      gasLimit: bignumber.BigNumber.from((_transactionRequest$g2 = transactionRequest.gasLimit) === null || _transactionRequest$g2 === void 0 ? void 0 : _transactionRequest$g2.toString())
    };
    wallet = this.getSigner(wallet);
    const transactionResponse = await wallet.sendTransaction(transaction);
    return {
      tx: transactionResponse.hash,
      from: transactionResponse.from,
      to: transactionResponse.to,
      nonce: transactionResponse.nonce.toString(),
      value: (_transactionResponse$ = transactionResponse.value) === null || _transactionResponse$ === void 0 ? void 0 : _transactionResponse$.toString(),
      data: (_transactionResponse$2 = transactionResponse.data) === null || _transactionResponse$2 === void 0 ? void 0 : _transactionResponse$2.toString(),
      gasPrice: (_transactionResponse$3 = transactionResponse.gasPrice) === null || _transactionResponse$3 === void 0 ? void 0 : _transactionResponse$3.toString(),
      gasLimit: transactionResponse.gasLimit.toString(),
      gasFee: bignumber.BigNumber.from(transactionResponse.gasPrice).mul(transactionResponse.gasLimit).toString()
    };
  }

  async getTokenBalances(walletAddress) {
    const res = await getTokenBalancesApi(walletAddress, SYMBOL_2_CHAINID[this.symbol].toString());
    let tokensBalances = [];

    if (res.data) {
      tokensBalances = res.data.map(item => {
        return {
          address: item.contract_address,
          symbol: item.contract_ticker_symbol,
          network: this.symbol,
          amount: units.formatUnits(item.balance, item.contract_decimals)
        };
      });
    }

    return tokensBalances;
  }

  checkAddress(address) {
    if (address.length == 42 && address.slice(0, 2) == "0x") {
      const re = /^[0-9A-Fa-f]*$/g;
      return re.test(address.slice(2));
    }

    return false;
  }

  onTransactionConfirmed(tx, callback) {
    setTimeout(() => {
      this._provider.getTransaction(tx).then(transaction => {
        if (transaction) {
          transaction.wait().then(receipt => {
            var _receipt$gasUsed;

            callback({
              tx,
              block: receipt.blockNumber,
              fee: (_receipt$gasUsed = receipt.gasUsed) === null || _receipt$gasUsed === void 0 ? void 0 : _receipt$gasUsed.mul(transaction.gasPrice).toString(),
              status: receipt.status ? "completed" : "error"
            });
          }).catch(e => {
            console.log("onTransactionConfirmed1" + e);
            callback();
          });
        } else {
          this.onTransactionConfirmed(tx, callback);
        }
      }).catch(e => {
        console.log("onTransactionConfirmed2" + e);
        callback();
      });
    }, 2000);
  }

  getExplorerUrl(type, value) {
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

  signMessage(wallet, message) {
    const web3 = new Web3__default["default"]();
    return web3.eth.accounts.sign(message, wallet.privateKey).signature;
  }

}

class SPL extends Network {
  constructor(config) {
    //
    const native_token = {
      name: config.native_token.name,
      symbol: config.native_token.symbol,
      decimals: config.native_token.decimals,
      address: config.native_token.address
    };
    super(config.name, config.rpc_url, config.chain_id, config.symbol, native_token, config.explorer_url);
    this._provider = void 0;
    this._provider = new web3_js.Connection(this.rpcURL);
  }

  async getContractMetadata(contractAddress) {
    var _res$data;

    const res = await getTokenMetaApi(contractAddress);
    const tokenInfo = (_res$data = res.data) === null || _res$data === void 0 ? void 0 : _res$data.data;

    if (tokenInfo) {
      return {
        name: tokenInfo === null || tokenInfo === void 0 ? void 0 : tokenInfo.name,
        decimals: tokenInfo === null || tokenInfo === void 0 ? void 0 : tokenInfo.decimals,
        symbol: tokenInfo === null || tokenInfo === void 0 ? void 0 : tokenInfo.symbol,
        address: contractAddress,
        icon_url: tokenInfo === null || tokenInfo === void 0 ? void 0 : tokenInfo.icon
      };
    }

    return null;
  }

  getProvider() {
    return this._provider;
  }

  async getBalance(address) {
    return (await this._provider.getBalance(new web3_js.PublicKey(address))).toString();
  }

  async getTokenBalances(walletAddress) {
    const result = await this._provider.getParsedTokenAccountsByOwner(new web3_js.PublicKey(walletAddress), {
      programId: splToken.TOKEN_PROGRAM_ID
    });
    const balanceNativeToken = await this.getBalance(walletAddress);
    const amountNativeToken = units.formatUnits(balanceNativeToken, this.nativeToken.decimals);
    let tokensBalances = result.value.map(item => {
      var _item$account, _item$account$data, _item$account$data$pa, _item$account$data$pa2, _item$account2, _item$account2$data, _item$account2$data$p, _item$account2$data$p2, _item$account2$data$p3;

      return {
        address: item === null || item === void 0 ? void 0 : (_item$account = item.account) === null || _item$account === void 0 ? void 0 : (_item$account$data = _item$account.data) === null || _item$account$data === void 0 ? void 0 : (_item$account$data$pa = _item$account$data.parsed) === null || _item$account$data$pa === void 0 ? void 0 : (_item$account$data$pa2 = _item$account$data$pa.info) === null || _item$account$data$pa2 === void 0 ? void 0 : _item$account$data$pa2.mint,
        amount: item === null || item === void 0 ? void 0 : (_item$account2 = item.account) === null || _item$account2 === void 0 ? void 0 : (_item$account2$data = _item$account2.data) === null || _item$account2$data === void 0 ? void 0 : (_item$account2$data$p = _item$account2$data.parsed) === null || _item$account2$data$p === void 0 ? void 0 : (_item$account2$data$p2 = _item$account2$data$p.info) === null || _item$account2$data$p2 === void 0 ? void 0 : (_item$account2$data$p3 = _item$account2$data$p2.tokenAmount) === null || _item$account2$data$p3 === void 0 ? void 0 : _item$account2$data$p3.uiAmountString,
        network: this.symbol
      };
    });
    tokensBalances = [...tokensBalances, {
      address: this.nativeToken.address,
      network: this.symbol,
      amount: amountNativeToken
    }];
    return tokensBalances;
  }

  checkAddress(address) {
    try {
      const publicKey = new web3_js.PublicKey(address);
      return true;
    } catch (e) {
      return false;
    }
  }

  onTransactionConfirmed(tx, callback) {
    setTimeout(() => {
      try {
        this._provider.onSignature(tx, async () => {
          var _data$meta, _data$meta$fee, _data$meta2;

          const data = await this._provider.getConfirmedTransaction(tx);
          callback({
            tx,
            block: data === null || data === void 0 ? void 0 : data.slot,
            fee: data === null || data === void 0 ? void 0 : (_data$meta = data.meta) === null || _data$meta === void 0 ? void 0 : (_data$meta$fee = _data$meta.fee) === null || _data$meta$fee === void 0 ? void 0 : _data$meta$fee.toString(),
            status: !(data !== null && data !== void 0 && (_data$meta2 = data.meta) !== null && _data$meta2 !== void 0 && _data$meta2.err) ? "completed" : "error"
          });
        }, "finalized");
      } catch (e) {
        console.log("SPL.onTransactionConfirmed" + e);
      }
    }, 2000);
  }

  getExplorerUrl(type, value) {
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

  signMessage(wallet, message) {
    return nacl__default["default"].sign.detached(message, wallet.provider.secretKey);
  }

}

const SUFFIX_NFT_NETWORK = "NFT";

exports.BEP20 = BEP20;
exports.ERC20 = ERC20;
exports.SPL = SPL;
exports.SUFFIX_NFT_NETWORK = SUFFIX_NFT_NETWORK;
//# sourceMappingURL=index.commonjs.js.map
