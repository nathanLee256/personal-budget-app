import React from 'react';
import { useState, useEffect, useRef } from 'react';
import {
    Button,
    collapse,
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
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
    Collapse,
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

    //START state variable to store the user's donations (array of gift objects) returned from the server
        //initialise as an object with 12 properties (months), each storing an array of giftObjects
        // whenever page loads (or user toggles a different folder tab), userGifts for that year is retrieved 
        // and stores the user's gifts for that year 
        const [userGifts, setUserGifts] = useState({
            January: [],
            February: [],
            March: [],
            April: [],
            May: [],
            June: [],
            July: [],
            August: [],
            September: [],
            October: [],
            November: [],
            December: []
        });

        //gift objects are in the following form (this is the JSON returned from the server in the gifts/retrieve_gift_items route):
        /* 
            {
                "id": 1,
                "giftType": "Charitable Donation",
                "organisation": 2384,
                "amount": "50.00",
                "date": "2025-06-29T14:00:00.000Z",
                "description": "red shield",
                "receipt": null,
                "dgr": 1
            }, 
        */
    //END state

    //START Collapse state and toggler function

        //state variable which stores the isOpen state (true/false) of the Collapse
        const [addgiftCollapse, setAddgiftCollapse] = useState(false);

        //toggler function which runs when user clicks Collapse button and reverses the isOPen state of the Collapse
        const collapseToggle = () => setAddgiftCollapse(!addgiftCollapse);

        //state object to store the state (open/closed) of 12 Collapse elements (1 for each month)
        const[monthCollapses, setMonthCollapses] = useState({
            January: false,     //initialise each collapse to false (closed)
            February: false,
            March: false,
            April: false,
            May: false,
            June: false,
            July: false,
            August: false,
            September: false,
            October: false,
            November: false,
            December: false
        });

        //event handler function runs when the user clicks a specific Collpase element. When they do, an string value is passed to the 
        //function which corresponds to the property in the collapses object which stores the open/closed state for that element
        // The result is that only the targeted Collapse element's state is updated, while the other properties remain unchanged
        const handleMonthCollapse = (key) => {
            setMonthCollapses((prev) => ({ // prev is the current state object before the update
                ...prev,                // the spread operator copies the current state object properties, and then..
                [key]: !prev[key],      // Updates the specified key
            }));
        };


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

    //START state variable and toggler function for the modal which displays to confirm the submission of a new item
        //stores the state of the modal (open/closed)
        const[confirmNewgiftModal, setConfirmNewgiftModal] = useState(false);

        //function which opens/closes modal (by reversing the modal state)
        const modalToggle = () => {
            setConfirmNewgiftModal((prevState) => !prevState);
        };
        
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
                                {"entityName": "Salvation Army", "abn": 1234567, "orgId": 1},
                                {"entityName": "Red Cross", "abn": 2345678, "orgId": 2}
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
                org?.entityName.toLowerCase().includes(inputValue)
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
                organisation: suggestion
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
        /* 
            0-It receives the file object (event.target.files[0]), and 1-sends it to the server in a POST request.
            The server stores the file in its /uploads folder, and then returns the url path of the saved file.
            2-The url path then is used to update the userSelections.file
        */

        //START reference variable to store the file <input> element in the DOM
            const fileInputRef = useRef(null);

        //END reference
        const handleFileChange = async (event) => {

            //0- extract the file obj (the user selected file) from the DOM, store it in formData object
            const selectedFile = event.target.files[0];
            const formData = new FormData();
            formData.append("receipt", selectedFile);

            //1- send to server 
            const url = 'http://localhost:3001/gifts/upload_receipt';

            
            try{
                const uploadResponse = await fetch(url,{
                    method: "POST",
                    body: formData,
                })

                if (!uploadResponse.ok) {
                    console.error(`Server error: ${uploadResponse.status}`);
                    return;
                }

                const { fileUrl } = await uploadResponse.json();

                //2-update userSelections.receipt with the url
                if (fileUrl) {
                    setUserSelections((prevState) => ({
                        ...prevState,
                        receipt: fileUrl,
                    }));
                } else {
                    console.error("Upload succeeded but no fileUrl returned!");
                }

            }catch(error){
                console.error('Fetch error to the upload_receipt route:', error);
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
            //update a selectedYear state variable here also
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

    

    //START state object to store user selections: will be used to append new object to userGifts when user has entered all data
        const [userSelections, setUserSelections] = useState({
            giftType: "",
            organisation: null, //will store an {organisation} object with entityName, abn, and orgId properties
            amount: 0,
            date:"",    //e.g. "2025-06-27"
            description: "",
            receipt: "",   // will store the url string where the file is stored on server
        });

        //handler which runs when user enters a value in the 'amount' column <InputGrouptext> field
        const handleAmountChange = (val) => {
            const numeric = Number(val); // convert the string input to a number (e.g. "10" → 10)
            setUserSelections((prevState) => ({
                ...prevState,
                amount: isNaN(numeric) ? null : numeric
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

        //handler which runs when user enters a description in the 'description' column of bottom table
        const handleDescriptionChange = (text) => {
            setUserSelections((prevState) => ({
                ...prevState,
                description: text
            }));

        }

        //handler which runs when the user has clicked the 'Submit New Gift' Button (after entering new gift details)
        const handleSubmit = async () => {

            const url = 'http://localhost:3001/gifts/update_gift_items';

            //here we need to send the current userSelections data a POST request to the server
            //construct a payload
            const payload = {
                UserId: userId,
                NewGift: userSelections
            };

            //check the payload
            console.log('Update route payload:',payload);

            //perform the POST
            try{
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
                    const updatedData = await response.json();
                    console.log('Database updated successfully:', updatedData);
                    
                    //update userGifts
                    setUserGifts(updatedData);

                } else {
                    console.error('Server responded with an error:', response.status);
                }

            }catch(error){
                console.error('Fetch error:', error);
            }finally{ //contains code which runs after Promise has either resolved (try runs), or rejected (catch runs)

                //reset state
                setUserSelections({
                    giftType: "",
                    organisation: null,
                    amount: 0,
                    date: "",
                    description: "",
                    receipt: "",
                });

                //also reset orgValue
                setOrgValue('');

                //reset the file input ref variable
                if (fileInputRef.current) {
                    fileInputRef.current.value = null;
                }
            }
        };

        //function which assigns a bool value to the disabled prop of the 'Submit New Gift' Button (to enable/disable it)
        const shouldDisableSubmit = () => {
            const { giftType, organisation, amount, date, description, receipt } = userSelections;
            console.log("userSelections:",userSelections);

            if (
                giftType === "" ||
                !organisation || !organisation.entityName ||
                typeof amount !== "number" || isNaN(amount) || amount === 0 ||
                date === "" ||
                description.trim() === "" ||
                receipt === ""
            ) {
                return true; // disable the button
            }

            return false; // enable the button
        };


    //END state

    //START event handlers
        
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

        //event handler for the 'delete' buttons in the final column of top table
        /* 
            function does 2 things: 1- removes the selected giftObj from the userGifts array. 2- perform a HTTP DELETE request
            to the server route, which deletes a row of data from the gift_items table (it doesn't return the updated table).
        */
        const handleDelete = async (rowIndex, giftID, mnth) => {
            //this function is called like this from renderTableRows JSX: handleDelete(index, giftObj.id, month)
            // params: rowIndex represents the index of the selected gift object in the userGifts[month] array
            // giftID represents the gift.id int value of that gift object
            // mnth represents the active month (the current month param in the renderTableRows())
            
            // 2. Send DELETE request to server
            const url = `http://localhost:3001/gifts/delete_gift/${giftID}`;

            try {
                const deleteResponse = await fetch(url, {
                    method: "DELETE",
                });

                // Handle the server response
                if (deleteResponse.ok) {
                    const responseString = await deleteResponse.json();
                    console.log(responseString);

                    // 1 update userGifts and top table rendering only after successful deletion to ensure userGifts reflects db
                    setUserGifts((prevState) => {
                        const updatedArr = prevState[mnth].filter((_, i) => i !== rowIndex);

                        return {
                            ...prevState,
                            [mnth]: updatedArr
                        }
                        
                    });
                    
                } else {
                    throw new Error(`Server responded with ${deleteResponse.status}`); // ✅ fix: was 'response.status'
                };

            } catch (error) {
                console.error('Fetch error to the delete_gift route:', error);
                // Optional: revert UI change if delete fails
            };
        };

    //END handlers


    //START hook to perform fetch request to server to obtain user gifts for selected period
        useEffect(() => {

            //perform a fetch request to the server to obtain all of the donations the user has made in the selected year
            if (!userId) return; // ✅ Wait until userId is available before making the request

            //next obtain the selected year state (from the current activeTab state which represents a folder tab) 
            let selectedYear = 0;
            let tab = activeTab;
            const currentYear = new Date().getFullYear();

            switch(tab) {
                case 0:
                    // in this case user has selected the current year folder tab
                    selectedYear = currentYear;
                    break;
                case 1:
                    // current year -1
                    selectedYear = currentYear - 1;
                    break;
                case 2:
                    // current year -2
                    selectedYear = currentYear - 2;
                    break;
                case 3:
                    // current year -3
                    selectedYear = currentYear - 3;
                    break;
                case 4:
                    // current year -4
                    selectedYear = currentYear - 4;
                    break;
                default:
                    // default code block
            }

            //perform fetch request (HTTP-GET) to the server route, send it the userId and selectedYear
            const url = `http://localhost:3001/gifts/retrieve_gift_items?UserId=${userId}&Year=${selectedYear}`;
            
            fetch(url, {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                },
            })

            // set up the Promise chain
            //first check the res.ok property 
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })

            //if this runs it means we have received a 200 OK response and the Promise has resolved to the JSON returned from the server
            .then(data => {
                //filter the array of objects, assigning objects to the correct property (month) of the userGifts object
                // Prepare grouped gifts
                const grouped = {
                    January: [],
                    February: [],
                    March: [],
                    April: [],
                    May: [],
                    June: [],
                    July: [],
                    August: [],
                    September: [],
                    October: [],
                    November: [],
                    December: []
                };

                // extract the month of the gift, and assign it to the temp object (into the correct month property)  
                data.forEach((gift) => {
                    const date = new Date(gift.date);
                    const month = date.getUTCMonth(); // 0–11

                    const monthName = Object.keys(grouped)[month];
                    grouped[monthName].push(gift);
                });

                // Set all grouped data at once (overwrite the state object with the temp object)
                setUserGifts(grouped);
            })
            .catch(error => {
                console.error("Error:", error);
            });

        }, [activeTab, userId]);     //runs once when the component mounts (activeTab == currentYear), and then everytime user toggles another tab


    //END hook

    

    //START helper functions to render the JSX for the table headers/rows

        //function which returns the JSX representing the table headers
        const renderTableHeaders = (position) => {

            /* This function returns a different set of JSX depending on the position param (e.g. "top", or "bottom") */
        
            const totalColumns = 6;
            
            const rowArray = new Array(5).fill(""); // Initialize an array to define 5 table columns with strings
            rowArray[0] = "Gift Type";
            rowArray[1] = "Organisation";
            rowArray[2] = "Amount";
            rowArray[3] = "Date";
            rowArray[4] = "Description";
            rowArray[totalColumns - 1] = "Receipt";

            // Define widths for each column
            const columnWidthsBottom = ["15%", "20%", "10%", "15%", "25%","15%"];
            const columnWidthsTop = ["5%","15%", "10%", "10%", "15%", "15%","10%", "10%", "10%"];

            if(position === "top"){
                //if T it means userGifts is truthy and we need to render historical gifts for selectedYear
                // which means we need to render an additional column for the top table
                return (
                    <thead>
                        <tr>
                            {/* render an id column for the top table */}
                            <th style={{ width: columnWidthsTop[0]}}>Gift ID</th>
                            {rowArray.map((val, index) => (
                                <th key={index} style={{ width: columnWidthsTop[index]}}>{ val }</th>
                            ))}
                            {/* render an additional column for the top */}
                            <th key={totalColumns} style={{ width: columnWidthsTop[totalColumns]}}>Tax Deductable</th>
                            {/* also render a column for a delete button */}
                            <th style={{ width: columnWidthsTop[8]}}>Delete</th>
                        </tr>
                    </thead>
                );

            }else{
                //runs when position !== "top", in which case we render only 6 column headers to be displayed in bottom table
                return (
                    <thead>
                        <tr>
                            {rowArray.map((val, index) => (
                                <th key={index} style={{ width: columnWidthsBottom[index]}}>{ val }</th>
                            ))}
                            
                        </tr>
                    </thead>
                );
            } 
        };

        //function which returns the JSX representing the table rows
        const renderTableRows = (position, month) => { 

            if(position === "top"){
                //if this evals as T it means the collapse is not open in which case we just need to render the JSX above button
                //iterate (map) over the userGifts array and display each object in the array in a single table row
                return(
                    <tbody>
                        {
                            userGifts[month].map((giftObj, index) => (
                                <tr key={giftObj.id}>
                                    <td>
                                        {/* Column 0 displays gift id */}
                                        {giftObj.id}
                                    </td>
                                    <td>
                                        {/* Column 1 displays giftType */}
                                        {giftObj.giftType}
                                    </td>
                                    <td>
                                        {/* Column 2 displays organisation*/}
                                        {giftObj.organisation}
                                    </td>
                                    <td>
                                        {/* Column 3 displays amount*/}
                                        {giftObj.amount}
                                    </td>
                                    <td>
                                        {/* Column 4 displays date*/}
                                        {giftObj.date}
                                    </td>
                                    <td>
                                        {/* Column 5 displays description*/}
                                        {giftObj.description}
                                    </td>
                                    <td>
                                        {/* Column 6 displays receipt*/}
                                        {giftObj.receipt}
                                    </td>
                                    <td>
                                        {/* Column 7 displays tax*/}
                                        {   giftObj.dgr === 1 ? "Yes": "No" }
                                    </td>
                                    <td>
                                        {/* Render a Delete Button */}
                                        <Button  key={giftObj.id} color="danger" onClick={() => handleDelete(index, giftObj.id, month)}>-delete item</Button>
                                    </td>
                                    
                                </tr>
                            ))
                        }
                    </tbody>
                    
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
                                    ref={fileInputRef}
                                />
                                {/* display a message when file has been selected */}
                                {userSelections.receipt && (
                                    <p style={{ fontSize: '0.8rem', marginTop: '5px' }}>
                                        Selected file: {userSelections.receipt}
                                    </p>
                                )}
                            </td>
                            
                        </tr>
                    </tbody>
                    
                );
            }
               
        };

        //function which returns the JSX contained within Collapse components
        const renderCollapseContent = (mnthIndex, yrIndex) => { 
            //NB: yrIndex represents folder tab label index e.g. [2025, 2024, 2023, 2022, 2021]
            // mnthIndex represents month index e.g. ["January", "February", "March", ...]

            //extract the month using the mnthIndex
            const activeMonth = Object.keys(userGifts)[mnthIndex];

            //now we are ready to return JSX: render the historical gifts (table headers and data rows) if userGifts is truthy
            return(
                <>
                    {
                        Array.isArray(userGifts[activeMonth]) && userGifts[activeMonth].length > 0 ? 
                        <>
                            <StyledTable>
                                {renderTableHeaders("top")}
                                {renderTableRows("top", activeMonth)}
                            </StyledTable>
                        </> : 
                        <>
                            <p>No gifts for selected period</p>
                        </>
                    }
                    {/* render the prompt to enter new gift for the 2025 folder tab */}
                    { 
                        yrIndex === 0 ? 
                        <>
                            <h3>New Gift</h3>
                            <p>Enter gift details below:</p>
                            <StyledTable>
                                {renderTableHeaders("bottom")}
                                {renderTableRows("bottom", activeMonth)}
                            </StyledTable>
                            <Button 
                                color="primary" 
                                size='lg'
                                disabled={shouldDisableSubmit()} // clear and accurate
                                onClick={()=> modalToggle()}
                            >
                                Submit New Gift
                            </Button>
                        </> : 
                        <></> 
                    }   
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
                                {/* Add Collapse buttons and Collapse content here */}
                                {
                                    /* Collapse Button */
                                    Object.keys(monthCollapses).map((month, monthIndex) => (
                                        <React.Fragment key={month}>
                                            <CollapseButton onClick={() => handleMonthCollapse(month)}>
                                                {month}
                                            </CollapseButton>
                                            <Collapse isOpen={monthCollapses[month]}>
                                                {monthCollapses[month] && renderCollapseContent(monthIndex, index)}
                                            </Collapse>
                                        </React.Fragment>
                                    ))

                                }      
                            </TabPane> 
                        ))
                    }
                </TabContent>
                {/* Modal JSX */}
                <div>
                    <Modal isOpen={confirmNewgiftModal} toggle={modalToggle}>
                        <ModalHeader toggle={modalToggle}>Confirm New Gift?</ModalHeader>
                        <ModalBody>
                            <p>Are you sure you want to add this new gift/donation?</p>

                            <br/>
                            <div>
                                <em>gift type: </em>{userSelections.giftType}
                            </div>
                            <div>
                                <em>Organisation:</em> {userSelections.organisation?.entityName || "—"}
                            </div>
                            {
                                Object.entries(userSelections).map(([key, val], index) => {
                                    const TWO = 2;
                                    if(index < TWO) return null; //skip the first 2 object properties

                                    return(
                                        <div key={key}>
                                            <em>{key}: </em> {val instanceof File ? val.name : String(val)}
                                        </div>
                                    )
                                })
                            }
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="success"
                                onClick={() => {

                                    //first cache the current userSelections state
                                    //cachedUserSelections.current = userSelections;

                                    handleSubmit(); // 🔄 Start async in background

                                    //close modal
                                    modalToggle();

                                }}
                            >
                                Confirm
                            </Button>
                            <Button color="danger" onClick={()=> {
                                //close modal but don't reset state
                                modalToggle();
                            }}>
                                Cancel
                            </Button>
                        </ModalFooter>

                    </Modal>
                </div>
            </StyledContainer>
        </SubWrapper>
    );
};

//styles

//specifies the styling of the Month Collapse Buttons
const CollapseButton = styled(Button)`
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


