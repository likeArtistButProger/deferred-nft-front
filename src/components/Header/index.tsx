import React from "react";
import { Container, Links } from "./styled";
import { Link } from "react-router-dom";
import Text from "../Text";

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
    return (
        <Container>
            <Links>
                {
                    links.map((link) => (
                        <Link key={link.route} to={"/"}>
                            <Text variant="l" color="Purple">
                                {link.text}
                            </Text>
                        </Link>
                    ))
                }
            </Links>
        </Container>
    )
};

export default Header;