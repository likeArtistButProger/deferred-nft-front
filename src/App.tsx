import React, { useState, useEffect, useCallback } from 'react';
import { Container, Form, Table } from 'react-bootstrap';
import DeferredBuyAbi from "./abis/DeferredBuy.json";
import ERC721Abi from "./abis/ERC721.json";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { Injected } from './constants';
import bn from "bignumber.js";
import { useContract } from './useContract';
import { Button } from "./components";

const contractAddress = '0xb8400a893e02c2969fBAe225c74cCc444E374caA'; // Replace with actual contract address

type Offer = {
  nftAddress:  string,
  availableAt: number,
  claimed:     boolean,
  tokenId:     ethers.BigNumber,
  offerPrice:  ethers.BigNumber,
}

function DeferredBuy() {
    const { account, activate, library } = useWeb3React();
    const [nftAddress, setNftAddress] = useState<string>();
    const [tokenId, setTokenId] = useState<string>();
    const [availableAt, setAvailableAt] = useState<string>();
    const [offerPrice, setOfferPrice] = useState<string>()
    const deferredBuyContract = useContract(contractAddress, DeferredBuyAbi);

    const [offers, setOffers] = useState<Offer[]>([]);

    useEffect(() => {
        const isWalletConncted = localStorage.getItem("connector");

        if(isWalletConncted) {
            activate(Injected);
        }
    }, [activate]);

    const connect = useCallback(() => {
        activate(Injected);
        localStorage.setItem("connector", "metamask");
    }, [activate]);

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

    const handleClaimOffer = async (offerId: number) => {
        if(!!deferredBuyContract && !!account) {
            const offer = offers[offerId];
            
            const nftContract = new ethers.Contract(offer.nftAddress, ERC721Abi, library.getSigner());

            const approvedAddress = await nftContract.getApproved(offer.tokenId);

            if(approvedAddress.toLowerCase() !== contractAddress.toLowerCase()) {
                const gas = await nftContract.estimateGas.approve(contractAddress, offer.tokenId).catch(err => {
                    console.log(err);

                    return ethers.BigNumber.from("720000");
                });

                await (await nftContract.approve(contractAddress, offer.tokenId, { gasLimit: gas })).wait();
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
        <Container>
            {
                !account ? (
                    <button onClick={connect}>Connect wallet</button>
                ) : (
                    <div>{account}</div>
                )
            }
            <h1>DeferredBuy dApp</h1>
            <p>Create an offer:</p>
            <div onSubmit={handleCreateOffer}>
                <Form.Group>
                    <Form.Label>NFT Contract Address</Form.Label>
                    <Form.Control type="text" value={nftAddress} onChange={event => setNftAddress(event.target.value)} required />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Token ID</Form.Label>
                    <Form.Control type="number" value={tokenId} onChange={event => setTokenId(event.target.value)} required />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Available At (Unix Timestamp)</Form.Label>
                    <Form.Control type="number" value={availableAt} onChange={event => setAvailableAt(event.target.value)} required />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Offer Price (in ETH)</Form.Label>
                    <Form.Control type="number" step="any" value={offerPrice} onChange={event => setOfferPrice(event.target.value)} required />
                </Form.Group>
                <Button onClick={handleCreateOffer}>Create Offer</Button>
            </div>
            <hr />
            <p>Existing Offers:</p>
            <Table>
                <thead>
                <tr>
                    <th>NFT Address</th>
                    <th>Token ID</th>
                    <th>Available At</th>
                    <th>Offer Price</th>
                    <th>Claim</th>
                </tr>
                </thead>
                <tbody>
                {offers.map((offer, index) => (
                    <tr key={index}>
                        <td>{offer.nftAddress}</td>
                        <td>{offer.tokenId.toString()}</td>
                        <td>{new Date(offer.availableAt).getTime()}</td>
                        <td>{ethers.utils.formatEther(offer.offerPrice)} ETH</td>
                        {!offer.claimed && offer.availableAt <= Math.floor(Date.now() / 1000) ?
                            <td><Button onClick={() => handleClaimOffer(index)}>Claim</Button></td> :
                            <td>-</td>
                        }
                    </tr>
                ))}
                </tbody>
            </Table>
        </Container>
    );
}

export default DeferredBuy;
