import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
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
import { Colors } from "../../../../styles";

interface Props {
    offer: Offer,
    offerIndex: number,
}

const getIpfsLinkOnANeed = (link: string) => {
    return link.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
};

const OfferCard = ({ offer, offerIndex }: Props) => {
    const { account, library } = useWeb3React();
    const [assetMeta, setAssetMeta] = useState<{ [x: string]: any }>();
    const [waitingTimeLabel, setWaitingTimeLabel] = useState("");
    const [stopAtTime, setStopAtTime] = useState(0);
    const timeLeft = useTimer(stopAtTime);
    const deferredBuyContract = useContract(deferredBuyAddress, DeferredBuyAbi);
    const [isTokenApproved, setIsTokenApproved] = useState(false);

    const checkIfTokenApproved = useCallback(async () => {
        const nftContract = new ethers.Contract(offer.nftAddress, ERC721Abi, !!account ? library.getSigner() : library);
        const approvedAddress = await nftContract.getApproved(offer.tokenId);

        return approvedAddress.toLowerCase() === deferredBuyAddress.toLowerCase();
    }, [account, offer, library]);

    useEffect(() => {
        if(!!account) {
            const update = async () => {
                const tokenApproval = await checkIfTokenApproved();

                setIsTokenApproved(tokenApproval);
            }

            update();
        }
    }, [checkIfTokenApproved, account]);

    useEffect(() => {
        const now = new Date().getTime();
        const offerStartsAt = new Date(offer.availableAt * 1000).getTime();
        const offerEndsAt = new Date((offer.availableAt * 1000) + OFFER_TIME_PERIOD).getTime();

        // console.log("NOW:", now);
        // console.log("THE:", offerStartsAt);
        // console.log("END:", offerEndsAt);

        // console.log("COND 1:", now < offerStartsAt);
        // console.log("COND 2:", now > offerStartsAt && now < offerEndsAt);
        
        // console.log(offerStartsAt - now);

        if(now < offerStartsAt) {
            setWaitingTimeLabel("Opens in:");
            setStopAtTime(offerStartsAt - now);
        } else if(now > offerStartsAt && now < offerEndsAt) {
            setWaitingTimeLabel("Ends in:");

            // console.log("ENDS IN:", offerEndsAt - now);
            setStopAtTime(offerEndsAt - now);
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
            const httpsMetaLink = getIpfsLinkOnANeed(metaLink);
            // console.log(httpsMetaLink);

            const meta = await axios.get(httpsMetaLink).then(res => res.data);
            // console.log(meta.image);
            meta.image = getIpfsLinkOnANeed(meta.image);

            // console.log(meta);

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
            const isApproved = await checkIfTokenApproved();

            if(!isApproved) {
                const gas = await nftContract.estimateGas.approve(deferredBuyAddress, offer.tokenId).catch(err => {
                    console.log(err);

                    return ethers.BigNumber.from("720000");
                });

                await (await nftContract.approve(deferredBuyAddress, offer.tokenId, { gasLimit: gas }))
                    .wait()
                    .then(async () => {
                        const isApproved = await checkIfTokenApproved();

                        setIsTokenApproved(isApproved);
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

    const buttonState = useMemo(() => {
        const now = new Date().getTime();
        const startTime = offer.availableAt * 1000;
        const endTime = (offer.availableAt * 1000) + OFFER_TIME_PERIOD;

        if(now < startTime) {
            return {
                text: "Not available yet",
                disabled: true
            };
        } else if(now > endTime) {
            return {
                text: "Closed",
                disabled: true
            };
        } else if(offer.claimed) {
            return {
                text: "Claimed",
                disabled: true
            };
        }
         else if(!isTokenApproved) {
            return {
                text: "Approve",
                disabled: false
            };
        } else {
            return {
                text: "Claim",
                disabled: false
            };
        }
    }, [offer, isTokenApproved]);

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
                style={{
                    marginTop: "5px",
                    border: `1px solid ${Colors.Yellow}`,
                    borderRadius: "6px"
                }}
                src={getIpfsLinkOnANeed(assetMeta?.image ?? "")}
                alt="asset"
                width="100%"
                height="200px"
            />
            <Row mt="10">
                <Text variant="m" color="Yellow">
                    Price:
                </Text>
                <Text variant="m" color="Yellow">
                    {offerPrice}
                </Text>
            </Row>
            <Row mt="10" centered>
                <Button variant="usual" onClick={() => { handleClaimOffer(offerIndex) }} disabled={buttonState.disabled}>
                    {buttonState.text}
                </Button>
            </Row>
        </Card>
    )
}

export default OfferCard;