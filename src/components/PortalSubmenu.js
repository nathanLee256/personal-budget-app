// PortalSubmenu.js
import React from 'react';
import ReactDOM from 'react-dom';


/* 
  The <PortalSubmenu> component is called to be rendered from within the ImportData JSX, whenever the activeSubmenu
  state is truthy. See below for what is looks like. Note we gave it the data-submenu attribute so that the 
  event listener in the CustomDropdown component useEffect would detect a user mousedown on the submenu. But when the line:
  const clickedInsideSubmenu = event.target.closest('[data-submenu]'); ...searches the DOM upwards from the event.target element
  for an element with the data-submenu attribute, it will not find it if the attribute is part of the <PortalSubmenu> component itself. 
  The solution is to add the attribute to the inner <div> which encloses the portal component contents when it is rendered, but is 
  not outside the DOM itself. We do that here by passing the ... rest prop to the enclosing div whenever the portal component is 
  rendered. Adding data-submenu to the actual HTML <div> that wraps the portal contents gives .closest() method from the useEffect
   something real to find in the DOM (at the very top just under the first <body> tag!

  KP: Normally, React components render inside their parent component’s DOM tree. But with a portal, React renders the component's 
  content into a different part of the DOM entirely — typically document.body (see below).

*/
const PortalSubmenu = ({ children, style, ...rest }) => {
  return ReactDOM.createPortal(
    /* this is the div which encloses the portal component contents and it is rendered at the top of the DOM tree
    just under the <body> tag */
    <div
      style={{ ...style }}
      {...rest} // ✅ Forward any extra props like data-submenu
    >
      {children}
    </div>,
    document.body
  );
};

export default PortalSubmenu;


/* {activeSubmenu && (
     
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
  >  */

{/* <body>
  <div id="root">...</div>
  <div data-submenu>  <!-- 👈 your portal content ends up here -->
    ...
  </div>
</body> */}
