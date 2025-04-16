import {
    Input,
    InputGroup, 
    InputGroupText,
    Table as ReactstrapTable,
    Button,
    Dropdown, 
    DropdownToggle, 
    DropdownMenu, 
    DropdownItem
  } from 'reactstrap';

import styled from 'styled-components';

/* This component displays a table which promts the user to enter their  Other Living Costs >Living >Expenditure Items */
export default function OLETable({  // 
    oleState,                          
    setOleState,
    }){


    //standard income frequencies
        const frequencies = [
            "Weekly",
            "Fortnightly",
            "Monthly",
            "Quarterly",
            "Annually"
        ]
    
        
        // Event handlers 
    
            // function which appends a new row object to the state.Data array using the state updater
            // Each new row is represented as an object with the same structure as the existing rows
            const addRow = () => {
                setOleState((prevState) => ({
                  ...prevState, // Preserve other properties of the state
                  Data: [
                    ...prevState.Data,
                    { item: "", amount: 0, frequency: "", total: 0 }, // Add a new row
                  ],
                  Placeholders: [
                    ...prevState.Placeholders,
                    "e.g. other item", // Add a new placeholder
                  ],
                  DropdownOpen: [...prevState.DropdownOpen, false], // Add a new dropdown state
                }));
              };
    
        
            // function which updates specific fields in the Data array when the user types in the input fields.
            /* this is how the function is called from within the JSX:
            onChange={(e) => handleVteRowChange(rowIndex, "item", e.target.value)} */

            const handleRowChange = (index, field, userInput) => {
                setOleState((prevState) => ({
                  ...prevState, // Preserve other properties of the state
                  Data: prevState.Data.map((row, rowIndex) =>
                    rowIndex === index ? { ...row, [field]: userInput } : row // Update the specified row
                  ),
                }));
              };
    
              const toggleDropdown = (index) => {
                setOleState((prevState) => ({
                  ...prevState, // Preserve other properties of the state
                  DropdownOpen: prevState.DropdownOpen.map((isOpen, i) =>
                    i === index ? !isOpen : isOpen // Toggle the specified dropdown state
                  ),
                }));
              };
    
            //function to calculate the new total everytime the frequency field of a row is updated
            
            function calcTotal(amt, frek) {
                const FOUR = 4;
                const TWO = 2;
                const MONTH_CONVERSION_FACTOR = 0.92;
                const QUARTER_CONVERSION_FACTOR = 0.31;
                const ANN_CONVERSION_FACTOR = 0.08;
    
                let newTotal = 0;
                switch (frek) {
                    case frequencies[0]: // Weekly
                        newTotal = amt * FOUR;
                        break;
                    case frequencies[1]: // Fortnightly
                        newTotal = amt * TWO;
                        break;
                    case frequencies[2]: // Monthly
                        newTotal = amt * MONTH_CONVERSION_FACTOR;
                        break;
                    case frequencies[3]: // Quarterly
                        newTotal = amt * QUARTER_CONVERSION_FACTOR;
                        break;
                    case frequencies[4]: // Annually
                        newTotal = amt * ANN_CONVERSION_FACTOR;
                        break;
                    default:
                        newTotal = 0; // Default to 0 for invalid frequencies
                }
                return newTotal;
            }
    
            // Event handler for frequency changes
            const handleFreqChange = (index, field, newFreq) => {
                setOleState((prevState) => ({
                  ...prevState, // Preserve other properties of the state
                  Data: prevState.Data.map((row, rowIndex) =>
                    rowIndex === index
                      ? {
                          ...row,
                          [field]: newFreq, // Update the frequency field
                          total: calcTotal(parseFloat(row.amount) || 0, newFreq), // Update the total based on the new frequency
                        }
                      : row
                  ),
                }));
            };
    
    
            //I need to define a function here which uses a callback to update the state.Data state when a user deletes an item
            const handleDelete = (indexToDelete) => {
                setOleState((prevState) => ({
                  ...prevState, // Preserve other properties of the state
                  Data: prevState.Data.filter((_, index) => index !== indexToDelete),
                  Placeholders: prevState.Placeholders.filter((_, index) => index !== indexToDelete),
                  DropdownOpen: prevState.DropdownOpen.filter((_, index) => index !== indexToDelete),
                }));
            };
    
            //
        //END: EVENT HANDLERS
    
    
        // FUNCTIONS
        // finally 2 functions which are called from within the  component JSX to render the table headers and table rows
        //  for the table returned by the component. The renderTableHeaders function is a generic function identical to the code
        // used in the components which will render the other tables. These functions return JSX themselves 
    
            const renderTableHeaders = () => {
    
                const totalColumns = 5;
                
                const rowArray = new Array(5).fill(""); // Initialize an array to define 5 table columns with empty strings
                rowArray[0] = "Item";
                rowArray[1] = "Amount";
                rowArray[2] = "Frequency";
                rowArray[3] = "Total";
                rowArray[totalColumns - 1] = "Delete";
    
                // Define widths for each column
                const columnWidths = ["25%", "15%", "15%", "15%", "15%"];
            
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
                    {oleState.Data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            <td>
                                <Input
                                    value={row.item}
                                    onChange={(e) => handleRowChange(rowIndex, "item", e.target.value)}
                                    placeholder={oleState.Placeholders[rowIndex]}
                                />
                            </td>
                            <td>
                                <InputGroup>
                                    <InputGroupText>$</InputGroupText> {/* Prepend $ symbol */}
                                    <Input
                                        value={row.amount}
                                        onChange={(e) => handleRowChange(rowIndex, "amount", e.target.value)}
                                        placeholder="Enter amount"
                                    />
                                </InputGroup>
                            </td>
                            <td>
                                <Dropdown
                                isOpen={oleState.DropdownOpen[rowIndex]} // Controls visibility based on state
                                toggle={() => toggleDropdown(rowIndex)} // Toggles visibility
                                >
                                <DropdownToggle caret color="info">
                                    {oleState.Data[rowIndex].frequency || "Select Frequency"}
                                </DropdownToggle>
                                <DropdownMenu>
                                    {
                                        frequencies.map((freq)=>(<DropdownItem onClick={() => handleFreqChange(rowIndex,"frequency", freq)}>{freq}</DropdownItem>))
                                    } 
                                </DropdownMenu>
                                </Dropdown>
                            </td>
                            <td>
                                ${row.total ? row.total.toFixed(2) : "0.00"}
                            </td>
                            <td>
                                <Button color="danger" onClick={() => handleDelete(rowIndex)}>-delete item</Button>
                            </td>
                        </tr>
                        
                    ))}
                </tbody>
            );
        // END SI Table FUNCTIONS
    
    
    
        return (
            <>
                <h4>Other Living Costs</h4>
                <StyledTable borderless>
                    {renderTableHeaders()}
                    {renderTableRows()}
                </StyledTable>
                <StyledButton onClick={addRow}>
                    Add Other Living Expenditure Item
                </StyledButton>
            </>
        );
}



const StyledButton = styled(Button)`
    background-color: #007bff; /* Primary blue */
    color: white;             /* Text color */
    font-size: 16px;          /* Increase font size */
    padding: 10px 20px;       /* Add padding */
    margin-bottom: 20px;
    margin-left: 5px;
    border-radius: 5px;       /* Rounded corners */
    &:hover {
        background-color: #0056b3; /* Darker blue on hover */
    }
`;

const StyledTable = styled(ReactstrapTable)`
`;