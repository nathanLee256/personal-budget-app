import { Form, Label, Input, Button} from 'reactstrap'; 
import styled from 'styled-components';
import { useEffect, useState } from "react";


/* 
    This component is called from within the IMportData JSX to render a Form to the user when they click the Add Budget/Tax Item 
    Button in the submenu. The Form contains a Modal component which needs to open when the user submits their input
    from the form.
*/
export default function AddItemForm({
    modalToggle,
    newItem, setNewItem,
    budgetItems
}){

    /* 
        NB: normally we would need to create a value state to store user input as below, but we are already using
        the newItem state to track user input so we don't need to do this:
        const [inputValue, setInputValue] = useState("");
    */

    //create an error state to store specific error messages
    const [error, setError] = useState("");

    /* 
        define a custom input validator function. Note that we could define this function in a separate file (in a separate 
        folder called /utils) which exports the function. And then we could import the function for use in components like this one.
        But for now we will define it in the current component for simplicity 
    */
    function InputValidator(value, rules = {}) {
        // specific static error messages
        const NO_INPUT_ERR = "This field is required.";
        const BUDGET_ITEM_ALREADY_EXISTS = "Budget item already exists."

        
        // Dynamic message generators
        const MSG_TOO_SHORT_ERR = (min) => `Minimum length is ${min} characters.`;
        const MSG_TOO_LONG_ERR = (max) => `Maximum length is ${max} characters.`;
        
        if (rules.required && !value.trim()) {
            return NO_INPUT_ERR;
        }
        
        if (rules.minLength && value.length < rules.minLength) {
            return MSG_TOO_SHORT_ERR(rules.minLength);
        }
        
        if (rules.maxLength && value.length > rules.maxLength) {
            return MSG_TOO_LONG_ERR(rules.maxLength);
        }

        //iterate over the budgetItems array using a sequential search
        // Check for duplicate budget item
        if (Array.isArray(budgetItems)) {
            const exists = budgetItems.some((bItem) => bItem.item === value);
            if (exists) return BUDGET_ITEM_ALREADY_EXISTS;
        }
        
        
        return ""; // ✅ No errors
    }
    


    return(
        <>
            <Form
                /* event handler matches that of the Submit Button to ensure behaviour is the same when user presses "Enter" */
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation(); // Optional but consistent with button behavior

                    //call the custom function
                    const errorMessage = InputValidator(newItem, {
                        required: true,
                        minLength: 3,
                        maxLength: 20,
                        pattern: /^[a-zA-Z0-9 ]+$/, // alphanumeric + space
                    });

                    if (errorMessage) {
                        //if this is true, it means the user has entered invalid input in which case we need to set the Error state
                        // and then early exit the function
                        setError(errorMessage);
                        return;
                    }else{
                        //if this block runs it means the users has entered valid input in which case we need to open the modal
                        console.log("Form submitted:", newItem);

                        setError(""); //clear previous error before toggling modal
                    
                        setTimeout(() => {
                            modalToggle();
                        }, 0);
                    }
                  
                }}
            > 
                <Label
                    className="visually-hidden" /* hide the label but keep it accessible to screen readers. */
                    for="additem"  /* associates label with an input field that has the id="additem" */
                >
                Enter New Item
                </Label>
                <Input
                    id="additem"
                    name="item"
                    placeholder="Add new item..."
                    type="text"
                    value={newItem}
                    onMouseDown={(e) => e.stopPropagation()} // ✅ Prevents dropdown from closing
                    onClick={(e) => e.stopPropagation()} // ✅ Extra safeguard
                    onKeyDown={(e) => {
                        if (e.key === " ") {
                        e.preventDefault(); // ✅ Prevent dropdown from closing when user enters space
                        e.stopPropagation(); // ✅ Stop event bubbling
                        setNewItem((prev) => prev + " "); // ✅ Manually add space to input value
                        }
                    }}
                    onChange={(e) => setNewItem(e.target.value)}
                    /* add onBlur and associated onFocus handler to evaluate user input in real time */
                    onBlur={() => {
                        const errorMessage = InputValidator(newItem, {
                        required: true,
                        minLength: 3,
                        maxLength: 20,
                        });
                        setError(errorMessage);
                    }}
                
                    //clear error when user starts editing again (optional)
                    onFocus={() => setError("")}
                    style={{
                        width: "100%", // ✅ Ensures input takes full width
                        boxSizing: "border-box", // ✅ Prevents width issues due to padding
                        marginTop: "2%",
                        marginBottom: "0%",
                        textAlign: "left"
                    }}
                />
                {/* Add the following line for error-handling. This JSX is rendered below the <Input> field when user
                enters invalid input*/}
                {error && <p style={{ color: "red" }}>{error}</p>}
                <StyledSubmitButton>
                    Submit
                </StyledSubmitButton>
            </Form>

            
        </>               
    )
}

const StyledSubmitButton = styled(Button)`
    background-color: var(--bs-secondary);   // ✅ Bootstrap secondary background
    border-color: var(--bs-secondary);       // ✅ Match border to background
    color: #fff;                              // ✅ Make text readable on dark background 
    display: block;  // ✅ Ensures margin auto works for centering
    width: 100%;
    margin: 0 auto; // ✅ Centers it within its container (left & right margins auto)
    margin-top: 5%;
    margin-bottom: 5%;
`;

