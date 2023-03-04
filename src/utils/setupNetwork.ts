import { networkSetupConfigs } from "../constants";

type Window = {
  ethereum?: any,
}

export const setupNetwork = async (configName: "goerli") => {
    // @ts-ignore
    const provider = (window as Window).ethereum;;

    if (provider) {
      const config = networkSetupConfigs[configName];

      if (!config) {
        return false;
      }

      try {
        if (provider) {
          // @ts-ignore
          await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{chainId: config.chainId}],
          });

          return true;
          // @ts-ignore
        } else if (window.BinanceChain) {
          let networkId = 'bsc-mainnet'
          if (config.chainId === '0x1')
            networkId = 'eth-mainnet'
          // @ts-ignore
          provider.switchNetwork(networkId)
          return true
        }

        return false;
      } catch (switchError: any) {
        console.log(switchError)
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            // @ts-ignore
            await provider.request({
              method: 'wallet_addEthereumChain',
              params: [config],
            });
          } catch (addError) {
            return Promise.reject(addError);
          }
        }
        return Promise.reject(switchError);
      }
    }

    return true;
}