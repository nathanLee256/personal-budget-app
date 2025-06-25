import { useState, useEffect, useRef } from 'react';
import {
    Button,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    FormGroup,
    Input,
    InputGroup,
    InputGroupText,
    Label,
    Table as ReactstrapTable,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
  } from 'reactstrap';
import styled from 'styled-components';
import { useAuth } from '../components/AuthContext.js';
import Autosuggest from 'react-autosuggest';
import debounce from 'lodash.debounce'; //module to speed up autosuggest




/* 
    This page is similar in structure to the Worksheet page. It prompts user to either enter the details of a new gift to record, 
    or view historical giving records for a selected year (years appear as folder tabs). If they choose to record a new gift, 
    they are prompted to enter the following gift details:

    //Example Gift Record
    {
        //Year== 2025, Month == "May", Week == 3
        type: "One-off",
        organisation: "Salvation Army",
        amount: 50,
        date: "23/05/2025",
        description: "Red shield appeal",
        receipt: "{url_path}"
    }
*/
export default function GivingTool(){

    // START Retrieve user_id from AuthContext

        const { userId } = useAuth();

    //END retrieve

    //START Collapse state and toggler function

        //state variable which stores the isOpen state (true/false) of the Collapse
        const [addgiftCollapse, setAddgiftCollapse] = useState(false);

        //toggler function which runs when user clicks Collapse button and reverses the isOPen state of the Collapse
        const collapseToggle = () => setAddgiftCollapse(!addgiftCollapse);

    //END Collapse 

    //START State object and toggler function for the 2 dropdowns 
        //array of bool values which represent the isOpen state of the two dropdowns in the Collapse JSX of the 2025 tab
        //The 2 dropdowns are located in the first 2 columns
        //each dropdown component is referenced by: dropdownOpen[colIndex]
        const [dropdown, setDropdown] = useState({
            columnOne: {
                dropdownOpen: false,
            },
            columnTwo: {
                dropdownOpen: false,
            }
        });

        //toggler function which reverses the isOpen state of a dropdown which is referenced by its colIndex
        const toggleDropdown = (colIndex) => {
            setDropdown((prevState) => ({
                ...prevState,
                [colIndex]: {
                    dropdownOpen: !prevState[colIndex].dropdownOpen
                }
            }));     
        }
        // array of gift types for the columnOne dropdown menu
        const giftTypes = [
            // note: some of these categories represent gifts that are not tax-deductible
            "Tithe",                      // not tax-deductible (typically given to a church, but not to a DGR in AU)
            "Personal Gift",             // not tax-deductible
            "Partnership Gift",          // not tax-deductible (depends on recipient’s DGR status)
            "Charitable Donation",       // tax-deductible if given to a registered DGR
            "Missionary Support",        // not tax-deductible (unless via a registered DGR)
            "Sponsorship",               // not tax-deductible (unless structured through a DGR)
            "Memorial Gift",             // tax-deductible if given to a DGR
            "Birthday/Anniversary Gift", // not tax-deductible
            "Event Donation",            // tax-deductible if no material benefit received and paid to a DGR
            "Building Fund",             // tax-deductible only if to a registered DGR (e.g., school building fund)
            "Relief Aid",                // tax-deductible if through a registered relief organization (e.g., Red Cross)
            "Education Fund",            // tax-deductible only if through a DGR (e.g., scholarship funds)
            "Pledge Payment",            // follows the original gift type (deductible only if pledged to a DGR)
            "Holiday Giving",            // not tax-deductible (typically informal or personal giving)
            "Anonymous Gift",            // follows underlying gift type
            "Community Outreach",        // tax-deductible if run by a DGR
            "Legacy/Bequest Gift"        // tax-deductibility depends on structure and recipient; usually not claimed by donor
        ];

        //column identifiers (used to reference a column from the JSX)
        const columnIDs = ["columnOne", "columnTwo"];

    //END state 

    //START state variables and handlers/helpers for the autosuggest functionality

        // array stores the full list of DGR's from the database
        const [orgList, setOrgList] = useState([]); 

        // stores the list of DGR suggestions which will populate the menu afer each keystroke of user input
        // there will be an event handler function which updates the list whenever the user input changes
        const [orgSuggestions, setOrgSuggestions] = useState([]); 

        //stores the current value in the input field
        const [orgValue, setOrgValue] = useState(''); 
        
        /* NB: the following functions are listed below in the order that they are called in the process */

        // 0- useEffect hook to retrieve organisations (from API endpoint, when page is first rendered)
        useEffect(() => {

            //fetch
            const url = "http://localhost:3001/gifts/retrieve_orgs";
            const options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            };
            const ZERO = 0;

            fetch(url, options)
                //set up the Promise chain
                // 1st .then() handles failure (IE Promise.state == 'rejected' && Promise.result == {err}) by throwing Error to catch
                .then(response => {
                    if(!response.ok){
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })

                //2nd .then() handles success (IE Promise.state == 'fulfilled' && Promise.result == {value})
                .then(data => {
                    //now the data the server sends back should be a JSON object in the following form:
                    /* 
                        data = {
                            "IsData": true,
                            "Organisations" : [
                                {"entityName": "Salvation Army", "abn": 1234567},
                                {"entityName": "Red Cross", "abn": 2345678}
                            ]
                        }
                     */
                    //first check data for server route error
                    const organisations = data.Organisations;
                    if (!Array.isArray(organisations) || organisations.length === ZERO) {
                        throw new Error("Server Route Error-Organisations is not a non-empty array.");
                    };

                    //update state
                    setOrgList(organisations);
                })

                // this block runs in the event that an error occured in either .then() block 
                .catch(error => {
                    console.error("Failed to retrieve organisations:", error.message);
                });

        }, []);

        //1- event handler which runs when user types input into <Autosuggest> input field
        const onOrgChange = (event, { newValue }) => {
            setOrgValue(newValue);
        };

        // 2a- runs by default every time orgValue state changes, and calls the 2b handler function 
        const onSuggestionsFetchRequested = ({ value }) => {
            debouncedFetchSuggestions(value);
        };

        //2b- debounce() which Filters the full org list to get matches based on current input
        const debouncedFetchSuggestions = debounce((value) => {
            const inputValue = value.trim().toLowerCase();
            const inputLength = inputValue.length;

            const filtered = inputLength === 0 ? [] : orgList.filter(org =>
                org.entityName.toLowerCase().includes(inputValue)
            );

            const limited = filtered.slice(0, 10); // only show top 10 matches
            setOrgSuggestions(limited);
        }, 150); // 150ms delay

        // 3- helper function which renders each suggestion in the dropdown list
        const renderSuggestion = (suggestion) => (
            <div>{suggestion.entityName}</div>
        );

        // 4-helper function which returns the suggestion string to display in the input after selection
        const getSuggestionValue = (suggestion) => suggestion.entityName;

        //5- event handler function which runs when the user has made a selection from dropdown list. It updates the userSelections state
        const onSuggestionSelected = (event, { suggestion }) => {
            setUserSelections(prev => ({
                ...prev,
                organisation: suggestion.entityName, abn: suggestion.abn
            }));
        };
        
        // 6-helper/cleanup function which Clears the suggestions list (called when input is cleared or blurred)
        const onSuggestionsClearRequested = () => {
            setOrgSuggestions([]);
        };

    //END state

    //START handler/s for the upload file functionality
        
        // note that we don't need to add a 'file' state object to store the uploaded file object since we are using 
        // the userSelections.receipt object.property for this purpose
        // handlers are defined here in the order that they are called

        //1- runs when user clicks the 'Upload Receipt' Button. When this occurs, the handler programmatically clicks 
        // the hidden <input type="file"> element which opens up the fs dialogue box, and prompts user to choose file
        const openFs = () => {
            document.getElementById('fileInput').click();
        };

        //2- handler is called automatically when user has selected a file from fs
        // It receives the file object (event.target.files[0]), and uses it to update the userSelections state obj
        const handleFileChange = (event) => {
            const selectedFile = event.target.files[0];
            if (selectedFile) {
                setUserSelections((prevState) => ({
                    ...prevState,
                    receipt: selectedFile
                }));
            }
        };
        
        
    //END handler/s

    // START State and updater function for the activeTab state
        
        //state which stores the current active folder tab (by its id)
        const [activeTab, setActiveTab] = useState(0);

        // Event handler function to toggle the active tab
        // When the user clicks (toggles) an inactive tab this function will run which will update the activeTab state to 
        // the id value of another tab (e.g. "2"). 
        const toggleTab = (tab) => {
            //update the activeTab
            if (activeTab !== tab) {
                setActiveTab(tab);
            }
        };


    // END State and updater function for the activeTab state

    //START state array  to store the folder tab values (years)

        const[tabLabels, setTabLabels] = useState([]);

        //useEffect hook which runs once everytime the page is first rendered, to obtain and set the tabLabels state array
        useEffect(() => {
            const year = new Date().getFullYear();
            const labels = [];
            for (let x = 0; x < 5; x++) {
                labels.push(year - x);
            }
            setTabLabels(labels);
        }, []);

    //END state variable

    //START state variable to store the user's donations (array of gift objects) returned from the server
        //initialise as an empty array
        const [userGifts, setUserGifts] = useState([]);
    //END state

    //START state object to store user selections: will be used to append new object to userGifts when user has entered all data
        const [userSelections, setUserSelections] = useState({
            giftType: "",
            organisation: "",
            amount: 0,
            date:"",
            description: "",
            receipt: {},   // will store the uploaded file object
        });

        //handler which runs when user enters a value in the 'amount' column <InputGrouptext> field
        const handleAmountChange = (val) => {
            //udpate the userSelections state
            setUserSelections((prevState) => ({
                ...prevState,
                amount: val
            }));

        };

        //handler which runs when the user enters/selects a date in the 'date' column
        const handleDateChange = (newDate) => {
            //udpate the userSelections state
            setUserSelections((prevState) => ({
                ...prevState,
                date: newDate
            }));
        };

        const handleDescriptionChange = (text) => {
            setUserSelections((prevState) => ({
                ...prevState,
                description: text
            }));

        }
    //END state

    //START event handlers
        const addRow = () => {
            
        };

        //runs when user selects a gift type from column 1 of table (when prompted to enter the dets of a new gift)
        const handleTypeSelect = (type) => {

            //check that function runs
            console.log("✅ handleTypeSelect is firing!"); 
            
            //update the dropdown state obj to display the selected gift type in the DropdownToggle
            setUserSelections((prevState) => ({
                ...prevState,
                giftType: type
            }))
            //now close the dropdown
            toggleDropdown(columnIDs[0]);
        };

        //function runs when user enters input in the Organisation (column 1) in the New Gift table
        //updates the userSelections state
        const handleOrgChange = (column, userInput) => {
            setUserSelections((prevState) => ({
                ...prevState, //preserve the other state obj properties
                [column]: userInput
            }));
        };

    //END handlers

    //START array to be mapped over in the JSX
        const tabIdArray = ["1","2","3","4","5"];
    //END array

    //START hook to perform fetch request to server to obtain user gifts for selected period
        /* useEffect(() => {

            //perform a fetch request to the server to obtain all of the donations the user has made in the selected year
            if (!userId) return; // ✅ Wait until userId is available before making the request

            //next obtain the selected year based on the tab param
            let selectedYear = 0;
            let tab = activeTab;

            switch(tab) {
                case tabIdArray[0]:
                    // in this case user has selected the current year folder tab
                    selectedYear = currentYear;
                    break;
                case tabIdArray[1]:
                    // current year -1
                    selectedYear = currentYear - 1;
                    break;
                case tabIdArray[2]:
                    // current year -2
                    selectedYear = currentYear - 2;
                    break;
                case tabIdArray[3]:
                    // current year -3
                    selectedYear = currentYear - 3;
                    break;
                case tabIdArray[4]:
                    // current year -4
                    selectedYear = currentYear - 4;
                    break;
                default:
                    // default code block
            }

            //perform fetch request (HTTP-GET) to the server route, send it the userId and selectedYear
            const url = `http://localhost:3001/giving_tool/retrieve_gift_items?UserId=${userId}&Year=${selectedYear}`;
            
            fetch(url, {
                method: "GET",
                headers: {
                "Accept": "application/json"
                },
            })

            // set up the Promise chain
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                //update userGifts array with server (data)
            })
            .catch(error => {
                console.error("Error:", error);
            });

        }, [activeTab]); */    //runs once when the component mounts (activeTab == currentYear), and then everytime user toggles another tab


    //END hook

    //START helper functions to render the JSX for the table headers/rows

        //function which returns the JSX representing the table headers
        const renderTableHeaders = () => {
        
            const totalColumns = 7;
            
            const rowArray = new Array(5).fill(""); // Initialize an array to define 5 table columns with strings
            rowArray[0] = "Gift Type";
            rowArray[1] = "Organisation";
            rowArray[2] = "Amount";
            rowArray[3] = "Date";
            rowArray[4] = "Description";
            rowArray[5] = "Receipt";
            rowArray[totalColumns - 1] = "Delete";

            // Define widths for each column
            const columnWidths = ["15%", "15%", "10%", "15%", "15%","15%","15%"];
        
            return (
                <thead>
                    <tr>
                        {rowArray.map((val, index) => (
                            <th key={index} style={{ width: columnWidths[index] }}>{ val }</th>
                        ))}
                    </tr>
                </thead>
            );
        };

        //function which returns the JSX representing the table rows
        const renderTableRows = (position) => { 

            if(position === "top"){
                //if this evals as T it means the collapse is not open in which case we just need to render the JSX above button
                //iterate (map) over the userGifts array and display each object in the array in a single table row
                return(
                    <>
                    </>
                    
                );
            }else{
                console.log("✅ Rendering dropdown row"); 
                //if this runs it means the collapse has been opened in which case we need this func to render the JSX of the Collapse
                return(
                    <tbody>
                        <tr>
                            <td>
                                {/* column 0 displays a dropdown which prompts the user to enter a gift type */}
                                <Dropdown
                                    isOpen={dropdown[columnIDs[0]].dropdownOpen}
                                    toggle={() => toggleDropdown(columnIDs[0])}
                                >
                                    <DropdownToggle caret color="info">
                                        {userSelections.giftType || "Select Type"}
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        {/* iterate over giftTypes to display DropdownItems */}
                                        {
                                            giftTypes.map((cat, i) => (
                                                <DropdownItem
                                                    key={i}
                                                    onClick={() => handleTypeSelect(cat)}
                                                >{cat}
                                                </DropdownItem>
                                            ))
                                        }
                                    </DropdownMenu>
                                </Dropdown>
                            </td>
                            <td>
                                {/* column 1 displays an input field which prompts user to enter the name of the organisation */}
                                <SuggestionsWrapper>
                                    <Autosuggest
                                        suggestions={orgSuggestions}
                                        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                                        onSuggestionsClearRequested={onSuggestionsClearRequested}
                                        getSuggestionValue={getSuggestionValue}
                                        renderSuggestion={renderSuggestion}
                                        onSuggestionSelected={onSuggestionSelected}
                                        inputProps={{
                                            placeholder: "Enter organisation",
                                            value: orgValue,
                                            onChange: onOrgChange
                                        }}
                                    />
                                    {
                                        orgSuggestions.length === 0 && !userSelections.organisation && orgValue ? 
                                            <p>
                                                No matches found
                                            </p> : 
                                            <></>
                                    }
                                </SuggestionsWrapper>
                            </td>
                            <td>
                                {/* column 2 displays an amount input which prompts the user to enter a gift type */}
                                <InputGroup>
                                    <InputGroupText>$</InputGroupText> {/* Prepend $ symbol */}
                                    <Input
                                        value={userSelections.amount}
                                        onChange={(e) => handleAmountChange(e.target.value)}
                                        placeholder="Enter amount"
                                    />
                                </InputGroup>
                            </td>
                            <td>
                                {/* column 3  prompts the user to select a date or enter a date */}
                                <input
                                    type="date"
                                    value={userSelections.date}
                                    onChange={(e) => handleDateChange(e.target.value)}
                                />
                            </td>
                            <td>
                                {/* column 4 displays an Input which prompts the user to enter a string gift description */}   
                                <FormGroup>
                                    <Input
                                        id="descriptionText"
                                        name="text"
                                        type="textarea"
                                        placeholder="Enter gift description"
                                        value={userSelections.description}
                                        onChange={(e) => handleDescriptionChange(e.target.value)}
                                    />
                                </FormGroup>
                            </td>
                            <td>
                                {/* column 5 displays an 'Upload Receipt' Button which prompts the user to upload a receipt file */}
                                <Button color="info" onClick={() => openFs()}>
                                    Upload Receipt
                                </Button>
                                {/* NB: this is a hidden <input> element */}
                                <input
                                    type="file"
                                    id="fileInput"
                                    accept=".pdf,.png,.jpg,.jpeg"
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                />
                                {/* display a message when file has been selected */}
                                {userSelections.receipt.name && (
                                    <p style={{ fontSize: '0.8rem', marginTop: '5px' }}>
                                        Selected file: {userSelections.receipt.name}
                                    </p>
                                )}
                            </td>
                            <td>
                                {/* column 6 displays a 'Add New Gift' Button which allows user to submit the new gift details */}
                            </td>
                        </tr>
                    </tbody>
                    
                );
            }
               
        };

    //END Helper functions

        

    



    //JSX
    return(
        <SubWrapper>
            <StyledContainer>
                <AgThemeBalham>
                    <h1>Record a New Gift/Donation or View Past Gifts</h1>
                </AgThemeBalham>
                <LargeText>
                    Please click below to record the details 📝 of a new gift/donation 💲, or select a year📅 to view past donations.
                </LargeText>
                {/* container for group of tabs */}
                <Nav tabs>
                    {
                        tabLabels.map((year, index) => (
                            <NavItem key={year}>
                                {/* clickable link inside NavItem */}
                                <StyledNavLink
                                    className={activeTab === index ? "active" : ""}
                                    onClick={() => toggleTab(index)}
                                >
                                    {tabLabels[index]}
                                </StyledNavLink>
                            </NavItem>
                        ))
                    }
                </Nav>
                {/* A container for the content displayed based on the currently active tab. */}
                <TabContent activeTab={activeTab}>
                    {/* JSX which is rendered when its tabId matches the activeTab value in <TabContent> */}
                    {/* TabPane encloses the JSX content associated with a specific folder tab */}
                    {
                        tabLabels.map((year, index) => (
                            <TabPane key={year} tabId={index} style={{backgroundColor: "white", padding: "0 20px"}}>
                                <h3>{ tabLabels[index] } Gifts:</h3>
                                {/* render the historical gifts (table headers and data rows) if userGifts is truthy */}
                                {
                                    Array.isArray(userGifts) && userGifts.length > 0 ? 
                                    <>
                                        <StyledTable borderless>
                                            {renderTableHeaders()}
                                            {renderTableRows("top")}
                                        </StyledTable>
                                    </> : 
                                    <>
                                        <p>No gifts for selected period</p>
                                    </>
                                }
                                {/* render the prompt to enter new gift for the 2025 folder tab */}
                                { 
                                    index === 0 ? 
                                    <>
                                        <h3>New Gift</h3>
                                        <p>Enter gift details below:</p>
                                        <StyledTable borderless>
                                            {renderTableHeaders()}
                                            {renderTableRows("bottom")}
                                        </StyledTable>
                                    </> : 
                                    <></> 
                                }   
                            </TabPane> 
                        ))
                    }
                </TabContent>
            </StyledContainer>
        </SubWrapper>
    );
};

//styles

//outer containing element which specifies the page background and height
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

//specifies the <h1> header style using a theme
const AgThemeBalham = styled.div.attrs(() => ({
    className: 'ag-theme-balham',}))`
  
`;

//specifies the <p> text style under <h1> header 
const LargeText = styled.p`
    font-size: 1.2rem; // Standard font size
    line-height: 1.5; // Standard line height
    font-weight: normal; // Normal font weight
    color: #333; // Standard text color
    margin: 1rem 0; // Standard margin
    text-align: left;
`;

//specifies the style of the NavLink elements (clickable links inside folder tabs)
const StyledNavLink = styled(NavLink)`
    cursor: pointer;
    font-size: 1.25rem;
    font-weight: bold;
    background-color: #f5f5f5;
    border: 1px solid #d3d3d3 !important; /* Light grey border always visible */
    border-radius: 4px;

    &.active {
      background-color: white !important;
      color: black !important;
      border: 2px solid black !important;
      /* No need to repeat border-radius here if it's the same */
    }
`;

//specifies the style of the ReactStrapTable
const StyledTable = styled(ReactstrapTable)`
`;

//specifies the style of the 'Add New Gift' button which appears at the bottom of the table
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




//specifies the style of the Autosuggest component (which it wraps)
const SuggestionsWrapper = styled.div`
    position: relative; /* ⬅️ Add this to anchor the absolute dropdown */

    .react-autosuggest__suggestions-list {
        list-style-type: none;
        padding-left: 0;
        margin: 0;
        max-height: 200px;
        overflow-y: auto;
        border: 1px solid #ccc;
        background-color: white;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        position: absolute;
        width: 200%; /* ⬅️ Limit width to match parent (input field) */
    }

    .react-autosuggest__suggestion {
        cursor: pointer;
        padding: 8px;
    }

    .react-autosuggest__suggestion--highlighted {
        background-color: #e6f7ff;
    }
`;


