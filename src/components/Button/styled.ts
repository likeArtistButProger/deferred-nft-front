import styled, { css } from "styled-components";

import { Variant } from "./types";

const ButtonStyled = styled.button<{ variant: Variant }>`
    padding: 6px 10px;
    border: none;
    box-shadow: none;

    ${({variant}) => {
        switch(variant) {
            case "connect-wallet":
                return css`
                    padding: 10px 16px;
                    font-size: 18px;
                    line-height: 28px;
                `;
            case "header":
                return css`
                    padding: 8px 5px;
                    font-size: 16px;
                    line-height: 24px;
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