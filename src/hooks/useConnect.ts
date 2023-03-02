import { useCallback, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { Injected } from "../constants";

const useConnect = () => {
    const { activate } = useWeb3React();

    useEffect(() => {
        const isWalletConnected = localStorage.getItem("connector");

        if(isWalletConnected) {
            activate(Injected);
        }
    }, [activate]);

    const connect = useCallback(() => {
        activate(Injected);
        localStorage.setItem("connector", "metamask");
    }, [activate]);


    return { connect }
}

export {
    useConnect
}