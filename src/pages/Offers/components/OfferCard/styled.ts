import styled, { css } from "styled-components";

const Card = styled.div`
    padding: 16px;
    border: 1px solid ${props => props.theme.colors.Yellow};
    border-radius: 24px;
`;

const Row = styled.div<{ mt?: string, centered?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: space-between;

    ${({mt}) => mt && css` margin-top: ${mt}px; `}
    ${({centered}) => centered && css` justify-content: center; `}
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
`;

const LoadingContainer = styled.div`

`;

export {
    Card,
    Row,
    Column,
    LoadingContainer,
}