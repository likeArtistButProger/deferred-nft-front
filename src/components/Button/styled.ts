import styled, { css } from "styled-components";

import { Variant } from "./types";

const ButtonStyled = styled.button<{ variant: Variant }>`
    padding: 6px 10px;
    background: ${props => props.theme.colors.Black};
    color: ${props => props.theme.colors.Yellow};
    border: 1px solid ${props => props.theme.colors.Yellow};
    border-radius: 10px;
    cursor: pointer;

    &:hover {
        background: ${props => props.theme.colors.Purple};
    }

    &:disabled {
        color: ${props => props.theme.colors.LightRed};
        border-color: ${props => props.theme.colors.LightRed};
        cursor: initial;

        &:hover {
            background: ${props => props.theme.colors.Black};
        }
    }

    ${({variant}) => {
        switch(variant) {
            case "connect-wallet":
                return css`
                    padding: 10px 16px;
                    font-size: 18px;
                    line-height: 28px;
                `;
            case "usual":
                return css`
                    padding: 8px 14px;
                    font-size: 14px;
                    line-height: 20px;
                `;
            default: 
                return css``
        }
    }}
`;

export { 
    ButtonStyled
}