import React from "react";
import { setupNetwork } from "../../utils";
import Button from "../Button";
import Text from "../Text";
import { ModalContent, Overlay } from "./styled";

const Modal = () => {
    return (
        <Overlay>
            <ModalContent>
                <Text variant="l" color="Yellow">Switch to Goerli test network in order to use application</Text>
                <div style={{ marginTop: "20px" }}>
                    <Button variant="connect-wallet" onClick={() => { setupNetwork("goerli") }}>Switch</Button>
                </div>
            </ModalContent>
        </Overlay>
    )
}

export default Modal;