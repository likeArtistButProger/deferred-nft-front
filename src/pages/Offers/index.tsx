import React from "react";
import { useOffers } from "../../hooks";
import { OfferCard } from "./components";
import { CardsGrid } from "./styled";

const Offers = () => {
    const offers = useOffers();

    return (
        <CardsGrid>
            {
                offers.map((offer, index) => (
                    <OfferCard key={offer.nftAddress+offer.tokenId} offer={offer} offerIndex={index} />
                ))
            }
        </CardsGrid>
    );
}

export default Offers;