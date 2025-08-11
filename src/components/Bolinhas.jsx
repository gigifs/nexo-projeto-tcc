import styled from 'styled-components';

export const BolinhasContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-top: 48px;
`;


export const Bolinha = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${(props) => props.color || '#cccccc'};
`;

