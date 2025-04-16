import React from 'react';
import styled from 'styled-components';
import { useState, useContext, useEffect } from 'react';
import { useAuth } from '../components/AuthContext.js';
import {Button, Table as ReactstrapTable} from 'reactstrap';

/* This component follws on from the Worksheet activity, which was where the user entered in their budget items. In 
this page they may have been unable to accurately provide a $ amount value for a budget item, which will be left as 0.
For all such items, they will be displayed to the user (along with all their other items) and they will be prompted 
to enter in a value. To help them do this, a value will be displayed to the user which shows them how much they have 
earned/spent for that item in the past year (based on the data they have saved each month from the ImportData page).
They can use this value as a guide to make a more accurate estimate of how much they currently earn/spend for that item,
or they can accept a pre-populated value which is displayed. This value is calculated based on the user's historical data
accumulated from completing the ImportData activity each month.*/

export default function BudgetTool(){



    return(
        <SubWrapper>
            <StyledContainer>
                {/* Insert JSX */}
            </StyledContainer>
        </SubWrapper>

    )
}

const SubWrapper = styled.div`
    background-color: #f5f5f5;
    min-height: 100vh;
    padding-top: 80px;
    outline: 2px solid blue;
`;

// Styled component replicating Bootstrap's `.container` class (which creates a standard isometric margin on the left and right
// of the main page content
const StyledContainer = styled.div`
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    padding-left: 15px;
    padding-right: 15px;

    /* Bootstrap-like max-width breakpoints */
    @media (min-width: 576px) {
        max-width: 540px;
    }
    @media (min-width: 768px) {
        max-width: 720px;
    }
    @media (min-width: 992px) {
        max-width: 960px;
    }
    @media (min-width: 1200px) {
        max-width: 1140px;
    }
    @media (min-width: 1400px) {
        max-width: 1320px;
    }
`;

const LargeText = styled.p`
    font-size: 1.2rem; // Standard font size
    line-height: 1.5; // Standard line height
    font-weight: normal; // Normal font weight
    color: #333; // Standard text color
    margin: 1rem 0; // Standard margin
    text-align: left;
`;