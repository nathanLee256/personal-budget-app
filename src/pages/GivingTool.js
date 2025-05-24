import { useState, useEffect } from 'react';
import {
    Button,
    Collapse,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
  } from 'reactstrap';
import styled from 'styled-components';


/* 
    This page is similar in structure to the Worksheet page. It prompts user to either enter the details of a new gift to record, 
    or view historical giving records for a selected year (years appear as folder tabs). If they choose to record a new gift, 
    they are prompted to enter the following gift details:

    //Example Gift Record
    {
        //Year== 2025, Month == "May", Week == 3
        type: "Tithe",
        organisation: "Highway Church",
        amount: 50,
        date: "23/05/2025",
        description: "weekly tithe",
        receipt: "{url_path}"
    }
*/
export default function GivingTool(){

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

    //state variable to store the current year
    const[currentYear, setCurrentYear] = useState(null);

    //useEffect hook which runs once everytime the page is first rendered, to obtain and set the currentYear state
    useEffect(() => {
        const year = new Date().getFullYear();
        setCurrentYear(year); // ✅ This is allowed
    }, []);

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
                    {/* TabPane represents the JSX content associated with a specific folder tab */}
                    {/* tab 1 */}
                    <TabPane tabId="1" style={{backgroundColor: "white", padding: "0 20px"}}>

                    </TabPane>
                    {/* tab 2 */}
                    <TabPane tabId="2" style={{backgroundColor: "white", padding: "0 20px"}}>

                    </TabPane>
                    {/* tab 3 */}
                    <TabPane tabId="3" style={{backgroundColor: "white", padding: "0 20px"}}>

                    </TabPane>
                    {/* tab 4 */}
                    <TabPane tabId="4" style={{backgroundColor: "white", padding: "0 20px"}}>

                    </TabPane>
                    {/* tab 5 */}
                    <TabPane tabId="5" style={{backgroundColor: "white", padding: "0 20px"}}>

                    </TabPane>
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