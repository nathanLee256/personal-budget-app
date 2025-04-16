import React from 'react';
import {Button, Collapse, Table as ReactstrapTable} from 'reactstrap';
import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext.js';
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";

export default function SubmittedDataTable(props){

    //destructure the props object
    const dataObj = props.payload;

    // destructure the userId from the prop
    const { userId } = useAuth();

    //create a state array which will be used to populate the rows of the table
    const[rowData, setRowData] = useState([]);

    //state for Collapse
    const[isOpen, setIsOpen] = useState(false);

    //
    const navigate = useNavigate();

    /*  Now what we need to do is iterate over the dataObj object, down to the level-3 properties in order to extract
        an array of data objects which can be used to populate the table. Data objects need to be in the form of 
        {
            userId: 1, 
            primaryCategory: 'Income'
            secondaryCategory: 'Standard',
            tertiaryCategory: 'StandardIncome',
            item: 'Salary',
            amount: 400,
            frequency: 'Weekly',
            total: 1600
        } 
        But this needs to be done in a useEffect becuase the code block updates the state in the inner for loop which
        triggers an infinte loop of re-renders: everytime the state changes the component is re-rendered
    */
    useEffect(()=>{
        //use the nested for loop method
        const ZERO = 0;
        const newRowData = [];

        // outer for loop selects a level-1 property (e.g. Income, Expenditure) from the original object 
        for(const primaryCat in dataObj){
            if(primaryCat === "UserId") continue; // skip the userId property
            const categories = dataObj[primaryCat]; // select the value stored in the primaryCat key of the dataObj and assign 
            //categories is an object containing the secondary categories 

            // next for loop selects a level-2 property (e.g. Benefit, Other) from the categories object
            for(const secondaryCat in categories){
                /* select the value stored in the secondaryCat key of the categories object and assign
                secondaryCategories becomes an object containing the level-3 properties of a secondary category */
                const secondaryCategories = categories[secondaryCat]; 

                //inner for loop to extract the arrays from the level-3 properties
                for(const tertiaryCat in secondaryCategories){
                    /* dataArray will be an array of data objects stored in a level-3 property
                    data objects will be in the form of {"item": "Salary", "amount": 500, "frequency": "Weekly", "total": 1600} */
                    const dataArray = secondaryCategories[tertiaryCat]; 

                    /* if there is one or more data arrays stored in the level-3 property we need to append it to the rowData state array */
                    if(Array.isArray(dataArray) && dataArray.length > ZERO){

                        //create a new array of data objects
                        const modifiedArray = dataArray.map((obj)=>(
                            
                            {   
                                userId: userId, 
                                primaryCategory: primaryCat, 
                                secondaryCategory: secondaryCat,
                                tertiaryCategory: tertiaryCat,
                                ...obj             
                            }
                        ));
                        newRowData.push(...modifiedArray);   
                    }
                }
            }
        }
        setRowData(newRowData);

    },[]); //I think we only need this to run once when the component mounts

        

    //START- 2 functions which return the JSX to render the columns and rows of the reactstrap table which shows the data
        // the user submitted
        const renderTableHeaders = () => {
        
            const totalColumns = 8;
            
            const rowArray = new Array(totalColumns).fill(""); // Initialize an array to define 4 table columns with empty strings
            rowArray[0] = "User Id";
            rowArray[1] = "Primary Category";
            rowArray[2] = "Secondary Category";
            rowArray[3] = "Tertiary Category";
            rowArray[4] = "Item";
            rowArray[5] = "Amount";
            rowArray[6] = "Frequency";
            rowArray[7] = "4-Weekly Total";

            

            // Define widths for each column
            const columnWidths = ["7.5%", "12.5%", "15%", "15%", "15%", "10%", "12.5%", "12.5%"];
        
            return (
            <thead>
                <tr>
                    {rowArray.map((val, index) => (
                        <th key={index} style={{ width: columnWidths[index] }}>{val}</th>
                    ))}
                </tr>
            </thead>
            );
        
        };

        const renderTableRows = () => (
            <tbody>
                {rowData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        <td>
                            {row.userId}
                        </td>
                        <td>
                            {row.primaryCategory} 
                        </td>
                        <td>
                            {row.secondaryCategory}
                        </td>
                        <td>
                            {row.tertiaryCategory}
                        </td>
                        <td>
                            {row.item}
                        </td>
                        <td>
                            ${row.amount ? row.amount.toFixed(2) : "0.00"}
                        </td>
                        <td>
                            {row.frequency}
                        </td>
                        <td>
                            ${row.total? row.total.toFixed(2) : "0.00"}
                        </td>
                    </tr>
                ))}
            </tbody>
        );
    // END FUNCTIONS

    //Collapse event handler
    const handleExpand = () => {
        setIsOpen((prevState) => (
            !prevState
        ));
    };

    return(
        <>
            <LargeText>
                Your budget data has been successfully saved to the database ✅! Your next step 
                in getting your finances in order is to use the Budget Tool page to import some of your
                transaction data, which you can use to gain a more precise understanding of how much you
                are currently earning/spending in the budget items which you left blank.
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