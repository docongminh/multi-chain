# @coreproject/networks
  Blockchain networks
  
# Description

  Example BEP20:
  ```typescript
    const net_info = {
      "BSC": {
          "network_id": 2,
          "name": "Binance Smart Chain",
          "short_name": "BEP20",
          "symbol": "BSC",
          "chain_id": 56,
          "explorer_url": "https://bscscan.com",
          "wallet_derive_path": "m/44'/60'/0'/0/0",
          "icon_url": "https://d1j8r0kxyu9tj8.cloudfront.net/files/16300793165gXeMDHB9uhQuHt.png",
          "native_token": {
            "name": "Binance Smart Chain",
            "symbol": "BNB",
            "decimals": 18,
            "address": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
      }
    };
    const TESTNET_PROVIDER: _type.Web3Provider = {
      rpcUrl: 'https://rinkeby.infura.io/v3/5ffc47f65c4042ce847ef66a3fa70d4c',
      explorer: 'https://testnet.bscscan.com'
    }

    const MAINNET_PROVIDER: _type.Web3Provider = {
      rpcUrl: process.env.BSC_MAINNET_PROVIDER || 'https://bsc-dataseed.binance.org/',
      explorer: process.env.BSC_MAINNET_PROVIDER || 'https://bscscan.com'

    }

    const network = {
      mainnet: MAINNET_PROVIDER,
      testnet: TESTNET_PROVIDER
    }

    const bep20_mainnet =  new BEP20(network['mainnet'], net_info['BSC']);
    console.log(bep20_mainnet)
    //
    const bep20_testnet =  new BEP20(network['testnet'], net_info['BSC']);
    console.log(bep20_testnet)
  ```
