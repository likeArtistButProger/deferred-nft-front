import { useState, useEffect, useCallback, useMemo } from "react";
import { useWeb3React } from "@web3-react/core";
import { useContract } from "./useContract";
import { deferredBuyAddress, alchemy } from "../constants";
import DeferredBuyAbi from "../abis/DeferredBuy.json";

import type { OwnedNft } from "alchemy-sdk";
import { Offer, OfferItem, OfferItemType, UsableOffer } from "../types";
import { DeferredBuy } from "../abis/types";

const useOffers = () => {
    const { account } = useWeb3React();
    const [offers, setOffers] = useState<Offer[]>([]);
    const [ownedNfts, setOwnedNfts] = useState<OwnedNft[]>([]);
    const deferredBuyContract = useContract<DeferredBuy>(deferredBuyAddress, DeferredBuyAbi);

    const fetchOffers = useCallback(async () => {
        if(!!deferredBuyContract && !!account) {
            const offersLength = await deferredBuyContract.getLastOffer();

            const offersRequests = [];

            for(let offerRequestIndex = 0; offerRequestIndex <= offersLength; offerRequestIndex++) {
                const request = deferredBuyContract.getOffer(offerRequestIndex);

                offersRequests.push(request);
            }

            const offersRaw = await Promise.all(offersRequests);


            const offersToSet = [];

            for(let offerIndex = 0; offerIndex < offersRaw.length; offerIndex++) {
                const offerRaw = offersRaw[offerIndex];

                const offerItem: OfferItem = {
                    itemType:   offerRaw.item.itemType === 0 ? OfferItemType.ERC721 : OfferItemType.ERC1155,
                    token:      offerRaw.item.token,
                    identifier: offerRaw.item.identifier,
                    amount:     offerRaw.item.amount,
                };

                const offer: Offer = {
                    offerId:            offerIndex,
                    item:               offerItem,
                    offerer:            offerRaw.offerer,
                    availableAt:        offerRaw.availableAt,
                    pricePerUnit:       offerRaw.pricePerUnit,
                    claimed:            offerRaw.claimed,

                }

                offersToSet.push(offer);
            }

            setOffers(offersToSet)
        }
    }, [account, deferredBuyContract, setOffers]);

    const fetchOwnedNfts = useCallback(async () => {
        if(!!account) {
            const result = [];

            const initialNfts = await alchemy.nft.getNftsForOwner(account);
            // let nextPageKey = initialNfts.pageKey;
            // let totalCount = initialNfts.totalCount;

            for(const ownedNft of initialNfts.ownedNfts) {
                result.push(ownedNft);
            }

            // while(nextPageKey) {
            //     // console.log("NEXT REQUEST WITH:", nextPageKey);

            //     // 100 is max page size
            //     const nfts = await alchemy.nft.getNftsForOwner(account, { pageKey: nextPageKey, pageSize: 13 });
            //     console.log(nfts);

            //     nextPageKey = nfts.pageKey;

            //     for(const ownedNft of initialNfts.ownedNfts) {
            //         result.push(ownedNft);
            //     }
            // }

            // console.log(result.length);

            setOwnedNfts(result);
        }
    }, [account]);

    const usableOffers: UsableOffer[] = useMemo(() => {
        if(!!offers && !!ownedNfts) {
            const result: UsableOffer[] = [];
            for(const offer of offers) {
                for(const nft of ownedNfts) {
                    
                    if(
                        offer.item.amount.eq(1)
                        && nft.contract.address.toLowerCase() === offer.item.token.toLowerCase()
                        && offer.item.identifier.eq(nft.tokenId)
                    ) {

                        const offerToAdd = Object.assign({}, nft, offer);
                        
                        result.push(offerToAdd);
                    } else if(
                        offer.item.amount.gt(1) &&
                        nft.contract.address.toLowerCase() === offer.item.token.toLowerCase()
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