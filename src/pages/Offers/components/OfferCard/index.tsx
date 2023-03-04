import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ethers } from "ethers";
import bn from "bignumber.js";
import { useWeb3React } from "@web3-react/core";
import { Circles } from "react-loader-spinner";
import axios from "axios";

import { useContract, useTimer } from "../../../../hooks";
import { deferredBuyAddress, OFFER_TIME_PERIOD } from "../../../../constants";
import { Card, LoadingContainer, Row } from "./styled";
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
    const [isMetaLoading, setIsMetaLoading] = useState(false);
    const [isTokenApproved, setIsTokenApproved] = useState(false);
    const [isTxPending, setIsTxPending] = useState(false);
    const [isOwner, setIsOwner] = useState(false);

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
        if(!!account) {
            const update = async () => {
                const owner = await deferredBuyContract.owner();

                setIsOwner(owner.toLowerCase() === account.toLowerCase());
            }

            update();
        }
    }, [account, deferredBuyContract]);

    useEffect(() => {
        const now = new Date().getTime();
        const offerStartsAt = new Date(offer.availableAt * 1000).getTime();
        const offerEndsAt = new Date((offer.availableAt * 1000) + OFFER_TIME_PERIOD).getTime();

        if(now < offerStartsAt) {
            setWaitingTimeLabel("Opens in:");
            setStopAtTime(offerStartsAt - now);
        } else if(now > offerStartsAt && now < offerEndsAt) {
            setWaitingTimeLabel("Ends in:");

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
            setIsMetaLoading(true);

            const erc721Contract = new ethers.Contract(offer.nftAddress, ERC721Abi, !!account ? library.getSigner() : library);
            const metaLink = await erc721Contract.tokenURI(offer.tokenId);
            const httpsMetaLink = getIpfsLinkOnANeed(metaLink);

            const meta = await axios.get(httpsMetaLink).then(res => res.data);
            meta.image = getIpfsLinkOnANeed(meta.image);

            setAssetMeta(meta);
            setIsMetaLoading(false);
        }

        update();
    }, [account, library, offer]);

    const offerPrice = useMemo(() => {
        const decimals = new bn(10).pow(18);
        return new bn(offer?.offerPrice.toString() ?? "0").div(decimals).toFixed(6)
    }, [offer]);

    const handleClaimOffer = async (offerId: number) => {
        if(!!deferredBuyContract && !!account) {
            setIsTxPending(true);

            const now = new Date().getTime();
            const endTime = (offer.availableAt * 1000) + OFFER_TIME_PERIOD;

            if((now > endTime) && isOwner && !offer.claimed) {
                const gas = await deferredBuyContract.estimateGas.withdraw(offerId).catch(err => {
                    console.log(err);

                    return ethers.BigNumber.from("720000");
                });

                const tx = await deferredBuyContract.withdraw(offerId, { gasLimit: gas })
                    .catch(() => {
                        setIsTxPending(false);
                    });

                tx.wait()
                    .finally(() => {
                        setIsTxPending(false);
                    });

                return;
            }

            const nftContract = new ethers.Contract(offer.nftAddress, ERC721Abi, library.getSigner());
            const isApproved = await checkIfTokenApproved();

            if(!isApproved) {
                const gas = await nftContract.estimateGas.approve(deferredBuyAddress, offer.tokenId).catch(err => {
                    console.log(err);

                    return ethers.BigNumber.from("720000");
                });

                const tx = await nftContract.approve(deferredBuyAddress, offer.tokenId, { gasLimit: gas })
                    .catch(() => {
                        setIsTxPending(false);
                    })
                
                tx.wait()
                    .then(async () => {
                        const isApproved = await checkIfTokenApproved();

                        setIsTokenApproved(isApproved);
                    })
                    .finally(() =>{
                        setIsTxPending(false);
                    });

                return;
            }

            const gasEstimationResult = await deferredBuyContract.estimateGas.claimOffer(offerId)
                .catch((err) => {
                    console.log(err);

                    return ethers.BigNumber.from("720000");
                });
            const gas = gasEstimationResult;

            const tx = await deferredBuyContract.claimOffer(offerId, { gasLimit: gas })
                .catch(() => {
                    setIsTxPending(false);
                })

            tx.wait()
                .finally(() => {
                    setIsTxPending(false);
                });
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
        } else if((now > endTime) && isOwner && !offer.claimed) {
            return {
                text: "Withdraw",
                disabled: false
            }
        }else if(now > endTime) {
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
        else if(isTxPending) {
            return {
                text: "Executing tx...",
                disabled: true
            }
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
    }, [offer, isTokenApproved, isTxPending, isOwner]);

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
            {
                isMetaLoading ? (
                    <LoadingContainer>
                        <Circles
                            width="200"
                            height="200"
                            color={Colors.Yellow}
                            visible={true}
                        />
                    </LoadingContainer>
                ) : (
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
                        onError={(e) => {
                            e.currentTarget.src = "images/not-found.png";
                            e.currentTarget.onerror = null;
                        }}
                    />
                )
            }
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