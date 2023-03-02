import React, { useState, useEffect, useRef, useMemo } from "react";
import { ethers } from "ethers";
import bn from "bignumber.js";
import { useWeb3React } from "@web3-react/core";
import axios from "axios";

import { useContract, useTimer } from "../../../../hooks";
import { deferredBuyAddress, OFFER_TIME_PERIOD } from "../../../../constants";
import { Card, Row } from "./styled";
import { Button, Text } from "../../../../components";
import ERC721Abi from "../../../../abis/ERC721.json";
import DeferredBuyAbi from "../../../../abis/DeferredBuy.json";

import type { Offer } from "../../../../types";

interface Props {
    offer: Offer,
    offerIndex: number,
}

const OfferCard = ({ offer, offerIndex }: Props) => {
    const { account, library } = useWeb3React();
    const [assetMeta, setAssetMeta] = useState<{ [x: string]: any }>();
    const [waitingTimeLabel, setWaitingTimeLabel] = useState("");
    const stopAtTime = useRef(0);
    const timeLeft = useTimer(stopAtTime.current);
    const deferredBuyContract = useContract(deferredBuyAddress, DeferredBuyAbi);

    useEffect(() => {
        const now = new Date().getTime();
        const offerStartsAt = new Date(offer.availableAt * 1000).getTime();
        const offerEndsAt = new Date(offer.availableAt + OFFER_TIME_PERIOD).getTime();

        if(now < offerStartsAt) {
            setWaitingTimeLabel("Opens in:");
            stopAtTime.current = offerStartsAt - now;
        } else if(now > offerStartsAt && now < offerEndsAt) {
            setWaitingTimeLabel("Ends in:");
            stopAtTime.current = offerEndsAt - now;
        } else {
            setWaitingTimeLabel("Closed");
        }
    }, [offer]);

    useEffect(() => {
        if(!account || !library) {
            return;
        }

        const update = async () => {
            const erc721Contract = new ethers.Contract(offer.nftAddress, ERC721Abi, !!account ? library.getSigner() : library);
            const metaLink = await erc721Contract.tokenURI(offer.tokenId);
            const meta = await axios.get(metaLink).then(res => res.data);

            setAssetMeta(meta);
        }

        update();
    }, [account, library, offer]);

    const offerPrice = useMemo(() => {
        const decimals = new bn(10).pow(18);
        return new bn(offer?.offerPrice.toString() ?? "0").div(decimals).toFixed(6)
    }, [offer]);

    const handleClaimOffer = async (offerId: number) => {
        if(!!deferredBuyContract && !!account) {
            const nftContract = new ethers.Contract(offer.nftAddress, ERC721Abi, library.getSigner());

            const approvedAddress = await nftContract.getApproved(offer.tokenId);

            if(approvedAddress.toLowerCase() !== deferredBuyAddress.toLowerCase()) {
                const gas = await nftContract.estimateGas.approve(deferredBuyAddress, offer.tokenId).catch(err => {
                    console.log(err);

                    return ethers.BigNumber.from("720000");
                });

                await (await nftContract.approve(deferredBuyAddress, offer.tokenId, { gasLimit: gas }))
                    .wait()
                    .then(() => {
                        
                    });

                return;
            }

            const gasEstimationResult = await deferredBuyContract.estimateGas.claimOffer(offerId)
                .catch((err) => {
                    console.log(err);

                    return ethers.BigNumber.from("720000");
                });
            const gas = gasEstimationResult;

            deferredBuyContract.claimOffer(offerId, { gasLimit: gas });
        }
    }

    return (
        <Card>
            <Row>
                <Text variant="s" color="LightRed">
                    {waitingTimeLabel}
                </Text>
                <Text variant="s" color="LightRed">
                    {timeLeft}
                </Text>
            </Row>
            <img
                src={assetMeta?.image ?? "https://openseauserdata.com/files/b261626a159edf64a8a92aa7306053b8.png"}
                alt="asset"
                width="100%"
                height="200px"
            />
            <Row>
                <Text variant="m" color="Yellow">
                    Price:
                </Text>
                <Text variant="m" color="Yellow">
                    {offerPrice}
                </Text>
            </Row>
            <Row centered>
                <Button variant="usual" onClick={() => { handleClaimOffer(offerIndex) }}>
                    Claim
                </Button>
            </Row>
        </Card>
    )
}

export default OfferCard;