import styled from "styled-components";

const CardsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 20px;
`;

export {
    CardsGrid
}