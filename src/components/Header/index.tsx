import React, { useMemo } from "react";
import { AccountBox, Container, Links, Link } from "./styled";
import Text from "../Text";
import { useWeb3React } from "@web3-react/core";
import Button from "../Button";
import { useConnect } from "../../hooks";

const links = [
    {
        text: "Offers",
        route: "/"
    },
    {
        text: "Create offer",
        route: "/create"
    }
]

const Header = () => {
    const { account } = useWeb3React();
    const { connect } = useConnect();


    const shortenedAccount = useMemo(() => {
        if(!account) {
            return "";
        }

        return account.slice(0, 5) + "..." + account.slice(-3);
    }, [account]);

    return (
        <Container>
            <Links>
                {
                    links.map((link) => (
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