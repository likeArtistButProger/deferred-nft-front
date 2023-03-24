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
import ERC1155Abi from "../../../../abis/ERC1155.json";

import DeferredBuyAbi from "../../../../abis/DeferredBuy.json";

import { OfferItemType, UsableOffer } from "../../../../types";
import { Colors } from "../../../../styles";
import { DeferredBuy, ERC1155, ERC721 } from "../../../../abis/types";

interface Props {
    offer: UsableOffer,
    offerIndex: number,
    updateOffers: ()=>void,
}

const getIpfsLinkOnANeed = (link: string) => {
    if(!link) return null;

    return link.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
};

const OfferCard = ({ offer, offerIndex, updateOffers }: Props) => {
    const { account, library } = useWeb3React();
    const [assetMeta, setAssetMeta] = useState<{ [x: string]: any }>();
    const [waitingTimeLabel, setWaitingTimeLabel] = useState("");
    const [stopAtTime, setStopAtTime] = useState(0);
    const timeLeft = useTimer(stopAtTime);
    const deferredBuyContract = useContract<DeferredBuy>(deferredBuyAddress, DeferredBuyAbi);
    const [isMetaLoading, setIsMetaLoading] = useState(false);
    const [isTokenApproved, setIsTokenApproved] = useState(false);
    const [isTxPending, setIsTxPending] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    // const [subTokensAmount, setSubTokensAmount] = useState();

    const checkIfTokenApproved = useCallback(async () => {
        if(offer.item.itemType === OfferItemType.ERC721) {
            //@ts-ignore
            const nftContract: ERC721 = new ethers.Contract<ERC721>(offer.item.token, ERC721Abi, !!account ? library.getSigner() : library);
            const approvedAddress = await nftContract.getApproved(offer.tokenId);
    
            return approvedAddress.toLowerCase() === deferredBuyAddress.toLowerCase();
        } else {
            if(!account) return false;
            // @ts-ignore
            const nftContract: ERC1155 = new ethers.Contract<ERC1155>(offer.item.token, ERC1155Abi, !!account ? library.getSigner() : library);

            const isApproved = await nftContract.isApprovedForAll(account, deferredBuyAddress);

            return isApproved;
        }
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
        const offerStartsAt = new Date(offer.availableAt.toNumber() * 1000).getTime();
        const offerEndsAt = new Date((offer.availableAt.toNumber() * 1000) + OFFER_TIME_PERIOD).getTime();

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

            if(offer.item.itemType === OfferItemType.ERC721) {
                const erc721Contract = new ethers.Contract(offer.item.token, ERC721Abi, !!account ? library.getSigner() : library);
                const metaLink = await erc721Contract.tokenURI(offer.tokenId);
                const httpsMetaLink = getIpfsLinkOnANeed(metaLink);
    
                if(!httpsMetaLink) {
                    return;
                }

                const meta = await axios.get(httpsMetaLink).then(res => res.data);
                meta.image = getIpfsLinkOnANeed(meta.image);
    
                setAssetMeta(meta);
            } else {
                const erc1155Contract = new ethers.Contract(offer.item.token, ERC1155Abi, !!account ? library.getSigner() : library);
                const metaLink = await erc1155Contract.uri(offer.tokenId);
                const httpsMetaLink = getIpfsLinkOnANeed(metaLink);

                if(!httpsMetaLink) {
                    return;
                }

                const meta = await axios.get(httpsMetaLink).then(res => res.data);

                meta.image = getIpfsLinkOnANeed(meta.image);
            }
            setIsMetaLoading(false);
        }

        update();
    }, [account, library, offer]);

    const offerPrice = useMemo(() => {
        const decimals = new bn(10).pow(18);
        return new bn(offer?.pricePerUnit.toString() ?? "0").div(decimals).toFixed(6)
    }, [offer]);

    const availableClaims = useMemo(() => {
        return ethers.BigNumber.from(offer.item.amount).sub(offer.claimed).toNumber();
    }, [offer]);

    const handleClaimOffer = async (offerId: number) => {
        if(!!deferredBuyContract && !!account) {
            setIsTxPending(true);

            const now = new Date().getTime();
            const endTime = (offer.availableAt.toNumber() * 1000) + OFFER_TIME_PERIOD;

            if((now > endTime) && isOwner && (availableClaims > 0)) {
                const gas = await deferredBuyContract.estimateGas.withdraw(offerId).catch(err => {
                    console.log(err);

                    return ethers.BigNumber.from("720000");
                });

                const tx = await deferredBuyContract.withdraw(offerId, { gasLimit: gas })
                    .catch(() => {
                        setIsTxPending(false);
                    });

                if(tx) {
                    tx.wait()
                    .finally(() => {
                        setIsTxPending(false);
                    });
                }

                return;
            }

            let nftContract;

            if(offer.item.itemType === OfferItemType.ERC721) {
                //@ts-ignore
                nftContract = new ethers.Contract<ERC721>(offer.item.token, ERC721Abi, library.getSigner()) as ERC721;
            } else {
                //@ts-ignore
                nftContract = new ethers.Contract<ERC1155>(offer.item.token, ERC1155Abi, library.getSigner()) as ERC1155;
            }

            const isApproved = await checkIfTokenApproved();
            const amountToClaim = offer.item.itemType === OfferItemType.ERC1155 ? offer.item.amount : 1;

            if(!isApproved) {
                if(offer.item.itemType === OfferItemType.ERC721) {
                    const gas = await (nftContract as ERC721).estimateGas.approve(deferredBuyAddress, offer.tokenId).catch(err => {
                        console.log(err);
    
                        return ethers.BigNumber.from("720000");
                    });
    
                    const tx = await (nftContract as ERC721).approve(deferredBuyAddress, offer.tokenId, { gasLimit: gas })
                        .catch(() => {
                            setIsTxPending(false);
                        })
                    
                    if(tx) {
                        tx.wait()
                        .then(async () => {
                            const isApproved = await checkIfTokenApproved();
    
                            setIsTokenApproved(isApproved);
                        })
                        .finally(() =>{
                            setIsTxPending(false);
                        });
                    }
                } else {
                    const gas = await (nftContract as ERC1155).estimateGas.setApprovalForAll(deferredBuyAddress, true).catch(err => {
                        console.log(err);
    
                        return ethers.BigNumber.from("720000");
                    });
    
                    const tx = await (nftContract as ERC1155).setApprovalForAll(deferredBuyAddress, true, { gasLimit: gas })
                        .catch(() => {
                            setIsTxPending(false);
                        })
                    
                    if(tx) {
                        tx.wait()
                        .then(async () => {
                            const isApproved = await checkIfTokenApproved();
    
                            setIsTokenApproved(isApproved);
                        })
                        .finally(() =>{
                            setIsTxPending(false);
                        });
                    }
                }

                return;
            }

            const gasEstimationResult = await deferredBuyContract.estimateGas.claimOffer(
                    offerId,
                    [offer.tokenId],
                    [amountToClaim]
                )
                .catch((err) => {
                    console.log(err);

                    return ethers.BigNumber.from("720000");
                });
            const gas = gasEstimationResult;

            const tx = await deferredBuyContract.claimOffer(
                    offerId,
                    [offer.tokenId],
                    [amountToClaim],
                    { gasLimit: gas }
                )
                .catch(() => {
                    setIsTxPending(false);
                })

            if(tx) {
                tx.wait()
                .finally(() => {
                    updateOffers();
                    setIsTxPending(false);
                });
            }
        }
    }

    const buttonState = useMemo(() => {
        const now = new Date().getTime();
        const startTime = offer.availableAt.toNumber() * 1000;
        const endTime = (offer.availableAt.toNumber() * 1000) + OFFER_TIME_PERIOD;

        if(now < startTime) {
            return {
                text: "Not available yet",
                disabled: true
            };
        } else if((now > endTime) && isOwner && (availableClaims > 0)) {
            return {
                text: "Withdraw",
                disabled: false
            }
        }else if(now > endTime) {
            return {
                text: "Closed",
                disabled: true
            };
        } else if(availableClaims === 0) {
            return {
                text: "All claimed",
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
    }, [availableClaims, offer, isTokenApproved, isTxPending, isOwner]);

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
                        src={getIpfsLinkOnANeed(assetMeta?.image ?? "") ?? ""}
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
            <Row mt="10">
                <Text variant="m" color="Yellow">
                    Claims left:
                </Text>
                <Text variant="m" color="Yellow">
                    {availableClaims}
                </Text>
            </Row>
            {/* {
                offer.item.itemType === OfferItemType.ERC1155 && (
                    <Column>
                        <Text variant="m" color="Yellow">Amount to claim</Text>
                        <Input
                            small
                        />
                    </Column>
                )
            } */}
            <Row mt="10" centered>
                <Button variant="usual" onClick={() => { handleClaimOffer(offerIndex) }} disabled={buttonState.disabled}>
                    {buttonState.text}
                </Button>
            </Row>
        </Card>
    )
}

export default OfferCard;