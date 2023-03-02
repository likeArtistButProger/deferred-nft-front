import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    *, *::before, *::after {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: "Comic Neue", cursive;
    }

    html, body {
        height: 100%;
        width: 100vw;
    }

    body {
        background: ${props => 
            // @ts-ignore
            props.theme.colors.Black
        };
    }
`;

export {
    GlobalStyle
}