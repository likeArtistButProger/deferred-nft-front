import { InjectedConnector } from '@web3-react/injected-connector';

export const Injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 10, 42, 56, 97, 137, 32520, 80001, 1337, 42161, 421611, 43114, 43113, 1313161554]
});