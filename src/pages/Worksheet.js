import React from 'react';
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
import { useState } from 'react';
import SITable from '../components/SITable.js';
import BITable from '../components/BITable.js';
import OITable from '../components/OITable.js';
import RHETable from '../components/RHETable.js';
import BHETable from '../components/BHETable.js';
import GLETable from '../components/GLETable.js';
import HLETable from '../components/HLETable.js';
import OLETable from '../components/OLETable.js';
import VTETable from '../components/VTETable.js';
import PTETable from '../components/PTETable.js';
import OTETable from '../components/OTETable.js';
import SFETable from '../components/SFETable.js';
import PFETable from '../components/PFETable.js';
import CFETable from '../components/CFETable.js';
import SLETable from '../components/SLETable.js';
import MLETable from '../components/MLETable.js';
import LLETable from '../components/LLETable.js';
import SaFETable from '../components/SaFETable.js';
import IFETable from '../components/IFETable.js';
import GGETable from '../components/GGETable.js';
import DDETable from '../components/DDETable.js';
import { useContext, useEffect } from 'react';
import { useAuth } from '../components/AuthContext.js';
import SubmittedDataTable from '../components/SubmittedDataTable.js';
  
  export default function Worksheet() {

    // Retrieve user_id from AuthContext
    const { userId, setUserId, authenticated } = useAuth();

    //create a state variable to store the data object the user submits when they save their data
    const[dataPayload, setDataPayload] = useState(null); //rename this variable in Worksheet to avoid confusion

    // a STATE object to render a different page when user submits data, and a state to store the JSON response
    const[isDataSubmitted, setIsDataSubmitted] = useState(false);
    const [serverResponse, setServerResponse] = useState(null);

    //START state object and event handler function to store/update the state of each Collapse element (expenditure tab collapses)
   
      // a state object
      const [expCollapses, setExpCollapses] = useState({
        "Home": false, // Expenditure>Home - initially closed
        "Living Costs": false, // Expenditure>Living Costs
        "Travel": false, // Expenditure>Travel
        "Family and Pets": false, // Expenditure>Family and Pets
        "Leisure": false, // Expenditure>Leisure
        "Future Needs": false, // Expenditure>Future Needs
        "Giving": false, // Expenditure>Giving
        "Debt Repayments": false, // Expenditure>Debt Repayments
        });

        //event handler function runs when the user clicks a specific Collpase element. When they do, an string value is passed to the 
        //function which corresponds to the property in the collapses object which stores the open/closed state for that element
        // The result is that only the targeted Collapse element's state is updated, while the other properties remain unchanged
        const handleExpCollapse = (key) => {
        setExpCollapses((prev) => ({ // prev is the current state object before the update
            ...prev,                // the spread operator copies the current state object properties, and then..
            [key]: !prev[key],      // Updates the specified key
        }));
        };
    // END state object and toggle function to store the state of each Collapse element

    //START state object and event handler function to store/update the state of each Collapse element (income tab collapses)
   
      // a state object
      const [incCollapses, setIncCollapses] = useState({
        "Standard Income": false, // Income>Standard Income - initially closed
        "Benefit Income": false, // Income>Benefit Income
        "Other Income": false, // Income>Other
        });

        //event handler function runs when the user clicks a specific Collpase element. When they do, an string value is passed to the 
        //function which corresponds to the property in the collapses object which stores the open/closed state for that element
        // The result is that only the targeted Collapse element's state is updated, while the other properties remain unchanged
        const handleIncCollapse = (key) => {
        setIncCollapses((prev) => ({ // prev is the current state object before the update
            ...prev,                // the spread operator copies the current state object properties, and then..
            [key]: !prev[key],      // Updates the specified key
        }));
        };
    // END state object and toggle function to store the state of each Collapse element (income tab collapses)

    
    // START State and updater function for the activeTab state
    
      const [activeTab, setActiveTab] = useState("1");

      // Event handler function to toggle the active tab
      // When the user clicks (toggles) the inactive tab this function will run which will update the activeTab state to 
      // the id value of another tab (e.g. "2"). 
      const toggleTab = (tab) => {
        if (activeTab !== tab) {
          setActiveTab(tab);
        }
      };
    // END State and updater function for the activeTab state
    
    // START Income Secondary Category Components
      // STATE VARIABLES for SITable
        const siItems = [
          "e.g. Gross Salary/Wages",
          "e.g. Bonuses",
          "e.g. Rental Income",
          "e.g. Dividends",
          "e.g. Bonds",
          "e.g. Interest",
          "e.g. Tax free income",
        ];
        
        // siData is an array of objects representing a single row in the si table
        // siPlaceholders is an array of string placeholders which will be displayed in the Item column of each row in the table
        //siDropdownOpen is an array to hold the state of each dropdown menu in the Frequency column of the table
        
        //declare a state object this time instead of 3 state variables
        const [siState, setSiState] = useState({
          Data: new Array(siItems.length).fill({ item: "", amount: 0, frequency: "", total: 0 }),
          Placeholders: [...siItems],
          DropdownOpen: new Array(siItems.length).fill(false),
        });

      // END STATE variables for SITable

      // STATE VARIABLES for BITable
        const biItems = [
          "e.g. JobSeeker payments",
          "e.g. Disability Benefits",
          "e.g. Pension Payments",
          "e.g. Veterans' Benefits",
          "e.g. Workers' Compensation",
          "e.g. Health Insurance Subsidies",
          "e.g. Study Assistance",
        ];

        //state object
        const [biState, setBiState] = useState({
          Data: new Array(biItems.length).fill({ item: "", amount: 0, frequency: "", total: 0 }),
          Placeholders: [...biItems],
          DropdownOpen: new Array(biItems.length).fill(false),
        });
        
        

      // END STATE variables for BITable

      // STATE VARIABLES for OITable
        const oiItems = [
          "e.g. Earned Income Tax Credit ",
          "e.g. Child Tax Credit",
          "e.g. Energy Assistance Rebates",
          "e.g. Tax Return",
          "e.g. Alimony",
          "e.g. Legal Settlements",
          "e.g. Side-Hustle",
        ];

        //state object
        const [oiState, setOiState] = useState({
          Data: new Array(oiItems.length).fill({ item: "", amount: 0, frequency: "", total: 0 }),
          Placeholders: [...oiItems],
          DropdownOpen: new Array(oiItems.length).fill(false),
        });
        
        

      // END STATE variables for OITable

    // END Income Secondary categories

    //START Expenditure Secondary Categories

      // STATE VARIABLES for RHETable (Rent and Mortgage>Home>Expenditure)
        const rheItems = [
          "e.g. Rent",
          "e.g. Mortgage Payments",
          "e.g. Property Taxes",
          "e.g. Home Insurance",
          "e.g. Homeowners Association (HOA) Fees",
          "e.g. Maintenance and Repairs",
        ];
        
        //state object
        const [rheState, setRheState] = useState({
          Data: new Array(rheItems.length).fill({ item: "", amount: 0, frequency: "", total: 0 }),
          Placeholders: [...rheItems],
          DropdownOpen: new Array(rheItems.length).fill(false),
        });

      // END STATE variables for RHETable

      // STATE VARIABLES for BHETable (Bills-Home-Expenditure)
        const bheItems = [
          "e.g. Electricity",
          "e.g. Water",
          "e.g. Gas",
          "e.g. Internet",
          "e.g. Cable or Streaming Services",
          "e.g. Trash Collection",
          "e.g. Phone Bill",
        ];

        //state object
        const [bheState, setBheState] = useState({
          Data: new Array(bheItems.length).fill({ item: "", amount: 0, frequency: "", total: 0 }),
          Placeholders: [...bheItems],
          DropdownOpen: new Array(bheItems.length).fill(false),
        });
        
      // END STATE Variables for BHETable

      // STATE VARIABLES for GLETable (General Living Costs>Living>Expenditure)
        const gleItems = [
          "e.g. Groceries",
          "e.g. Takeaway",
          "e.g. Clothing",
          "e.g. Clothing Maintenance",
          "e.g. Hair cuts",
        ];

        //state object
        const [gleState, setGleState] = useState({
          Data: new Array(gleItems.length).fill({ item: "", amount: 0, frequency: "", total: 0 }),
          Placeholders: [...gleItems],
          DropdownOpen: new Array(gleItems.length).fill(false),
        });

      // END STATE for GLETable

      // STATE VARIABLES for HLETable (Health-Related Living Costs>Living>Expenditure)
        const hleItems = [
          "e.g. Doctor Visits",
          "e.g. Dentist",
          "e.g. Physio",
          "e.g. Prescription medications",
          "e.g. Non-prescription medications",
        ];

        //state object
        const [hleState, setHleState] = useState({
          Data: new Array(hleItems.length).fill({ item: "", amount: 0, frequency: "", total: 0 }),
          Placeholders: [...hleItems],
          DropdownOpen: new Array(hleItems.length).fill(false),
        });

      // END STATE for HLETable

      // STATE VARIABLES for OLETable (Other Living Costs>Living>Expenditure)
        const oleItems = [
          "e.g. Bank Account Fees",
          "e.g. Tax Return",
        ];

        //state object
        const [oleState, setOleState] = useState({
          Data: new Array(oleItems.length).fill({ item: "", amount: 0, frequency: "", total: 0 }),
          Placeholders: [...oleItems],
          DropdownOpen: new Array(oleItems.length).fill(false),
        });

      // END STATE for OLETable

      //START STATE VARIABLES for VTETable (Vehice>Travel>Expenditure)
        const vteItems = [
          "e.g. Registration",
          "e.g. Car Insurance",
          "e.g. Servicing",
          "e.g. Fuel",
          "e.g. Road Tolls",
        ];
        
        //declare a state object this time instead of 3 state variables
        const [vteState, setVteState] = useState({
          vteData: new Array(vteItems.length).fill({ item: "", amount: 0, frequency: "", total: 0 }),
          vtePlaceholders: [...vteItems],
          vteDropdownOpen: new Array(vteItems.length).fill(false),
        });

      //END STATE for VTETable

      //START STATE VARIABLES for PTETable (Public Transport>Travel>Expenditure)
        const pteItems = [
          "e.g. Bus",
          "e.g. Train",
        ];
        
        //declare a state object this time instead of 3 state variables
        const [pteState, setPteState] = useState({
          pteData: new Array(pteItems.length).fill({ item: "", amount: 0, frequency: "", total: 0 }),
          ptePlaceholders: [...pteItems],
          pteDropdownOpen: new Array(pteItems.length).fill(false),
        });

      //END STATE for PTETable

      //START STATE VARIABLES for OTETable (Other Transport>Travel>Expenditure)
        const oteItems = [
          "e.g. Parking",
          "e.g. Speeding fines",
        ];
        
        //declare a state object this time instead of 3 state variables
        const [oteState, setOteState] = useState({
          oteData: new Array(oteItems.length).fill({ item: "", amount: 0, frequency: "", total: 0 }),
          otePlaceholders: [...oteItems],
          oteDropdownOpen: new Array(oteItems.length).fill(false),
        });

      //END STATE for OTETable

      //START STATE VARIABLES for SFETable (School Costs > Family >Expenditure)
        const sfeItems = [
          "e.g. school fees",
          "e.g. uniforms",
          "e.g. textbooks",
          "e.g. excursions",
          "e.g. school supplies",
          "e.g. school memberships/clubs",
          "e.g. lunch money",
        ];
        
        //declare a state object this time instead of 3 state variables
        const [sfeState, setSfeState] = useState({
          Data: new Array(sfeItems.length).fill({ item: "", amount: 0, frequency: "", total: 0 }),
          Placeholders: [...sfeItems],
          DropdownOpen: new Array(sfeItems.length).fill(false),
        });

      //END STATE for SFETable

      //START STATE VARIABLES for PFETable (Pet Costs > Family > Expenditure)
        const pfeItems = [
          "e.g. food",
          "e.g. vet bills",
          "e.g. toys",
          "e.g. equipment",
          "e.g. medications",
          "e.g. grooming",
        ];
        
        //declare a state object this time instead of 3 state variables
        const [pfeState, setPfeState] = useState({
          Data: new Array(pfeItems.length).fill({ item: "", amount: 0, frequency: "", total: 0 }),
          Placeholders: [...pfeItems],
          DropdownOpen: new Array(pfeItems.length).fill(false),
        });

      //END STATE for PFETable

      //START STATE VARIABLES for CFETable (Child Costs > Family > Expenditure)
        const cfeItems = [
          "e.g. sports club membership",
          "e.g. sporting equipment",
          "e.g. piano lessons",
          "e.g. pocket money",
          "e.g. clothing",
          "e.g. birthday/ Christmas presents",
          "e.g. tooth fairy",
        ];
        
        //declare a state object this time instead of 3 state variables
        const [cfeState, setCfeState] = useState({
          Data: new Array(cfeItems.length).fill({ item: "", amount: 0, frequency: "", total: 0 }),
          Placeholders: [...cfeItems],
          DropdownOpen: new Array(cfeItems.length).fill(false),
        });

      //END STATE for CFETable

      //START STATE VARIABLES for SLETable (Subscriptions > Leisure > Expenditure)
        const sleItems = [
          "e.g. Netflix",
          "e.g. Youtube",
          "e.g. Swellnet",
          "e.g. Paramount Plus",
        ];
        
        //declare a state object this time instead of 3 state variables
        const [sleState, setSleState] = useState({
          Data: new Array(sleItems.length).fill({ item: "", amount: 0, frequency: "", total: 0 }),
          Placeholders: [...sleItems],
          DropdownOpen: new Array(sleItems.length).fill(false),
        });

      //END STATE for SLETable

      //START STATE VARIABLES for MLETable (Memberships > Leisure > Expenditure)
        const mleItems = [
          "e.g. Golf Membership",
          "e.g. Spa and Sauna membership",
        ];
        
        //declare a state object this time instead of 3 state variables
        const [mleState, setMleState] = useState({
          Data: new Array(mleItems.length).fill({ item: "", amount: 0, frequency: "", total: 0 }),
          Placeholders: [...mleItems],
          DropdownOpen: new Array(mleItems.length).fill(false),
        });

      //END STATE for MLETable

      //START STATE VARIABLES for LLETable (Other Leisure > Leisure > Expenditure)
        const lleItems = [
          "e.g. Golf Equipment",
          "e.g. Fishing equipment",
          "e.g. Fishing trips",
          "e.g. Movie nights",
          "e.g. Date nights",
          "e.g. Day trips",
          "e.g. Music",
          "e.g. Video games"
        ];
        
        //declare a state object this time instead of 3 state variables
        const [lleState, setLleState] = useState({
          Data: new Array(lleItems.length).fill({ item: "", amount: 0, frequency: "", total: 0 }),
          Placeholders: [...lleItems],
          DropdownOpen: new Array(lleItems.length).fill(false),
        });

      //END STATE for LLETable

      //START STATE VARIABLES for SaFETable (Savings > Future Needs > Expenditure)
      const safeItems = [
        "e.g. Emergency Fund Contributions",
        "e.g. Retirement Savings (401(k), IRA, Superannuation)",
        "e.g. College/University Fund",
        "e.g. Home Down Payment Savings",
        "e.g. Large Purchase Savings (car, appliances, renovations)"
      ];
        
        //declare a state object this time instead of 3 state variables
        const [safeState, setSafeState] = useState({
          Data: new Array(safeItems.length).fill({ item: "", amount: 0, frequency: "", total: 0 }),
          Placeholders: [...safeItems],
          DropdownOpen: new Array(safeItems.length).fill(false),
        });

      //END STATE for SaFETable

      //START STATE VARIABLES for IFETable (Investment > Future Needs > Expenditure)
        const ifeItems = [
          "e.g. Stock Market Investments (shares, ETFs, mutual funds)",
          "e.g. Real Estate Investments (rental property, land)",
          "e.g. Cryptocurrency Investments (Bitcoin, Ethereum)",
          "e.g. Business Investments (startup capital, side business)",
          "e.g. Government or Corporate Bonds"
        ];
          
          //declare a state object this time instead of 3 state variables
          const [ifeState, setIfeState] = useState({
            Data: new Array(ifeItems.length).fill({ item: "", amount: 0, frequency: "", total: 0 }),
            Placeholders: [...ifeItems],
            DropdownOpen: new Array(ifeItems.length).fill(false),
          });

      //END STATE for IFETable

      //START STATE VARIABLES for GGETable (Giving > Giving > Expenditure)
        const ggeItems = [
          "e.g. Salvation Army",
          "e.g. Tithing",
          "e.g. Church Offerings",
          "e.g. Fred Hollows Foundation",
        ];
          
          //declare a state object this time instead of 3 state variables
          const [ggeState, setGgeState] = useState({
            Data: new Array(ggeItems.length).fill({ item: "", amount: 0, frequency: "", total: 0 }),
            Placeholders: [...ggeItems],
            DropdownOpen: new Array(ggeItems.length).fill(false),
          });

      //END STATE for GGETable

      //START STATE VARIABLES for DDETable (Debts > Debt Repayments > Expenditure)
        const ddeItems = [
          "e.g. Mortgage Repayments",
          "e.g. Credit Card Debt Payments",
          "e.g. Student Loan Repayments",
          "e.g. Car Loan Repayments",
          "e.g. Personal Loan Repayments",
          "e.g. Medical Debt Payments",
          "e.g. Business Loan Repayments"
        ];
          
          //declare a state object this time instead of 3 state variables
          const [ddeState, setDdeState] = useState({
            Data: new Array(ddeItems.length).fill({ item: "", amount: 0, frequency: "", total: 0 }),
            Placeholders: [...ddeItems],
            DropdownOpen: new Array(ddeItems.length).fill(false),
          });

      //END STATE for DDETable

      // function to render a unique set of tables depending on the collapse state
        function renderTables(key){

          // destructure the keys from the collapses state object. Recall that this function has access to the state
          // IE extract the keys from a JavaScript object and store them in an array
          const expKeysArray = Object.keys(expCollapses);
          const incKeysArray = Object.keys(incCollapses);

          //encapsulate 2 arrays of JSX snippets contained within <React.Fragment> elements
          const incTablesArray = [
            <React.Fragment>
              <SITable
                siState={siState}
                setSiState={setSiState}
              />
            </React.Fragment>,
            <React.Fragment>
              <BITable
                biState={biState}
                setBiState={setBiState}
              />
            </React.Fragment>,
            <React.Fragment>
              <OITable
                oiState={oiState}
                setOiState={setOiState}
              />
            </React.Fragment>
          ];

          const expTablesArray = [
            <React.Fragment>
              <RHETable
                rheState={rheState}
                setRheState={setRheState}
              />
              <hr />
              <BHETable
                bheState={bheState}
                setBheState={setBheState}
              />
            </React.Fragment>,
            <React.Fragment>
              <GLETable
                gleState={gleState}
                setGleState={setGleState}
              />
              <hr />
              <HLETable
                hleState={hleState}
                setHleState={setHleState}
              />
              <hr />
              <OLETable
                oleState={oleState}
                setOleState={setOleState}
              />
            </React.Fragment>,
            <React.Fragment>
              <VTETable
                vteState={vteState}
                setVteState={setVteState} // Optionally pass the setter if the child needs to update the state
              />
              <hr />
              <PTETable
                pteState={pteState}
                setPteState={setPteState}
              />
              <hr />
              <OTETable
                oteState={oteState}
                setOteState={setOteState}
              />
            </React.Fragment>,
            <React.Fragment>
              <SFETable
                sfeState={sfeState}
                setSfeState={setSfeState}
              />
              <hr />
              <PFETable
                pfeState={pfeState}
                setPfeState={setPfeState}
              />
              <hr />
              <CFETable
                cfeState={cfeState}
                setCfeState={setCfeState}
              />
            </React.Fragment>,
            <React.Fragment>
              <SLETable
                sleState={sleState}
                setSleState={setSleState}
              />
              <hr />
              <MLETable
                mleState={mleState}
                setMleState={setMleState}
              />
              <hr />
              <LLETable
                lleState={lleState}
                setLleState={setLleState}
              />
            </React.Fragment>,
            <React.Fragment>
              <SaFETable
                safeState={safeState}
                setSafeState={setSafeState}
              />
              <hr />
              <IFETable
                ifeState={ifeState}
                setIfeState={setIfeState}
              />
            </React.Fragment>,
            <React.Fragment>
              <GGETable
                ggeState={ggeState}
                setGgeState={setGgeState}
              />
            </React.Fragment>,
            <React.Fragment>
              <DDETable
                ddeState={ddeState}
                setDdeState={setDdeState}
              />
            </React.Fragment>,
          ];

   
          switch (key) {

            case incKeysArray[0]: //
              return incTablesArray[0];

            case incKeysArray[1]: //
              return incTablesArray[1];
            
            case incKeysArray[2]: //
              return incTablesArray[2];

            case expKeysArray[0]: // 
              return expTablesArray[0];

            case expKeysArray[1]: // 
              return expTablesArray[1];

            case expKeysArray[2]: // 
              return expTablesArray[2];
            
            case expKeysArray[3]: // 
              return expTablesArray[3];
            
            case expKeysArray[4]: // 
              return expTablesArray[4];
            
            case expKeysArray[5]: // 
              return expTablesArray[5];
            
            case expKeysArray[6]: // 
              return expTablesArray[6];
            
            case expKeysArray[7]: // 
              return expTablesArray[7];
          
            default:
              return null; // Handle unexpected keys gracefully   
          };
        };
      // END FUNCTION

      //START FUNCTION USED To prepare payload
      function preparePayloads(stateObj) {
        if (!stateObj || !stateObj.Data) return []; // Ensure it always returns an array
        return stateObj.Data.filter((row) => row.item && row.item.trim() !== "");
      }
      

      //window alert function
      function alertFunction() {
        alert("Data successfully saved to database!");
      }

      // END FUNCTION

      //START EVENT HANDLER for Save Data Button
      /* function runs when the user clicks the button to save their budget items. After displaying a window alert, it
      performs a HTTP POST request to the server endpoint and send the data in the req object body (as a JSON object) */
      const handleSave = async (e) => {
        //alertFunction();
        const url = 'http://localhost:3001/worksheet/save_items'
        e.preventDefault(); // Prevent default form submission behavior


        /* if (!userId) {
          console.error('User ID not found. Ensure the user is logged in.');
          return;
        } */

        try{

          // Prepare the data to send
          const payload = 
          {
            UserId: userId,
            Income: 
            {
              Standard:
              {
                StandardIncome: preparePayloads(siState)
              },
              Benefit:
              {
                BenefitIncome:preparePayloads(biState)
              },
              Other:
              {
                OtherIncome:preparePayloads(oiState)
              }
            },

            Expenditure: 
            {
              Home:
              {
                RentMortgage: preparePayloads(rheState),
                Bills:preparePayloads(bheState)
              },
              LivingCosts:
              {
                General:preparePayloads(gleState),
                Health:preparePayloads(hleState),
                Other:preparePayloads(oleState),
              },
              Travel:
              {
                Vehicle:preparePayloads(vteState),
                PublicTransport:preparePayloads(pteState),
                Other:preparePayloads(oteState),
              },
              FamilyPets:
              {
                SchoolCosts:preparePayloads(sfeState),
                PetCosts:preparePayloads(pfeState),
                Other:preparePayloads(cfeState),
              },
              Leisure:
              {
                Subscriptions:preparePayloads(sleState),
                Memberships:preparePayloads(mleState),
                Other:preparePayloads(lleState),
              },
              FutureNeeds:
              {
                Savings:preparePayloads(safeState),
                Investments:preparePayloads(ifeState)
              },
              Giving:
              {
                Giving:preparePayloads(ggeState),
              },
              DebtRepayments:
              {
                Debts:preparePayloads(ddeState)
              }
            }
          }
    
          //check the payload
          console.log('User Data Budget Items:',payload);
          setDataPayload(payload);
    
          // Perform the POST request
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json', // Set the content type to JSON
            },
            body: JSON.stringify(payload), // Convert the payload to JSON string
          });
    
          // Handle the server response
          if (response.ok) {
            const result = await response.json();
            console.log('Data saved successfully:', result);
            setIsDataSubmitted(true);
            setServerResponse(result);
            // Optionally, you can show a success message or clear the table
          } else {
            console.error('Server responded with an error:', response.status);
          }
    
        } catch(error){
          //console.error('Error uploading file', error);
        }
      }
      //END EVENT HANDLER
      
      //START HOOK to fetch and display a user's budget items which they previously entered
        
        useEffect(() => {
          //when this component mounts, a side-effect we need to perform is obtain the user's budget items data from the server
          // That is, if they have data there. So we need to check first. So we need a fetch()

          if (!userId) return; // ✅ Wait until userId is available before making the request

          const url = `http://localhost:3001/worksheet/retrieve_items?UserId=${userId}`; // ✅ Pass userId as a URL parameter

          //construct an object which maps the tertiary_category table column value to the respective setState function
          const tertiaryCategoryMapping = {
            //secondary cats in comments
            //Standard
            "StandardIncome": setSiState,
      
            //Benefit
            "BenefitIncome": setBiState,
      
            //Other
            "OtherIncome": setOiState,
      
            //Home
            "RentMortgage": setRheState,
            "Bills": setBheState,
      
            //LivingCosts
            "General": setGleState,
            "Health": setHleState,
            "OtherLivingCosts": setOleState,
      
            //Travel
            "Vehicle": setVteState,
            "PublicTransport": setPteState,
            "OtherTravel": setOteState,
      
            //FamilyPets
            "SchoolCosts": setSfeState,
            "PetCosts": setPfeState,
            "OtherFamilyPets": setCfeState,
            
            //Leisure
            "Subscriptions": setSleState,
            "Memberships": setMleState,
            "OtherLeisure": setLleState,
            
            //FutureNeeds
            "Savings": setSafeState,
            "Investment": setIfeState, 
            
            //Giving
            "Giving": setGgeState,
      
            //DebtRepayments
            "Debts": setDdeState
          };

          

          // Perform the GET request
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
              /* Let's first take a look at the JSON object coming back from the server in the event that it finds that 
              the user has some data: it will be an object with 2 level-one properties: Income and Expenditure,
              11 level-two properties, and 21 level-3 properties (see testfile.js for the structure). The only difference is
              that there will be an additional property in the object returned from the server: is_user_data. This property will
              store a bool value of true if there was data found in the table for said user.

              if this block runs it means the server has found the user has data in the table. In this case we need to iterate over 
              object down to the level-3 properties and extract the arrays of data from them, then use them to update the 
              corresponding state object (for the data to be rendered in each Table component) */
              if(data.IsUserData == true){ 

                //iterate over primary categories (level-1 keys)
                for(const primaryCategory in data){
                  if(primaryCategory === "IsUserData") continue; //skip this properties
                  /* select the value (an object) stored in the primaryCategory key of the data obj and assign it to the categories object */
                  const categories = data[primaryCategory]; //categories is an object which contains the level-2 properties only

                  for(const secondaryCategory in categories){
                    /* select the value (an object) stored in the secondaryCategory key of the categories obj and assign it to the teriaryCategories object */
                    const tertiaryCategories = categories[secondaryCategory]; //tertiaryCategories is an object which contains the level-3 properties only

                    for(const tertiaryCategory in tertiaryCategories){

                      //apply the mapping to find the right setState function
                      const setState = tertiaryCategoryMapping[tertiaryCategory];

                      /* selects the array stored in each level-3 property only. This is an array of objects in the form of:
                        { item: 'Salary', amount: 500, frequency: 'Weekly', total: 400}*/
                      const itemsArray = tertiaryCategories[tertiaryCategory];
                      
                      //check if the itemsArray is truthy (contains data)
                      if(Array.isArray(itemsArray) && itemsArray.length > 0){
                        //update respective state object properties
                        setState((prevState) => ({
                          ...prevState, // Preserve other properties of the state
                          Data: [...itemsArray, { item: "", amount: 0, frequency: "", total: 0 }] // ✅ Append new empty object
                        }));
                      }
                    }
                  }
                }
              }
            })
            .catch(error => {
              console.error("Error:", error);
            });
        }, [userId]);// I might need to add userId as a dependency here to deal with the scenario where the component mounts before 
        // userId has been fetched from local storage and updated. 

      //END HOOK

    
      
      

    if(isDataSubmitted){
      return(
        <SubWrapper>
          <StyledContainer>
            <SubmittedDataTable payload={dataPayload}/>
          </StyledContainer>
        </SubWrapper>
      )
    } else{
      return (
        <SubWrapper>
          <StyledContainer>
            <LargeText> 
            Please enter in how much you currently earn/spend by selecting a category from those below,
            which expands a form. If you have an item of income/expenditure in a certain category but are unsure of the amount, 
            you can enter in the name of the item but leave the 'amount' field empty. Then when you have completed the Tool activity, we will have some data
            you can use to set this value more precisely. When you have finished entering in your data, click the "Save Items" button
            at the bottom of the page to save your items to the database.
            </LargeText>
            <Nav tabs>
              <NavItem>
                <StyledNavLink
                  className={activeTab === "1" ? "active" : ""}
                  onClick={() => toggleTab("1")}
                >
                  Income
                </StyledNavLink>
              </NavItem>
              <NavItem>
                <StyledNavLink
                  className={activeTab === "2" ? "active" : ""}
                  onClick={() => toggleTab("2")}
                >
                  Expenditure
                </StyledNavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
                {
                  Object.entries(incCollapses).map(([key]) => {
                    // Explicitly return the JSX for each key
                    return (
                      <TabPane key={key} tabId="1" style={{ backgroundColor: 'white' }}>
                        <StyledButton onClick={() => handleIncCollapse(key)}>
                          {key}
                        </StyledButton>
                        <Collapse isOpen={incCollapses[key]} style={{ padding: '0 20px' }}>
                          {/* Render tables here */}
                          {renderTables(key)}
                        </Collapse>
                      </TabPane>
                    );
                  })
                }
              {/* Iterate through the collapses state objects and return a unique set of JSX 
                Object.entries() converts the collapses state object into an array of key-value pairs.
              */}
              {
                Object.entries(expCollapses).map(([key]) => {
                  // Explicitly return the JSX for each key
                  return (
                    <TabPane key={key} tabId="2" style={{ backgroundColor: 'white' }}>
                      <StyledButton onClick={() => handleExpCollapse(key)}>
                        {key}
                      </StyledButton>
                      <Collapse isOpen={expCollapses[key]} style={{ padding: '0 20px' }}>
                        {/* Render tables here */}
                        {renderTables(key)}
                      </Collapse>
                    </TabPane>
                  );
                })
              }
            </TabContent>
            <SaveButton onClick={handleSave}>Save Data</SaveButton>
          </StyledContainer>
        </SubWrapper>
      );
    }
  }

  const LargeText = styled.p`
    font-size: 1.2rem; // Standard font size
    line-height: 1.5; // Standard line height
    font-weight: normal; // Normal font weight
    color: #333; // Standard text color
    margin: 1rem 0; // Standard margin
    text-align: left;
  `;


  const StyledButton = styled(Button)`
    background-color: #17a2b8; /* Bootstrap 'info' color */
    color: white; /* Text color */
    font-size: 20px; /* Prominent text */
    padding: 15px 30px; /* Maintain large clickable area */
    border-radius: 5px; /* Rounded corners */
    border: none; /* Cleaner look */
    margin: 2rem 0 1rem 0; /* No margin on left/right, only vertical spacing */
    width: 100%; /* Full width of container */
    display: block; /* Ensures the button takes up the full width of its container */
    cursor: pointer; /* Show hand cursor on hover */
    text-align: left; /* Left-align the text */
    &:hover {
      background-color: #138496; /* Darker shade of 'info' on hover */
      color: white; /* Ensure text remains visible */
    }
    &:active {
      background-color: #117a8b; /* Darker shade when clicked */
    }
  `;

  const SaveButton = styled(Button)`
    background-color: #007bff; /* Bootstrap 'primary' color */
    color: white; /* Text color */
    font-size: 20px; /* Prominent text */
    padding: 15px 30px; /* Maintain large clickable area */
    border-radius: 5px; /* Rounded corners */
    border: none; /* Cleaner look */
    margin: 2rem 0 1rem 0; /* No margin on left/right, only vertical spacing */
    width: 100%; /* Full width of container */
    display: block; /* Ensures the button takes up the full width of its container */
    cursor: pointer; /* Show hand cursor on hover */
    text-align: left; /* Left-align the text */
    &:hover {
      background-color: #0056b3; /* Darker shade of primary on hover */
      color: white; /* Ensure text remains visible */
    }
    &:active {
      background-color: #004085; /* Even darker shade when clicked */
    }
  `;


  
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
  