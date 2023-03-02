import { ethers } from "ethers"

export type Offer = {
    nftAddress:  string,
    availableAt: number,
    claimed:     boolean,
    tokenId:     ethers.BigNumber,
    offerPrice:  ethers.BigNumber,
}