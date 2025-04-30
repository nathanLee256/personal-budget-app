import { Form, Label, Input, Button} from 'reactstrap'; 
import styled from 'styled-components';


/* 
    This component is called from within the IMportData JSX to render a Form to the user when they click the Add Budget/Tax Item 
    Button in the submenu. The Form contains a Modal component which needs to open when the user submits their input
    from the form.
*/
export default function AddItemForm({
    modalToggle,
    newItem, setNewItem,
    activeSubmenuRef,
    cachedDropdownIndexRef
}){

    return(
        <>
            <Form
                /* event handler matches that of the Submit Button to ensure behaviour is the same when user presses "Enter" */
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation(); // Optional but consistent with button behavior

                    //cache the current dropdown index (we don't need to cache the activeSubmenu state because the useEffect does that)
                    
                
                    // ✅ Open modal 
                    setTimeout(() => {
                        modalToggle();
                    }, 0);
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
                    style={{
                        width: "100%", // ✅ Ensures input takes full width
                        boxSizing: "border-box", // ✅ Prevents width issues due to padding
                        marginTop: "2%",
                        marginBottom: "0%",
                        textAlign: "left"
                    }}
                />
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

