import axios from "axios";

const API_URL = "https://api.unmarshal.com";
const KEY = "t3CB1qwJw84EGoIy6x3nM1472AeLya4EaVTfFO44";

// SOL
const BASE_URL = "https://api.solscan.io/";
const API = axios.create({
  baseURL: BASE_URL,
});


export interface Params {
  auth_key: string,
  page: number,
  pageSize: number,
  contract?: string
}

export function getTransactionsApi(walletAddress: string, chainId: string, contractAddress: string, page = 1) {
  const url = API_URL + `/v2/${chainId}/address/${walletAddress}/transactions`;

  const params: Params = {
    auth_key: KEY,
    page: page,
    pageSize: 50,
  };
  if (contractAddress) {
    params.contract = contractAddress;
  }
  return axios.get(url, {
    params: params,
  });
}

export function getTokenBalancesApi(walletAddress: string, chainId: string) {
  const url = API_URL + `/v2/${chainId}/address/${walletAddress}/assets`;

  const params = {
    auth_key: KEY,
  };
  return axios.get(url, {
    params: params,
  });
}

///
export function getAccountApi(address: string) {
    const url = BASE_URL + "account";
    return axios.get(url, {
      params: { address },
    });
  }
  
  export function getTokenMetaApi(tokenAddress: string) {
    const url = BASE_URL + "token/meta";
    return API.get(url, {
      params: { token: tokenAddress },
    });
  }
  
