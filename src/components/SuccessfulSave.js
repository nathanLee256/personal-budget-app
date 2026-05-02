import React from 'react';
import {Button, Collapse, Table as ReactstrapTable} from 'reactstrap';
import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext.js';
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";

/* 
    This component will be rendered to the user when they successfully save their transactions for a selected year/month in the
    ImportData page. It is conditionally rendered when the isDataSubmitted state variable is updated to T when the fetch in handleDataSubmit
    executes successfully:

    if(isDataSubmitted){
        //render the success component
        return(
            <SubWrapper>
                <StyledContainer>
                    <SuccessfulSave/>
                </StyledContainer>
            </SubWrapper>
        )
    } else{
        //render the main JSX
    }

    in handleSubmit(), if the fetch resolved successfully, the serverResponse state will be set to the response object
    which is expected to be in the following form (If insertedItems is truthy):
    {
        "newItems": "Success message here",
        "newItemsInserted": [...array of newly inserted budget items...],
        "newTransactions": "Success message here",
        "newTransInserted": [...array of newly inserted transactions...]
    }
    or it could also be (if insertedItems is falsy):
    {
        "newTransactions": "Success message here",
        "newTransInserted": [...array of transactions...]
    }
    Each transaction object is expected to be in the following form (the server route mapped db columns to React table columns)
    
    {
        "Transaction ID": 101,
        "Amount": 55.50,
        "Description": "Grocery Store",
        "Date": "2026-05-01",
        "Primary Cat": "Food",
        "Secondary Cat": "Groceries",
        "Tertiary Cat": "Weekly Shop",
        "Budget Item": "Weekly Food Budget",
        "Inserted At": "2026-05-02 10:00:00"
    }
        
*/

export default function SuccessfulSave({
    //props
    serverResponse //array 
}){

    //create a state array which will be used to populate the rows of the table
    const[rowData, setRowData] = useState([]);

    //state for Collapse
    const[isOpen, setIsOpen] = useState(false);

    //navigation obj
    const navigate = useNavigate();

    
    //START- 2 functions which return the JSX to render the columns and rows of the reactstrap table which shows the data
        // the user submitted
        const renderTableHeaders = () => {
        
            if(Array.isArray(serverResponse.newTransInserted) && serverResponse.newTransInserted.length > 0){
                const rowArray = Object.keys(serverResponse.newTransInserted[0]);

                // Define widths for each column
                const columnWidths = ["10%", "5%", "25%", "10%", "10%", "10%", "10%", "10%", "10%"];
            
                return (
                    <thead>
                        <tr>
                            {rowArray.map((val, index) => (
                                <th key={index} style={{ width: columnWidths[index] }}>{val}</th>
                            ))}
                        </tr>
                    </thead>
                );
            }
        
            
        
        };

        const renderTableRows = () => {
            if(Array.isArray(serverResponse.newTransInserted) && serverResponse.newTransInserted.length > 0){
                const transObjKeys = Object.keys(serverResponse.newTransInserted[0]);

                return(
                    <tbody>
                        {serverResponse.newTransInserted.map((transObj, rowIndex) => (
                            <tr key={rowIndex}>
                                <td>
                                    {/* Transaction ID column value */}
                                    {transObj[transObjKeys[0]]}
                                </td>
                                <td>
                                    {/* Amount column value */}
                                    ${transObj[transObjKeys[1]]} 
                                </td>
                                <td>
                                    {/* Description column value */}
                                    {transObj[transObjKeys[2]]}
                                </td>
                                <td>
                                    {/* Date column value */}
                                    {transObj[transObjKeys[3]]}
                                </td>
                                <td>
                                    {/* Primary Cat column value */}
                                    {transObj[transObjKeys[4]]}
                                </td>
                                <td>
                                    {/* Secondary Cat column value */}
                                    {transObj[transObjKeys[5]]}
                                </td>
                                <td>
                                    {/* Tertiary Cat column value */}
                                    {transObj[transObjKeys[6]]}
                                </td>
                                <td>
                                    {/* Budget Item column value */}
                                    {transObj[transObjKeys[7]]}
                                </td>
                                <td>
                                    {/* Inserted At column value */}
                                    {transObj[transObjKeys[8]]}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                );
            }

            
        }
    // END FUNCTIONS

    //Collapse event handler (i.e. a function which opens/closes the Collapse element)
    const handleExpand = () => {
        setIsOpen((prevState) => (
            !prevState
        ));
    };

    return(
        <>
            <LargeText>
                Your transactions have been successfully saved to the database ✅! Your next step 
                in getting your finances in order is to use the Budget Tool page to set your planned earning/spending goals
                for each of the new budget items (for which there is no dollar valued specified) you added in this page.
            </LargeText>
            <StyledH3>Click to view submitted budget data or use Budget Tool</StyledH3>
            <ButtonContainer>
                <StyledButton onClick={() => handleExpand()}>{isOpen ? "Collapse Data" : "View Data"}</StyledButton>
                <NavButton onClick={() => navigate("/budget_tool")}>Go to Budget Tool</NavButton>
            </ButtonContainer>
            <Collapse isOpen={isOpen}>
                <ReactstrapTable bordered striped>
                    {renderTableHeaders()}
                    {renderTableRows()}
                </ReactstrapTable>                                                       
            </Collapse> 
        </>
    )
}
const StyledH3 = styled.h3`
    margin: 0; /* Removes default h3 element margin */
`;

const LargeText = styled.p`
    font-size: 1.2rem; // Standard font size
    line-height: 1.5; // Standard line height
    font-weight: normal; // Normal font weight
    color: #333; // Standard text color
    margin: 1rem 0; // Standard margin
    text-align: left;
`;

const ButtonContainer = styled.div`
    display: grid;  
    column-gap: 50px;  /* Adds space between buttons */
    align-content: center;
    grid-template-columns: auto auto;
    padding-top: 25px;
    padding-bottom: 25px;
`;

const StyledButton = styled(Button)`
    box-sizing: border-box;
    background-color: #17a2b8; /* Bootstrap 'info' color */
    color: white; /* Text color */
    font-size: 20px; /* Prominent text */
    padding: 15px 30px; /* Maintain large clickable area */
    border-radius: 5px; /* Rounded corners */
    border: none; /* Cleaner look */
    margin: 0; /* No margin on left/right, only vertical spacing */
    min-width: 150px; /* Ensures a minimum size */
     
    cursor: pointer; /* Show hand cursor on hover */
    text-align: center; /* Left-align the text */
   
    &:hover {
      background-color: #138496; /* Darker shade of 'info' on hover */
      color: white; /* Ensure text remains visible */
    }
    &:active {
      background-color: #117a8b; /* Darker shade when clicked */
    }
`;

const NavButton = styled(Button)`
    box-sizing: border-box;
    background-color: #007bff; /* Bootstrap 'primary' color */
    color: white; /* Text color */
    font-size: 20px; /* Prominent text */
    padding: 15px 30px; /* Maintain large clickable area */
    border-radius: 5px; /* Rounded corners */
    border: none; /* Cleaner look */
    margin: 0; /* No margin on left/right, only vertical spacing */
    min-width: 150px; /* Ensures a minimum size */ 
    
    cursor: pointer; /* Show hand cursor on hover */
    text-align: center; /* Left-align the text */
    
    &:hover {
      background-color: #0056b3; /* Darker shade of primary on hover */
      color: white; /* Ensure text remains visible */
    }
    &:active {
      background-color: #004085; /* Even darker shade when clicked */
    }
`;