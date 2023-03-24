import styled, { css } from "styled-components";
import { IconProps } from "./types";

import ArrowBottomNotStyled from "./_resources/ArrowBottom";

const ArrowBottom = styled(ArrowBottomNotStyled)<IconProps>`

    ${props => props.clickable && css` cursor: pointer; `}

    path {
        stroke: ${props => props.theme.Colors[props.color]};
    }
`;

export {
    ArrowBottom,
}