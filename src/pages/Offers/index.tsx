import React from "react";
import { useOffers } from "../../hooks";
import { OfferCard } from "./components";
import { CardsGrid } from "./styled";

const Offers = () => {
    const offers = useOffers();

    return (
        <CardsGrid>
            {
                offers.map((offer) => (
                    <OfferCard offer={offer} />
                ))
            }
        </CardsGrid>
    );
}

export default Offers;