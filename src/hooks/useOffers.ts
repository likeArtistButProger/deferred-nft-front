import { useState, useEffect, useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { useContract } from "./useContract";
import { deferredBuyAddress } from "../constants";
import DeferredBuyAbi from "../abis/DeferredBuy.json";

import type { Offer } from "../types";

const useOffers = () => {
    const { account } = useWeb3React();
    const [offers, setOffers] = useState<Offer[]>([]);
    const deferredBuyContract = useContract(deferredBuyAddress, DeferredBuyAbi);

    const fetchOffers = useCallback(async () => {
        if(!!deferredBuyContract && !!account) {
            const offersRaw = await deferredBuyContract.getAllOffers();

            setOffers(offersRaw)
        }
    }, [account, deferredBuyContract, setOffers]);

    useEffect(() => {
        fetchOffers();

        const interval = setInterval(() => {
            fetchOffers();
        }, 10_000);

        return () => {
            clearInterval(interval);
        }
    }, [fetchOffers]);

    return offers;
}

export {
    useOffers
}