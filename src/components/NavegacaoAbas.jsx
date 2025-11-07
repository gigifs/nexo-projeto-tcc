// src/components/NavegacaoAbas.jsx
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

const TabsContainer = styled.nav`
    width: 100%;
    background-color: #f5fafc;
    padding: 0 15px; /* Reduced horizontal padding */
    border-radius: 15px; /* Slightly smaller radius */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Softer shadow */
    display: flex;
    justify-content: center; /* Keeps items centered */
    gap: 20px; /* Reduced gap */

    /* Responsive adjustments */
    @media (max-width: 1400px) { /* Breakpoint for smaller notebooks/tablets */
        justify-content: center; /* Distribute space more evenly */
        gap: 10rem;
    }

    @media (min-width: 1600px) { /* Breakpoint for smaller tablets/large phones */
        justify-content: space-between; /* Distribute space more evenly */
        overflow-x: auto; /* Allow horizontal scrolling if tabs overflow */
        padding: 0 20rem 0 20rem;
        /* Optional: Hide scrollbar visually */
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
        &::-webkit-scrollbar {
            display: none; /* Chrome, Safari, Opera */
        }
    }
`;

const TabLink = styled(NavLink)`
    position: relative;
    padding: 14px 25px; /* SIGNIFICANTLY reduced horizontal padding, adjusted vertical */
    font-size: 18px; /* Slightly smaller font */
    font-weight: 500; /* Medium weight for inactive */
    cursor: pointer;
    background: none;
    border: none;
    color: #555; /* Darker grey for inactive */
    text-decoration: none;
    transition: all 0.2s ease-in-out;
    white-space: nowrap; /* Keep text on one line */
    border-radius: 10px 10px 0 0; /* Add slight rounding to top corners */
    border-bottom: 3px solid transparent; /* Placeholder for the active line */

    &:hover {
        color: #7c2256;
        background-color: #e6ebf0; /* Subtle background on hover */
    }

    /* Remove the ::after pseudo-element */

    /* Style for the active link */
    &.active {
        color: #7c2256;
        font-weight: 700; /* Bolder for active */
        border-bottom-color: #7c2256; /* Use border instead of ::after */
        background-color: #e6ebf0; /* Match hover background */
    }

    /* Responsive adjustments for the link itself */
    @media (max-width: 992px) {
        padding: 12px 18px;
        font-size: 17px;
    }
    @media (max-width: 768px) {
        padding: 10px 15px;
        font-size: 16px;
    }
`;

function NavegacaoAbas({ abas }) {
    return (
        <TabsContainer>
            {abas.map((aba) => (
                // 'end' prop ensures the NavLink is only active for the exact path
                <TabLink key={aba.path} to={aba.path} end>
                    {aba.label}
                </TabLink>
            ))}
        </TabsContainer>
    );
}

export default NavegacaoAbas;