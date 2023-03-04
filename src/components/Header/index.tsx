import React, { useEffect, useMemo, useState } from "react";
import { AccountBox, Container, Links, Link } from "./styled";
// import Text from "../Text";
import { useWeb3React } from "@web3-react/core";
import Button from "../Button";
import { useConnect, useContract } from "../../hooks";
import { deferredBuyAddress } from "../../constants";
import DeferredBuyAbi from "../../abis/DeferredBuy.json";

const links = [
    {
        text: "Offers",
        route: "/",
        onlyOwner: false,
    },
    {
        text: "Create offer",
        route: "/create",
        onlyOwner: true,
    }
]

const Header = () => {
    const { account } = useWeb3React();
    const { connect } = useConnect();
    const [isOwner, setIsOwner] = useState(false);
    const deferredBuyContract = useContract(deferredBuyAddress, DeferredBuyAbi);


    const shortenedAccount = useMemo(() => {
        if(!account) {
            return "";
        }

        return account.slice(0, 5) + "..." + account.slice(-3);
    }, [account]);

    useEffect(() => {
        if(!!account && !!deferredBuyContract) {
            const update = async () => {
                const ownerFromContract = await deferredBuyContract.owner();

                if(ownerFromContract.toLowerCase() === account.toLowerCase()) {
                    setIsOwner(true);
                }
            }

            update();
        }
    }, [deferredBuyContract, account]);

    return (
        <Container>
            <Links>
                {
                    links
                    .filter((link) => link.onlyOwner ? isOwner : true)
                    .map((link) => (
                        <Link key={link.route} to={link.route}>
                            {link.text}
                        </Link>
                    ))
                }
            </Links>
            {
                !account ? (
                    <Button variant="connect-wallet" onClick={connect}>
                        Connect
                    </Button>
                ) : (
                    <AccountBox>
                        {shortenedAccount}
                    </AccountBox>
                )
            }
        </Container>
    )
};

export default Header;