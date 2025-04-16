import React from 'react';
import styled from 'styled-components';
import { useState, useContext, useEffect } from 'react';
import { useAuth } from '../components/AuthContext.js';
import {Button, Table as ReactstrapTable} from 'reactstrap';

/* This component is an add-on feature to the site, which prepares the user's taxation data so that when tax time rolls around 
they can prepare their tax return very easily/quickly. When the user faithfully completes the ImportData activity each month,
it involves them assigning a category to each transaction. There will be a new column in the ImportData table of transactions
which allows the user to add a transaction (and all its details) as a "tax item" for the current financial year. Then the user
can visit the TaxTool page which will display all of their tax items and their details in a table in this TaxTool component.
The user can visit this page at any time and manually add tax items in this page, in addition to those pre-filled when they
selected a transaction as a tax item in ImportData. The pre-filled transactions will only contain a "net amount" value 
and the user will have to complete these pre-filled tax items by adding a "gross amount" value (if different from the net).
They will also have the option to import a document (pdf, image, SS) which provides evidence (e.g. a receipt) of the transaction.*/

export default function TaxTool(){



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