import styled from "styled-components";
import { Link as LinkRaw } from "react-router-dom";

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 12px;
`;

const Links = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
`;

const Link = styled(LinkRaw)`
    font-size: 18px;
    line-height: 28px;
    text-decoration: none;
    font-weight: 700;

    color: ${props => props.theme.colors.Yellow};

    &:hover {
        color: ${props => props.theme.colors.Rose};
    }
`;

const AccountBox = styled.div`
    font-size: 18px;
    line-height: 28px;
    padding: 10px 16px;
    color: ${props => props.theme.colors.Yellow};
    border: 1px solid ${props => props.theme.colors.Yellow};
    border-radius: 10px;
`;

export {
    AccountBox,
    Links,
    Container,
    Link,
}