import { Form, Label, Input} from 'reactstrap'; 


/* 
    This component is called from within the IMportData JSX to render a Form to the user when they click the Add Budget/Tax Item 
    Button in the submenu. The Form contains a Modal component which needs to open when the user submits their input
    from the form.
*/
export default function AddItemForm({
    toggle,
    newItem, setNewItem,
}){

    return(
        <>
            <Form
                /* event handler matches that of the Submit Button to ensure behaviour is the same when user presses "Enter" */
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation(); // Optional but consistent with button behavior

                
                    // ✅ Open modal 
                    setTimeout(() => {
                        toggle();
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
            </Form>

            
        </>               
    )
}

