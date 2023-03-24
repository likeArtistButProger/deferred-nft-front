import React, { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import DatePicker from "react-datepicker";
import bn from "bignumber.js";

import { Button, Input, Select, Text } from "../../components";
import { deferredBuyAddress, itemTypes } from "../../constants";
import { useContract } from "../../hooks";
import DeferredBuyAbi from "../../abis/DeferredBuy.json";

import { Field, PseudoFormContainer } from "./styled";

import "./datepicker.css";
import { DeferredBuy } from "../../abis/types";
import { OfferItemType } from "../../types";

const CreateOffer = () => {
    const { account } = useWeb3React();
    const [nftAddress, setNftAddress] = useState<string>();
    const [tokensToBuy, setTokensToBuy] = useState<string>();
    const [availableAt, setAvailableAt] = useState<Date|null>(new Date());
    const [pricePerUnit, setPricePerUnit] = useState<string>();
    const [tokenIdToBuy, setTokenIdToBuy] = useState<string>();
    const [selectedItemType, setSelectedItemType] = useState(itemTypes[0]);

    const deferredBuyContract = useContract<DeferredBuy>(deferredBuyAddress, DeferredBuyAbi);

    const handleCreateOffer = () => {
        if(
            !deferredBuyContract
            || !account
            || !availableAt
            || !tokensToBuy
            || !nftAddress
            || (parseInt(tokensToBuy) === 1 && !tokenIdToBuy)
        ) {
            return;
        }

        const startFrom = Math.floor(availableAt.getTime() / 1000);

        const decimals = new bn(10).pow(18);
        const pricePerUnitArg = new bn(pricePerUnit ?? "0").times(decimals);
        const offerPriceArg = pricePerUnitArg.times(tokensToBuy).toFixed();

        const itemType = selectedItemType.value === 0 ? OfferItemType.ERC721 : OfferItemType.ERC1155;

        const offerItem = {
            itemType:   itemType,
            token:      nftAddress,
            identifier: tokenIdToBuy ?? 0,
            amount:     tokensToBuy
        }
        
        deferredBuyContract.makeAnOffer(offerItem, pricePerUnitArg.toFixed(), startFrom, { value: offerPriceArg });
    }

    return (
        <PseudoFormContainer>
            <Field>
                <Text variant="l" color="Purple">Token Type</Text>
                <Select
                    selected={selectedItemType}
                    onSelect={setSelectedItemType}
                    options={itemTypes}
                />
            </Field>
            <Field>
                <Text variant="l" color="Purple">NFT Address</Text>
                <Input type="text" value={nftAddress} onChange={(event) => { setNftAddress(event.target.value) }} />
            </Field>
            <Field>
                <Text variant="l" color="Purple">Tokens to buy</Text>
                <Input type="text" value={tokensToBuy} onChange={(event) => { setTokensToBuy(event.target.value) }} />
            </Field>
            <Field>
                <Text variant="l" color="Purple">Available at</Text>
                <DatePicker
                    selected={availableAt}
                    onChange={(date) => setAvailableAt(date)}
                    showTimeSelect
                    dateFormat="MMMM d, yyyy h:mm aa"
                />
            </Field>
            {
                tokensToBuy && parseInt(tokensToBuy) === 1 && (
                    <Field>
                        <Text variant="l" color="Purple">Token Id</Text>
                        <Input type="text" value={tokenIdToBuy} onChange={(event) => { setTokenIdToBuy(event.target.value) }} />
                    </Field>
                )
            }
            <Field>
                <Text variant="l" color="Purple">Price per unit</Text>
                <Input type="text" value={pricePerUnit} onChange={(event) => { setPricePerUnit(event.target.value) }} />
            </Field>
            <Button variant="usual" onClick={handleCreateOffer}>
                Create offer
            </Button>
        </PseudoFormContainer>
    )
}

export default CreateOffer;