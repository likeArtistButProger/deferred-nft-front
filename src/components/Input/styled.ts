import styled, { css } from "styled-components";

const InputStyled = styled.input<{ small?: boolean }>`
    font-size: 18px;
    line-height: 28px;
    padding: 6px;
    color: ${props => props.theme.colors.Yellow};
    background: ${props => props.theme.colors.Black};
    outline: none;
    border: 1px solid ${props => props.theme.colors.Yellow};
    border-radius: 6px;

    ${props => props.small && css`
        
    `}
`;

export {
    InputStyled
}