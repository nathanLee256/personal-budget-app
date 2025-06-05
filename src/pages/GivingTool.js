import { useState, useEffect, useRef } from 'react';
import {
    Button,
    Collapse,
    Table as ReactstrapTable,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
  } from 'reactstrap';
import styled from 'styled-components';
import { useAuth } from '../components/AuthContext.js';


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

    // START State and updater function for the activeTab state
        
        //state which stores the current active folder tab (by its id)
        const [activeTab, setActiveTab] = useState("1");

        // Event handler function to toggle the active tab
        // When the user clicks (toggles) an inactive tab this function will run which will update the activeTab state to 
        // the id value of another tab (e.g. "2"). 
        const toggleTab = (tab) => {
            if (activeTab !== tab) {
                setActiveTab(tab);
            }
        };
    // END State and updater function for the activeTab state

    //START state variable  to store the current year
        const[currentYear, setCurrentYear] = useState(null);

        //useEffect hook which runs once everytime the page is first rendered, to obtain and set the currentYear state
        useEffect(() => {
            const year = new Date().getFullYear();
            setCurrentYear(year); // ✅ This is allowed
        }, []);

    //END state variable

    //START state variable to store the user's donations (array of gift objects) returned from the server
        //initialise as an empty array
        const [userGifts, setUserGifts] = useState([]);
    //END state

    //START event handlers
        const addRow = () => {
            
        };

    //END handlers

    //START array to be mapped over in the JSX
        const tabIdArray = ["1","2","3","4","5"];
    //END array

    //START hook to perform fetch request to server to obtain user gifts for selected period
        useEffect(() => {

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

        }, [activeTab]);    //runs once when the component mounts (activeTab == currentYear), and then everytime user toggles another tab


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
                            <th key={index} style={{ width: columnWidths[index] }}>{val}</th>
                        ))}
                    </tr>
                </thead>
            );
        };

        //function which returns the JSX representing the table rows
        const renderTableRows = () => { 

            

            
            return(
                <>
                </>
                
            );
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
                    {/* folder tab for current year */}
                    <NavItem>
                        {/* clickable link inside NavItem */}
                        <StyledNavLink
                            className={activeTab === "1" ? "active" : ""}
                            onClick={() => toggleTab("1")}
                        >
                            {currentYear}
                        </StyledNavLink>
                    </NavItem>
                    <NavItem>
                        <StyledNavLink
                            className={activeTab === "2" ? "active" : ""}
                            onClick={() => toggleTab("2")}
                        >
                            {currentYear - 1}
                        </StyledNavLink>
                    </NavItem>
                    <NavItem>
                        <StyledNavLink
                            className={activeTab === "3" ? "active" : ""}
                            onClick={() => toggleTab("3")}
                        >
                            {currentYear - 2}
                        </StyledNavLink>
                    </NavItem>
                    <NavItem>
                        <StyledNavLink
                            className={activeTab === "4" ? "active" : ""}
                            onClick={() => toggleTab("4")}
                        >
                            {currentYear - 3}
                        </StyledNavLink>
                    </NavItem>
                    <NavItem>
                        <StyledNavLink
                            className={activeTab === "5" ? "active" : ""}
                            onClick={() => toggleTab("5")}
                        >
                            {currentYear - 4}
                        </StyledNavLink>
                    </NavItem>
                </Nav>
                {/* A container for the content displayed based on the currently active tab. */}
                <TabContent activeTab={activeTab}>
                    {/* JSX which is rendered when its tabId matches the activeTab value in <TabContent> */}
                    {/* TabPane encloses the JSX content associated with a specific folder tab */}
                    {
                        tabIdArray.map((tabId) => (
                            <TabPane tabId={tabId} style={{backgroundColor: "white", padding: "0 20px"}}>
                                <StyledTable borderless>
                                    {renderTableHeaders()}
                                    {renderTableRows()}
                                </StyledTable>
                                {/* For the tab representing current year, render a button under table */}
                                { 
                                    tabId === "1"? <StyledButton onClick={addRow}>Add New Gift</StyledButton> : <></> 
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