export const networkSetupConfigs: {
    goerli: { [x: string]: any }
} = {
  goerli: {
    chainId: "0x5",
    chainName: "Goerli",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
      scanAddress: '-'
    },
    rpcUrls: ["https://goerli.infura.io/v3/"],
    blockExplorerUrls: ["https://goerli.etherscan.io"]
  },
//   polygon: {
//     chainId: `0x89`,
//     // chainIdNumber: 137,
//     chainName: 'Polygon Mainnet',
//     nativeCurrency: {
//       name: 'Matic',
//       symbol: 'MATIC',
//       decimals: 18,
//       scanAddress: '-'
//     },
//     rpcUrls: ["https://rpc-mainnet.maticvigil.com/"],
//     blockExplorerUrls: [`https://polygonscan.com/`]
//   },
}
