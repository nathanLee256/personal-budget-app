import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Modal, ModalBody, ModalHeader,ModalFooter, UncontrolledCollapse, Input, Form, Row, Label, Col, Button, Table, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import MyAppFooter from '../components/MyAppFooter.js';
import { useAuth } from '../components/AuthContext.js';
import PortalSubmenu from '../components/PortalSubmenu.js';
import SelectFile from '../components/SelectFile.js';
import AddItemForm from '../components/AddItemForm.js';
import CustomDropdown from '../components/CustomDropdown.js';


/*  
    This page calls renders the SelectFile component JSX or its own JSX depending on whether the userData state
    array is truthy. If it is, it means the user has successfully uploaded a .csv file containing their bank
    transactions for the selected period. This is stored in userData, and rendered to the user within a table.
    Each row of data in the table represents one transaction and the user is prompted to categorise said 
    transaction (select Primary cat > Secondary cat > tertiary cat > Item) using a dropdown menu which appears
    in the final column in each row of the table. The dropdown menu appears when toggled, which prompts the user
    to select a tertiary category (clickable elements) in the main dropdown. When they do, the submenu (PortalSubmenu)
    appears (above the DOM) in the specified position and it displays the user's budget items they have previously
    defined for the selected tertiary category. When they select an item, it displays in the Toggle of that row.
    The user can also select 'Add Item' from the submenu, which when clicked renders an input field to the user
    at the bottom of the submenu. The user can then type in the new item here. After the user has made a selection 
    from each row in the table, they will be able to click the "Save Data" button which triggers a POST request
    that constructs a payload and saves the user's data to the database.

*/
export default function ImportData() {

  // destructure global state variables
  const { userId, setUserId } = useAuth();
  const { budgetItems, setBudgetItems } = useAuth();

  //START DEFINE State variables for <SelectFile/>
    const [userData, setUserData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedWeek, setSelectedWeek] = useState("");
    const [file, setFile] = useState(null);
   
  // END DEFINE

  //START cache variables 

    //reference variable to store the latest value(state) of the submenu (activeSubmenu obj)
    const activeSubmenuRef = useRef(null);

  //END cache variables

  //START DEFINE State variables for this


    /*  
      an array initialised as strings which will be displayed in the Toggle of the last column in each table row
      when the user selects an item, the row index string in the array will be updated to an object in the form:
      {
        item: budgItem.item,
        cat: itemObj.type,
        secondaryCat: itemObj.secondary,
        tertiaryCat: itemObj.tertiary,
      }
      The obj.item string will then be displayed in the toggle, whenever the state is updated.
    */
    const [selectedItems, setSelectedItems] = useState(userData && userData.length > 0 ? userData.map(() => "Select") : []);

    // state variable to enable/disable Save Data Button
    const [isSubmitReady, setIsSubmitReady] = useState(false);

    //state variable to store the user-entered new budgetItem
    const [newItem, setNewItem] = useState("");

    //state variable which stores the state (open/closed) of the new modal (confirm/cancel add item)
    const [modal, setModal] = useState(false);

    //we also need to add an event handler which reverses the current value of the modal state
    const modalToggle = () => setModal((prevState) =>(!prevState));
  

    //state to conditionally render Input form in submenu when user chooses to add a new budget/tax item
    const [addBItem, setAddBItem] = useState(false);
    const [addTItem, setAddTItem] = useState(false);


    /*  this is a state object which will be used to store the position to render the submenu when the user clicks a tert link
        It also contains properties which will be used to access the user's array of budget items for each 
        tertiary category. 

        -It stores the position (top, left) where the submenu should be rendered.
        -It also holds category-related properties needed to retrieve the correct list of budget items for that submenu.
        
        This is the structure of the object:

        {
          type: "",         // or "Expenditure" (indicates whether it's an income or expenditure category)
          secondary:"",     // Stores the secondary category which corresponds to a budgetItems attribute (e.g."Home")
          tertiary: "",     // Stores the tertiary category which corresponds to a budgetItems attribute (e.g., "RentMortgage")
          top: null,        // Y-coordinate for submenu positioning
          left: null        // X-coordinate for submenu positioning
        }
    */ 
    const [activeSubmenu, setActiveSubmenu] = useState(null);
  //END DEFINE

  //START CONSTANTS 
    // use this map only in the JSX becuase the keys correspond to the budgetItems keys
    const objMap = {
      "Income": {
        "Standard": {
          Prop: "Standard",
          "Standard Income": "StandardIncome",
        },
        "Benefit": {
          Prop: "Benefit",
          "Benefit Income": "BenefitIncome"
        },
        "Other": {
          Prop: "Other",
          "Other Income": "OtherIncome"
        },
      },
      "Expenditure": {
        "Home": {
          Prop: "Home",
          "Rent Mortgage": "RentMortgage",
          "Bills" : "Bills"
        },
        "Living Costs": {
          Prop: "LivingCosts",
          "General": "General",
          "Health": "Health",
          "Other Living Costs": "OtherLivingCosts"
        },
        "Travel": {
          Prop: "Travel",
          "Vehicle": "Vehicle",
          "Public Transport": "PublicTransport",
          "Other Travel": "OtherTravel"
        },
        "Family Pets": {
          Prop: "FamilyPets",
          "School Costs": "SchoolCosts",
          "Pet Costs": "PetCosts",
          "Other Family Pets": "OtherFamilyPets"
        },
        "Leisure":{
          Prop: "Leisure",
          "Subscriptions": "Subscriptions",
          "Memberships": "Memberships",
          "Other Leisure": "OtherLeisure"
        },
        "Future Needs": {
          Prop: "FutureNeeds",
          "Savings": "Savings",
          "Investment": "Investment"
        },
        "Giving": {
          Prop: "Giving",
          "Giving": "Giving"
        },
        "Debt Repayments": {
          Prop: "DebtRepayments",
          "Debts": "Debts"
        }
      }
    };

    
  //END CONSTANTS

  //START EVENT HANDLERS

    /* 
      areAllCategoriesSelected() assigns a bool value to the disabled attribute of the Save Data button and is therefore called whenever the page reloads due to a state update 
      (any state including selectedItems). Recall that once the user has uploaded a .csv file, selectedItems[] will become an array of strings (either "Select", or it will be 
      an object in the following form, after the user has selected a budgetItem category):

      {
        "item": "Salary",
        "amount": 365,
        "frequency": "annually",
        "total": 28.08
      } 
    */
    function areAllCategoriesSelected(selectedItems) {
      if (!Array.isArray(selectedItems) || selectedItems.length === 0) {
        return false; // function does not run the .every line below until selectedItems has been updated (by useEffect) to an array of "Select" strings the same length as userData
      }
      return selectedItems.every(item => typeof item === 'object' && item !== null); // if every returns T, function returns T which should enable button
    }

    // runs every time user adds a budget item
    function handleItemAdd(activeObj){

      console.log("✅ User confirmed. Proceeding...");

      //construct the obj to add
      const newObj = {
        item: newItem,
        amount: 0,
        frequency: "",
        total: 0
      };

      //push it onto the correct property of budgetItems
      // the callback is returning an object which updates the budgetItems state (overwrites it)
      setBudgetItems((prevState) => ({ // use curly braces
        ...prevState,   //preserve all the other obj properties
        [activeObj.type]: { //e.g. Income
          ...prevState[activeObj.type], 
          [activeObj.secondary] : {    //e.g. Standard
            ...prevState[activeObj.type][activeObj.secondary],
            [activeObj.tertiary] : [
              ...prevState[activeObj.type][activeObj.secondary][activeObj.tertiary],
              newObj
            ]
          }
        }
      }));

    };

    function handleTaxItemAdd(activeObj){
      console.log("handleTaxItemAdd() function is running!");
    }

    
    //handler for the Save Data button at the bottom of page
    const handleDataSubmit = async (e) => {
      //TBA
    };


    /*  
      when the user selects an item, we need to update the selectedItems state array at the right index. 
      itemObj is the activeMenu obj, budgItem is the selected budgetItem in the form of
      {
        "item": "Salary",
        "amount": 365,
        "frequency": "annually",
        "total": 28.08
      }
    */                        //e.g. {activeSubmenu}, {item: "Salary", amount: 500, frequency: "Weekly", total: 2000}
    function handleItemSelect(itemObj, budgItem) {

      console.log("handleItemSelect called with:", itemObj, budgItem);//check to see if function is being called

      let dataObj = {
        item: budgItem.item,
        cat: itemObj.type,
        secondaryCat: itemObj.secondary,
        tertiaryCat: itemObj.tertiary,
      };
    
      setSelectedItems((prev) => {
        const updatedItems = prev.map((item, i) => (i === itemObj.index ? dataObj : item));
        
        console.log("Updated selectedItems:", updatedItems);
        return updatedItems;
      });
      //call the areAllCategoriesSelected() to check if all user has made a selection in each table row

      
    };

    //event handler for the tertiary category links in the custom dropdown
    /* 
      NB: This function works (when the previous iteration didn't) because We only update the state once, depending on 
      whether the same submenu is already open. Before, we were calling setActiveSubmenu() twice in quick succession 
      (once to close, once to reopen), which caused React to batch the updates — sometimes re-opening the 
      submenu immediately
    */
    function initialiseSubmenu(pCat, sCat, tCat, rowIndex, event) {
      const rect = event.currentTarget.getBoundingClientRect();

      //access the latest version of the submenu state
      const latestVal = activeSubmenuRef.current;

      const modScat = objMap[pCat][sCat].Prop;
      const modTcat = objMap[pCat][sCat][tCat];

      // Generate a unique ID for this submenu
      const subId = `${pCat}-${sCat}-${tCat}-${rowIndex}`;

      if(!latestVal){
        //if true it means that no submenu is currently open because activeSubmenu === null
        //in which case we need to open the right one using the parameters

        //slightly delay the initialisation 
        setTimeout(() => {
          setActiveSubmenu({
            id: subId,
            type: pCat,
            secondary: modScat,
            tertiary: modTcat,
            top: rect.top + window.scrollY,
            left: rect.right + window.scrollX,
            index: rowIndex,
          });
        }, 0)

        return;
        
      } else{
        //  if true it means that a submenu is open at the time of the user click
        // in which case we need to check if the user has re-clicked the same item
        // in which case it needs to be closed
        // If this exact submenu is already open, close it
        if (activeSubmenuRef.current?.id === subId) {
          setActiveSubmenu(null);
          return;

        } else{
          setTimeout(() => {
            setActiveSubmenu({
              id: subId,
              type: pCat,
              secondary: modScat,
              tertiary: modTcat,
              top: rect.top + window.scrollY,
              left: rect.right + window.scrollX,
              index: rowIndex,
            });
          }, 0)

        }

      }
    }
  
  //END EVENT handlers

  //START useEffect Hooks

    // useEffect to update the selectedItems array when userData changes
    useEffect(() => {
      if (Array.isArray(userData) && userData.length > 0) {
        setSelectedItems(userData.map(() => "Select Item"));
      }
    }, [userData]);

    //retrieve budgetItems immediately after the component renders (as soon as it is updated in AuthProvider)
    useEffect(() => {
      if (!budgetItems || Object.keys(budgetItems).length === 0) return; // ✅ Prevents running when budgetItems is empty
      console.log("Budget Items Object:", budgetItems);
    
    }, [budgetItems]);

    /* hook to cache the latest value of the submenu state everytime it changes */
    useEffect(() => {
      activeSubmenuRef.current = activeSubmenu;

    }, [activeSubmenu]);
    
  //END hooks

  //START HELPER functions which are called from the main JSX return statement, to render some JSX within the main JSX

    //renders the Table headers
    const renderTableHeaders = () => {
      const ONE = 1;
      if (userData.length === 0) return null;
      const totalColumns = (Object.keys(userData[0]).length) - ONE;
      const rowArray = new Array(totalColumns).fill("");
      rowArray[0] = "Details";
      rowArray[totalColumns] = "Budget Item";
      return (
        <thead>
          <tr>
            {rowArray.map((val, index) => (
              <th
                key={index}
                style={
                  index === rowArray.length - 1
                    ? { width: "20%" } // ✅ Fixed width for last column
                    : undefined        // Let others size naturally
                }
              >
                {val}
              </th>
            ))}
          </tr>
        </thead>
      );
    };

    /* JSX-returning function which renders the clickable elements (tertiary categories) in the table */
    const renderDDlinks = (primaryCat, rIndex) => (
      <> 
        {Object.keys(objMap[primaryCat]).map((secondaryCat, index) => (
          <StyledRows key={secondaryCat} index={index}>
            <StyledSecondaryCatHeader> {/* <DropdownItem> */}
              {secondaryCat}
              {/* Render tertiary cats under each of their sec cat (as clickable divs to trigger PortalSubmenu) */}
              {Object.keys(objMap[primaryCat][secondaryCat])
                .filter(key => key !== "Prop")
                .map((tertCat) => (
                  <StyledTertCatItem key={tertCat} onMouseDown={(e) => {initialiseSubmenu(primaryCat,secondaryCat,tertCat, rIndex, e)}}>
                    {tertCat} ▶
                  </StyledTertCatItem>
              ))}
            </StyledSecondaryCatHeader>
          </StyledRows>
        ))}
      </>
    );

    // renders the table rows
    const renderTableRows = () => (
      <tbody>
        {userData.map((transObj, rowIndex) => (
          <tr key={transObj.id}>
            {Object.entries(transObj)
              .filter(([key]) => key !== "id") // yields: [["header_1", "24/12/24"], ["header_2", 606.53], ["header_3", "SALARY Coles" ], ...]
              .map(([__, value], colIndex) => (           //index 0 tuple,            index 1 tuple         index 2 tuple
              <td key={colIndex}>{value}</td>
            ))}
            {/* Dropdown for "Category" */}
            <td>
              <AgThemeBalham>
                <CustomDropdown 
                  label={selectedItems[rowIndex]?.item || "Select"}
                  activeSubmenu={activeSubmenu}
                  setActiveSubmenu={setActiveSubmenu}
                  activeSubmenuRef={activeSubmenuRef}
                >
                  {/* Income Header */}
                  <StyledHeaderItem>Income</StyledHeaderItem> {/* <DropdownItem> */}
                  {/* Income tertiary Categories */}
                  {renderDDlinks("Income", rowIndex)}
                  {/* Divider */}
                  <StyledDivider/>
                  {/* Exp Header */}
                  <StyledHeaderItem>Expenditure</StyledHeaderItem>
                  {/* Exp tertiary Categories */}
                  {renderDDlinks("Expenditure", rowIndex)}
                </CustomDropdown>
              </AgThemeBalham>
            </td>
          </tr>
        ))}
      </tbody>
    );

    //renders the user's budget items in the submenu  for each selected tertCat
    const renderSubmenuItems = () => (
      <>
        {/* map over budgetItems-display each item for each tertCat as a dropdownitem in the submenu */}
        {/* Income items */}
        {activeSubmenu.type === "Income" &&
          budgetItems.Income[activeSubmenu.secondary][activeSubmenu.tertiary].map((item, index) => { 
            console.log("Rendering DropdownItem for:", item);
            return(
              <StyledRows index={index}> 
                <StyledSubDDItem
                  key={index} 
                  onClick={() => handleItemSelect(activeSubmenu, item)} // ✅ Pass the actual item
                >
                  {item.item}
                </StyledSubDDItem>
              </StyledRows>
            );
          })
        }
        {/* Exp items */}
        {activeSubmenu.type === "Expenditure" &&
          budgetItems.Expenditure[activeSubmenu.secondary][activeSubmenu.tertiary].map((item, index) => { 
            console.log("Rendering DropdownItem for:", item);
            return(
              <StyledRows index={index}> 
                <StyledSubDDItem 
                  key={index} 
                  onClick={() => handleItemSelect(activeSubmenu, item)} // ✅ Pass the actual item
                >
                  {item.item}
                </StyledSubDDItem>
              </StyledRows>
            );
          })
        }
      </>
    );

    const renderModal = () => {

      let itemType = "";
      if(addBItem){
        //add budget item modal JSX is rendered
        itemType = "Budget"
      }else if(addTItem){
        //render the tax item modal JSX
        itemType = "Tax"
      }

      return(
        <div> 
          <Modal isOpen={modal} toggle={modalToggle}>
            <ModalHeader toggle={modalToggle}>Confirm New {itemType} Item?</ModalHeader>
            <ModalBody>
                Are you sure you want to add this new {itemType} item? 
                <br />
                <em>{newItem}</em>
            </ModalBody>
            <ModalFooter>
              <Button color="success" onMouseDown={(e) => {

                /* 
                  onMouseDown fires before the click outside the dropdown/submenu area triggers it to close (default behaviour) 
                  Then once onMouseDown fires, the first 2 lines of the callback code block prevent the default behaviour. And 
                  if the dropdown and submenu do not close, then we don't need to manually reopen them which is a win.
                */

                //stop the dropdown and submenu from closing
                e.preventDefault(); 
                e.stopPropagation(); 

                //access the latest submenu state
                const cachedSubmenu = activeSubmenuRef.current;
            
                if(addBItem && cachedSubmenu){
                    handleItemAdd(cachedSubmenu);  // ✅ safely add the budget item
                    setNewItem("");                // ✅ reset input
                }else{
                    handleTaxItemAdd(cachedSubmenu); //safely add the new tax item
                };
                
                modalToggle();                      // ✅ close modal
                }}
              >
                Confirm
              </Button>
              <Button color="danger" onMouseDown={(e) => {

                //stop the dropdown and submenu from closing
                e.preventDefault(); 
                e.stopPropagation(); 

                // reset state
                setNewItem("");
                modalToggle();
            
              }}
              >
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      )
    };

  //END HELPER functions


  // MAIN JSX: consists of two unique sets of JSX which are conditionally rendered depending on the userData state
  if (userData.length > 0) {
    return (
      <SubWrapper>
        <StyledContainer>
          <h2>
            Transactions for Week {selectedWeek}, {selectedMonth}, {selectedYear}
          </h2>
          <StyledTable bordered striped>
            {renderTableHeaders()}
            {renderTableRows()}
          </StyledTable>
          <div style={{ paddingBottom: "20px" }}>
            <Button
              color="primary"
              size="lg"
              disabled={!areAllCategoriesSelected(selectedItems)}
              onClick={handleDataSubmit}
            >
              Save Budget Data
            </Button>
          </div>
        </StyledContainer>
        <MyAppFooter />
        {/* Render the portal submenu if activeSubmenu is set */}
        {activeSubmenu && (
     
          <PortalSubmenu
            data-submenu // ✅ so we can detect clicks inside submenu
            onClick={() => console.log("PortalSubmenu clicked")}
            style={{
              position: "absolute", // positions the submenu exactly using top/left values (removes it from normal document flow)
              top: activeSubmenu.top, // sets the vertical position of the submenu relative to the page
              left: activeSubmenu.left, // sets the horizontal position of the submenu relative to the page
              zIndex: 9999, // ensures the submenu appears on top of other overlapping elements
              background: "#fff", // specifies the background colour
              border: "1px solid black", // specifies the border
              borderRadius: "0.375rem", // applies the same border-radius style as the reactstrap main dropdownmenu
              width: "250px", // specifies the width of the submenu
              pointerEvents: "auto", // ensures submenu can receive clicks
              overflow: "hidden", // ensures no child content "spills" outside the rounded border (interfering with rounded corners)
            }}
          >
            {/* this div encloses the contents of the submenu */}
            <div style={{ padding: "0.5rem" }}>
              <p>
                <strong>{activeSubmenu.tertiary}</strong>
              </p>
                {/* display budget items for selected tertCat */}
                {renderSubmenuItems()}
                <StyledDivider/>
                {/* Add Budget Item Button */}
                <StyledAddItemButton
                  color="primary"
                  id="AddBItem"
                  onClick={(e) => {

                    // update state to true to indicate the user selected to add "budget" item
                    setAddBItem(true);
                  }}
                >
                  Add New Budget Item
                </StyledAddItemButton>
                {/* Collapse content for Add New Budget Item Button */}
                <UncontrolledCollapse toggler="#AddBItem">
                  {/* Collapse content-When the user clikcs the button we need to render a form which prompts user to enter new item*/}
                  <AddItemForm
                    modalToggle={modalToggle}
                    newItem={newItem}
                    setNewItem={setNewItem}
                    budgetItems={budgetItems}
                    activeSubmenu={activeSubmenu}
                  />
                </UncontrolledCollapse>
                {/* Add Tax Item Button */}
                <StyledAddItemButton
                  color="danger"
                  id="AddTItem"
                  onClick={() => {
                    console.log("Add Tax Item Button clicked");
                  }}
                >
                  Add Tax Item
                </StyledAddItemButton>
                {/* Collapse content for Add New Budget Item Button */}
                <UncontrolledCollapse toggler="#AddTItem">
                  {/* Collapse content-When the user clikcs the button we need to render a form which prompts user to enter new item*/}
                  <AddItemForm
                    modalToggle={modalToggle}
                    newItem={newItem}
                    setNewItem={setNewItem}
                    budgetItems={budgetItems}
                    activeSubmenu={activeSubmenu}
                  />
                </UncontrolledCollapse>
            </div>
          </PortalSubmenu>
        )}
        {/* Modal content is placed here (using a helper function), outside of conditional rendering */}
        {renderModal()}
        
      </SubWrapper>
    );
  } else {
    return (
      <> 
        <SelectFile

          selectedWeek={selectedWeek}
          setSelectedWeek={setSelectedWeek}

          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}

          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}

          file={file}
          setFile={setFile}

          userData={userData}
          setUserData={setUserData}
        
        />
        <MyAppFooter/>
      </>
    );
  }
}

//Styles
/* specifies the styling of the content within the portal submenu */
const StyledSubmenuDiv = styled.div`
  max-height: 200px;       /* ✅ Sets the maximum height of the submenu; scroll appears if content exceeds this height */

  overflow-y: auto;        /* ✅ Enables vertical scrolling if the content height exceeds 200px */

  overflow-x: hidden;      /* ✅ Hides any horizontal overflow to prevent sideways scrolling */

  box-sizing: border-box;  /* ✅ Includes padding and border within the element's total width and height, preventing layout overflow */

  direction: rtl;          /* ✅ Reverses the content flow, causing the scrollbar to appear on the left instead of the right */

  text-align: left;        /* ✅ Re-corrects the text alignment so text still reads left-to-right, even though direction is set to rtl */
`;

/* specifies the style of the table */
const StyledTable = styled(Table)`
  /* ✅ On medium screens and up (768px+), make room for the submenu */
  @media (min-width: 768px) {
    width: calc(100% - 220px);  /* Shrinks table width by 220px to leave space */
    margin-right: 220px;        /* Creates a gap to the right for the submenu */
  }

  /* ✅ On small screens (<768px), let the table use full width */
  @media (max-width: 767px) {
    width: 100%;                /* Uses full width of the container */
    margin-right: 0;            /* Removes the reserved space */
  }
`;



const StyledAddItemButton = styled(Button)`
  display: block;  // ✅ Ensures margin auto works for centering
  width: 100%;
  margin: 0 auto; // ✅ Centers it within its container (left & right margins auto)
  margin-top: 5%;
  margin-bottom: 5%;
`;


const StyledSubDDItem = styled.div`
  color: var(--bs-dropdown-header-color);     /* ✅ Matches dropdown text color */
  font-size: 1rem;                             /* ✅ Same font size */
  font-weight: normal;                         /* ✅ Normal weight */
  width: 90%;                                  /* ✅ Similar to dropdown width */
  margin: 0 auto;                              /* ✅ Center it */
  padding: 0.5rem 0;                           /* ✅ Top/bottom spacing */
  text-align: left;                            /* ✅ Left-align text */
  cursor: pointer;                             /* ✅ Indicates clickable */
  border-radius: 0.375rem;                     /* ✅ Matches dropdown border radius */

  &:hover {
    background-color: var(--bs-light);         /* ✅ Hover effect */
  }
`;

const AgThemeBalham = styled.div.attrs(() => ({
    className: 'ag-theme-balham',
  }))`
  font-size: 1.2rem;
    
`;

// specifies the style of the main dropdownMenu element in renderTableRows(). Specifically, the outer styling (border and width)
const StyledDropdownMenu = styled(DropdownMenu)`
  width: 250px; //specifies width of main dropdown
  border: 1px solid black; //gives it a black border
  
`;

//specifies the style of the inner scrollable container within <StyledDropdownMenu/>
const ScrollContainer = styled.div`
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
  direction: rtl; /* Scrollbar on the left */
  --bs-dropdown-padding-y: 0 rem; /* override the default padding at the top of dropdown between header item and top edge */
  
`;

//specifies the style for the inner container that resets the direction
const InnerContainer = styled.div`
  direction: ltr;
  
`;

//specifies the style of the Income/Exp dropdownItem headers
const StyledHeaderItem = styled.div`
  font-weight: bold;
  background-color: var(--bs-info); /* matches Bootstrap info color */
  color: white;
  font-size: 1rem;
  padding: 0.5rem 1rem; /* mimic spacing from DropdownItem */
  border-bottom: 1px solid #dee2e6; /* optional: subtle divider */
`;

//specifies the style of the rows of the dropdownMenu
//this component accepts the index prop which it uses to conditionally render the backgorund colour of the rows
const StyledRows = styled.div`
  background-color: ${(props) =>
    props.index % 2 === 0 ? "#f8f9fa" : "#ffffff"};
    
  &:hover {
    background-color: var(--bs-light); // ✅ Same hover color
  }
  
   
`;

const StyledSecondaryCatHeader = styled.div`
  font-weight: bold;
  font-size: 1rem;
  padding: 0.75rem 1rem; /* similar to Bootstrap item padding */
  background-color: #f1f3f5; /* light neutral background */
  border-top: 1px solid #dee2e6;
  cursor: default;
  
  
`;

//specifies the style for the clickable elements in the main dropdown
const StyledTertCatItem = styled.div`
  cursor: pointer;
  margin-top: 1rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  font-weight: normal;
  display: flex;
  justify-content: flex-start;
  
`;

const StyledSubmenuItem = styled(DropdownItem)`
  cursor: pointer;
  font-weight: normal;
  font-size: medium;
  justify-content: flex-start;
`;
const StyledDivider = styled(DropdownItem).attrs(() => ({
  divider: true,
}))`
  margin: 0;
  border-top: 1px solid black;
`;



const SubWrapper = styled.div`
  background-color: #f5f5f5;
  min-height: 100vh;
  
`;

const StyledContainer = styled.div`
  padding-top: 1rem;        /* ~16px: light top padding */
  padding-bottom: 1.5rem;   /* ~24px: slightly more at the bottom */

  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 15px;
  padding-right: 15px;
  background-color: #fff;
  min-height: 100vh;

  @media (min-width: 768px) {
    max-width: 720px;
    padding-top: 1.5rem;    /* ~24px */
    padding-bottom: 2rem;   /* ~32px */
  }

  @media (min-width: 992px) {
    max-width: 960px;
  }

  @media (min-width: 1200px) {
    max-width: 1140px;
    padding-top: 2rem;      /* ~32px */
    padding-bottom: 2.5rem; /* ~40px */
  }

  @media (min-width: 1400px) {
    max-width: 1320px;
  }
`;






