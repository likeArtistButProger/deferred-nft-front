import React, { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import DatePicker from "react-datepicker";
import bn from "bignumber.js";

import { Button, Input, Text } from "../../components";
import { deferredBuyAddress } from "../../constants";
import { useContract } from "../../hooks";
import DeferredBuyAbi from "../../abis/DeferredBuy.json";

import { Field, PseudoFormContainer } from "./styled";

import "./datepicker.css";

const CreateOffer = () => {
    const { account } = useWeb3React();
    const [nftAddress, setNftAddress] = useState<string>();
    const [tokenId, setTokenId] = useState<string>();
    const [availableAt, setAvailableAt] = useState<Date|null>(new Date());
    const [offerPrice, setOfferPrice] = useState<string>()

    const deferredBuyContract = useContract(deferredBuyAddress, DeferredBuyAbi);

    const handleCreateOffer = () => {
        if(!deferredBuyContract || !account || !availableAt) {
            return;
        }

        const startFrom = Math.floor(availableAt.getTime() / 1000);

        const decimals = new bn(10).pow(18);
        const offerPriceArg = new bn(offerPrice ?? "0").times(decimals).toFixed();

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
                <DatePicker
                    selected={availableAt}
                    onChange={(date) => setAvailableAt(date)}
                    showTimeSelect
                    dateFormat="MMMM d, yyyy h:mm aa"
                />
                {/* <Input type="text" value={availableAt} onChange={(event) => { setAvailableAt(event.target.value) }} /> */}
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