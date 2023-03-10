import { Alchemy, Network } from "alchemy-sdk";

const settings = {
    apiKey: "N4A4fPmdit_6lZ-apnLlWgIJRqXXDj_a",
    network: Network.ETH_GOERLI,
}

const alchemy = new Alchemy(settings)

export {
    alchemy
}