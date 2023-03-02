import styled from "styled-components";

const PseudoFormContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 20px;
    padding: 10px;
    margin: 0 auto;
    max-width: 500px;
    border: 1px solid ${props => props.theme.colors.Yellow};
    border-radius: 6px;
`;

const Field = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
`;

export {
    PseudoFormContainer,
    Field
}