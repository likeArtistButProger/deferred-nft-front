import React, { useState, useEffect, useMemo } from 'react';
import { Container, Form, Button, Table } from 'react-bootstrap';
import DeferredBuyAbi from "./abis/DeferredBuy.json";
import * as ethers from "ethers";
import { useWeb3React } from "@web3-react/core";
import { Injected } from './constants';

const contractAddress = '0xb8400a893e02c2969fBAe225c74cCc444E374caA'; // Replace with actual contract address

type Offer = {
  nftAddress: string,
  tokenId: string,
  availableAt: number,
  offerPrice: string,
  claimed: boolean
}

function DeferredBuy() {
    const { account, library, activate } = useWeb3React();
    const [nftAddress, setNftAddress] = useState('');
    const [tokenId, setTokenId] = useState('');
    const [availableAt, setAvailableAt] = useState('');
    const [offerPrice, setOfferPrice] = useState('');

    const [offers, setOffers] = useState<Offer[]>([]);

    const deferredBuy = useMemo(() => {
      // @ts-ignore
      return new ethers.Contract(contractAddress, DeferredBuyAbi, window.ethereum);
    }, []);

    useEffect(() => {
      //@ts-ignore
      window.ethereum.enable();
    }, [window]);

    useEffect(() => {
        async function fetchOffers() {
            if(!!account && !!deferredBuy) {
              const offers = await deferredBuy.getAllOffers();

              setOffers(offers);
            }
        }
        fetchOffers();
    }, [deferredBuy, account]);

    async function handleCreateOffer(event: any) {
        if(!account || !deferredBuy) {
          return;
        }

        event.preventDefault();
        await deferredBuy.makeAnOffer(nftAddress, tokenId, availableAt, { value: ethers.parseEther(offerPrice) });
        setNftAddress('');
        setTokenId('');
        setAvailableAt('');
        setOfferPrice('');
        // const offers_ = await deferredBuy.getAllOffers();
        // setOffers(offers_);
    }

    async function handleClaimOffer(index: number) {
        if(!account || !deferredBuy) {
          return;
        }

        await deferredBuy.claimOffer(index);
        const offers_ = await deferredBuy.getAllOffers();
        setOffers(offers_);
    }

    function formatDate(timestamp: number) {
        const date = new Date(timestamp * 1000);
        return date.toLocaleString();
    }

    return (
        <Container>
            <button onClick={() => { activate(Injected) }}>Connect wallet</button>
            <h1>DeferredBuy dApp</h1>
            <p>Create an offer:</p>
            <Form onSubmit={handleCreateOffer}>
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
                <Button type="submit" variant="primary">Create Offer</Button>
            </Form>
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
                        <td>{offer.tokenId}</td>
                        <td>{formatDate(offer.availableAt)}</td>
                        <td>{ethers.formatEther(offer.offerPrice)} ETH</td>
                        {!offer.claimed && offer.availableAt <= Math.floor(Date.now() / 1000) ?
                            <td><Button variant="primary" onClick={() => handleClaimOffer(index)}>Claim</Button></td> :
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
