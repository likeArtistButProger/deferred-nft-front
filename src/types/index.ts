import { ethers } from "ethers"
import { OwnedNft } from "alchemy-sdk";

export enum OfferItemType {
    ERC721  = 0,
    ERC1155 = 1
}

export type OfferItem = {
    itemType:   OfferItemType,
    token:      string,
    identifier: ethers.BigNumber,
    amount:     ethers.BigNumber
}

export type Offer = {
    offerId:              number,
    item:                 OfferItem,
    offerer:              string,
    availableAt:          number,
    pricePerUnit:         ethers.BigNumber,
    claimed:              ethers.BigNumber,
}

export interface UsableOffer extends Offer, OwnedNft {}