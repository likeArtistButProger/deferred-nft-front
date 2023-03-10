import { useState, useEffect, useCallback, useMemo } from "react";
import { useWeb3React } from "@web3-react/core";
import { useContract } from "./useContract";
import { deferredBuyAddress, alchemy } from "../constants";
import DeferredBuyAbi from "../abis/DeferredBuy.json";

import type { OwnedNft } from "alchemy-sdk";
import type { Offer, UsableOffer } from "../types";
import { DeferredBuy } from "../abis/types";

const useOffers = () => {
    const { account } = useWeb3React();
    const [offers, setOffers] = useState<Offer[]>([]);
    const [ownedNfts, setOwnedNfts] = useState<OwnedNft[]>([]);
    const deferredBuyContract = useContract<DeferredBuy>(deferredBuyAddress, DeferredBuyAbi);

    const fetchOffers = useCallback(async () => {
        if(!!deferredBuyContract && !!account) {
            const offersRaw = await deferredBuyContract.getAllOffers();

            const claimsHappenedRequests = [];

            for(let i = 0; i < offersRaw.length; i++) {
                const req = deferredBuyContract.claimedOffers(i);

                claimsHappenedRequests.push(req);
            }

            const claimedCounts = await Promise.all(claimsHappenedRequests);

            const offersToSet = [];

            for(let offerIndex = 0; offerIndex < offersRaw.length; offerIndex++) {
                const offerRaw = offersRaw[offerIndex];
                const claimedCount = claimedCounts[offerIndex];

                const offer: Offer = {
                    offerId:            offerIndex,
                    nftAddress:         offerRaw.nftAddress,
                    availableAt:        offerRaw.availableAt,
                    maxClaims:          offerRaw.maxClaims,
                    claimedTokensCount: claimedCount,
                    offerPrice:         offerRaw.offerPrice
                }

                offersToSet.push(offer);
            }

            setOffers(offersToSet)
        }
    }, [account, deferredBuyContract, setOffers]);

    const fetchOwnedNfts = useCallback(async () => {
        if(!!account) {
            const nfts = await alchemy.nft.getNftsForOwner(account);

            setOwnedNfts(nfts.ownedNfts);
        }
    }, [account]);

    const usableOffers: UsableOffer[] = useMemo(() => {
        if(!!offers && !!ownedNfts) {
            const result: UsableOffer[] = [];
            for(const offer of offers) {
                for(const nft of ownedNfts) {
                    if(
                        nft.tokenType === "ERC721"
                        && nft.contract.address.toLowerCase() === offer.nftAddress.toLowerCase()
                    ) {
                        const offerToAdd = Object.assign({}, nft, offer);
                        
                        result.push(offerToAdd);
                    }
                }
            }

            return result;
        }

        return [];
    }, [offers, ownedNfts]);

    useEffect(() => {
        fetchOffers();

        const interval = setInterval(() => {
            fetchOffers();
        }, 10_000);

        return () => {
            clearInterval(interval);
        }
    }, [fetchOffers]);

    useEffect(() => {
        fetchOwnedNfts();
        
        const interval = setInterval(() => {
            fetchOwnedNfts();
        }, 60_000);

        return () => {
            clearInterval(interval);
        }
    }, [fetchOwnedNfts]);

    return { offers: usableOffers, updateOffers: fetchOffers };
}

export {
    useOffers
}