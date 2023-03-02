import React from "react";
import { 
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Header from "./components/Header";

import CreateOffer from "./pages/CreateOffer";
import Offers from "./pages/Offers";
import { GlobalStyle } from "./styles";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <>
                <GlobalStyle />
                <Header />
                <Offers />
            </>
        )
    },
    {
        path: "create",
        element: (
            <>
                <GlobalStyle />
                <Header />
                <CreateOffer />
            </>
        )
    }
]);

function DeferredBuy() {

    return (
        <RouterProvider router={router} />
        // <Container>
        //     {
        //         !account ? (
        //             <button onClick={connect}>Connect wallet</button>
        //         ) : (
        //             <div>{account}</div>
        //         )
        //     }
        //     <h1>DeferredBuy dApp</h1>
        //     <p>Create an offer:</p>
        //     <div onSubmit={handleCreateOffer}>
        //         <Form.Group>
        //             <Form.Label>NFT Contract Address</Form.Label>
        //             <Form.Control type="text" value={nftAddress} onChange={event => setNftAddress(event.target.value)} required />
        //         </Form.Group>
        //         <Form.Group>
        //             <Form.Label>Token ID</Form.Label>
        //             <Form.Control type="number" value={tokenId} onChange={event => setTokenId(event.target.value)} required />
        //         </Form.Group>
        //         <Form.Group>
        //             <Form.Label>Available At (Unix Timestamp)</Form.Label>
        //             <Form.Control type="number" value={availableAt} onChange={event => setAvailableAt(event.target.value)} required />
        //         </Form.Group>
        //         <Form.Group>
        //             <Form.Label>Offer Price (in ETH)</Form.Label>
        //             <Form.Control type="number" step="any" value={offerPrice} onChange={event => setOfferPrice(event.target.value)} required />
        //         </Form.Group>
        //         <Button onClick={handleCreateOffer}>Create Offer</Button>
        //     </div>
        //     <hr />
        //     <p>Existing Offers:</p>
        //     <Table>
        //         <thead>
        //         <tr>
        //             <th>NFT Address</th>
        //             <th>Token ID</th>
        //             <th>Available At</th>
        //             <th>Offer Price</th>
        //             <th>Claim</th>
        //         </tr>
        //         </thead>
        //         <tbody>
        //         {offers.map((offer, index) => (
        //             <tr key={index}>
        //                 <td>{offer.nftAddress}</td>
        //                 <td>{offer.tokenId.toString()}</td>
        //                 <td>{new Date(offer.availableAt).getTime()}</td>
        //                 <td>{ethers.utils.formatEther(offer.offerPrice)} ETH</td>
        //                 {!offer.claimed && offer.availableAt <= Math.floor(Date.now() / 1000) ?
        //                     <td><Button onClick={() => handleClaimOffer(index)}>Claim</Button></td> :
        //                     <td>-</td>
        //                 }
        //             </tr>
        //         ))}
        //         </tbody>
        //     </Table>
        // </Container>
    );
}

export default DeferredBuy;
