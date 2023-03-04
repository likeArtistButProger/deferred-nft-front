import React from "react";
import {useWeb3React} from "@web3-react/core";
import { supportedChainIds } from "../../constants";
import Modal from "./Modal";

type Props = {
  children: React.ReactNode
}

const AuthorizeModalContext = React.createContext({});

const AuthorizeModalProvider = ({children}: Props) => {
  const {account, chainId} = useWeb3React();

  return (
    <AuthorizeModalContext.Provider value={{}}>
      {
        !!account && !supportedChainIds.includes(chainId ?? 0) && <Modal />
      }
      {children}
    </AuthorizeModalContext.Provider>
  )
}

export default AuthorizeModalProvider;
