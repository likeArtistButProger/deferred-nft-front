import React from "react";
import { 
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import { NetworkSwitchProvider } from "./components";
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
        <NetworkSwitchProvider>
            <RouterProvider router={router} />
        </NetworkSwitchProvider>
    );
}

export default DeferredBuy;
