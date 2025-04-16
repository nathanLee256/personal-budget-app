// CustomDropdown.js
import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'reactstrap';

/*  
    This component renders a custom dropdown when called. The dropdown will not have the same limitations of 
    a reactstrap dropdown and thus we won't need to use a portal submenu and deal with event handler issues for clickable
    elements of the submenu 
*/
export default function CustomDropdown({ label, children, activeSubmenu, setActiveSubmenu, activeSubmenuRef }) {
  
    /* 
        reference variable which will store the DOM element which represents the dropdown menu (the outer div in the 
        first line of return statement). This <div> Contains both the <button> that toggles the dropdown and The actual 
        dropdown content. Whenever the <div ref={dropdownRef}> element is rendered, React 
        automatically assigns the actual DOM element to dropdownRef.current ) 
    */
    const dropdownRef = useRef(null);

    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => setIsOpen((prev) => !prev);



    /* 
        function to close the dropdown when user clicks outside it. IE The useEffect hook is here specifically 
        to listen for clicks outside the dropdown and then close it when that happens
    */
    useEffect(() => {

        //this is an event handler which runs when user clicks anywhere on the DOM
        function handleClickOutside(event) {
            /* so here in this first line uses the  */
            const clickedInsideDropdown = dropdownRef.current?.contains(event.target);
            const clickedInsideSubmenu = event.target.closest('[data-submenu]'); // 👈 detect submenu clicks

            //runs when a user clicks outside of *both the dropdown and submenu
            if (!clickedInsideDropdown && !clickedInsideSubmenu) {
                setIsOpen(false);

                //close the current submenu
                if (activeSubmenuRef.current) {
                    setActiveSubmenu(null); // ✅ close it
                }
            }

        }

        //command the browser to call the handleClickOutside function whenever a mousedown event occurs anywhere on the DOM from this point
        document.addEventListener('mousedown', handleClickOutside);

        //remove any event listener previously set up before the effect runs again
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    /* 
        We could leave the depedency array empty so that the effect (setting up the event listener) runs (once) every time the
        CustomDropdown component renders (when the user clicks one of the buttons in the ImportData table). But we have included
        the 2 parameters here to follow react's best practices for the useEffect hook which states that: "If the useEffect uses a 
        variable or function from outside the useEffect callback code block, then we should include it in the dependency array." 
        In our case, both rIndex and toggleDropdown were used inside the effect (line 35), and they are declared outside of it (as props), 
        so they qualify. 👉 However, in our particular case, the behavior would still work fine even if the array was left empty, 
        because:

            -The component unmounts and remounts for each new row, and

            -The latest rIndex and toggleDropdown values are captured at that time.
    */


    return (
        <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
          <Button color="info" onClick={toggleDropdown}>{label}</Button>
    
          {isOpen && (
            <div
                style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    zIndex: 1000,
                    background: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '0.5rem',
                    width: '300px',
                    maxHeight: '700px',
                    overflowY: 'auto',
                    textAlign: 'left',
                    direction: 'rtl'  // ✅ Forces scrollbar to left side
                }}
            >
                <div style={{ direction: 'ltr', textAlign: 'left' }}>
                    {children}
                </div>
            </div>
          )}
        </div>
    );
};
