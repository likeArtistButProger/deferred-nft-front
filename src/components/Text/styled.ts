import styled, { css } from "styled-components";
import type { Color, Variant } from "./types"

const TextStyled = styled.span<{ color: Color, variant: Variant, bold?: boolean }>`
    
    color: ${(props) => props.theme.colors[props.color]};

    ${(props) => {
        switch(props.variant) {
            case "s":
                return css`
                    font-size: 14px;
                    line-height: 20px;
                `;
            case "m":
                return css`
                    font-size: 16px;
                    line-height: 24px;
                `
            case "l":
                return css`
                    font-size: 18px;
                    line-height: 28px;
                `;
            default:
                return css``
        }
    }}

    ${(props) => props.bold && css` font-weight: 500; `}

`;

export {
    TextStyled
}