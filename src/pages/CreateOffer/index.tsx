import React, { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import bn from "bignumber.js";

import { Button, Input, Text } from "../../components";
import { deferredBuyAddress } from "../../constants";
import { useContract } from "../../hooks";
import DeferredBuyAbi from "../../abis/DeferredBuy.json";

import { Field, PseudoFormContainer } from "./styled";

const CreateOffer = () => {
    const { account } = useWeb3React();
    const [nftAddress, setNftAddress] = useState<string>();
    const [tokenId, setTokenId] = useState<string>();
    const [availableAt, setAvailableAt] = useState<string>();
    const [offerPrice, setOfferPrice] = useState<string>()

    const deferredBuyContract = useContract(deferredBuyAddress, DeferredBuyAbi);

    const handleCreateOffer = () => {
        if(!deferredBuyContract || !account) {
            return;
        }

        const startFrom = (parseInt(availableAt ?? "0") / 1000).toFixed(0);

        const decimals = new bn(10).pow(18);
        const offerPriceArg = new bn(offerPrice ?? "0").times(decimals).toFixed();

        console.log(nftAddress ?? "", tokenId ?? "", startFrom, { value: offerPriceArg })
        
        deferredBuyContract.makeAnOffer(nftAddress ?? "", tokenId ?? "", startFrom, { value: offerPriceArg });
    }


    return (
        <PseudoFormContainer>
            <Field>
                <Text variant="l" color="Purple">NFT Address</Text>
                <Input type="text" value={nftAddress} onChange={(event) => { setNftAddress(event.target.value) }} />
            </Field>
            <Field>
                <Text variant="l" color="Purple">Token ID</Text>
                <Input type="text" value={tokenId} onChange={(event) => { setTokenId(event.target.value) }} />
            </Field>
            <Field>
                <Text variant="l" color="Purple">Available at</Text>
                <Input type="text" value={availableAt} onChange={(event) => { setAvailableAt(event.target.value) }} />
            </Field>
            <Field>
                <Text variant="l" color="Purple">Offer price</Text>
                <Input type="text" value={offerPrice} onChange={(event) => { setOfferPrice(event.target.value) }} />
            </Field>
            <Button variant="usual" onClick={handleCreateOffer}>
                Create offer
            </Button>
        </PseudoFormContainer>
    )
}

export default CreateOffer;