import styled, { css } from "styled-components";

const AnchorContainer = styled.div`
    position: relative;
`;

const SelectedOption = styled.div<{ opened?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 200px;
    font-size: 18px;
    line-height: 28px;
    padding: 6px 12px;
    color: ${props => props.theme.colors.Yellow};
    border: 1px solid ${props => props.theme.colors.Yellow};
    border-radius: 6px;
    cursor: pointer;

    ${props => props.opened && css`
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
        border-bottom: 1px solid ${props => props.theme.colors.Purple};
        cursor: initial;
    `}
`;

const Options = styled.div`
    position: absolute;
    top: 100%;
    left: 0;
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 6px 0;
    background: ${props => props.theme.colors.Black};
    border-left: 1px solid   ${props => props.theme.colors.Purple};
    border-bottom: 1px solid ${props => props.theme.colors.Purple};
    border-right: 1px solid  ${props => props.theme.colors.Purple};
    border-bottom-right-radius: 6px;
    border-bottom-left-radius: 6px;
    z-index: 1;
`;

const Option = styled.div<{ pickable?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: start;
    margin-bottom: 5px;
    border-bottom: 1px solid ${props => props.theme.colors.Purple};
    padding: 0 12px;

    &:last-child {
        margin-bottom: 0;
        border-bottom: none;
    }

    ${props => props.pickable && css`
        cursor: pointer;
    `}
`;

export {
    AnchorContainer,
    SelectedOption,
    Options,
    Option
}