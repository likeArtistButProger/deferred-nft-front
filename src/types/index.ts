import { ethers } from "ethers"
import { OwnedNft } from "alchemy-sdk";

export type Offer = {
    offerId:              number,
    nftAddress:           string,
    availableAt:          number,
    maxClaims:            number,
    claimedTokensCount:   ethers.BigNumber,
    offerPrice:           ethers.BigNumber,
}

export interface UsableOffer extends OwnedNft {
    offerId:              number,
    nftAddress:           string,
    availableAt:          number,
    maxClaims:            number,
    claimedTokensCount:   ethers.BigNumber,
    offerPrice:           ethers.BigNumber,
}