import React from 'react'; 
import { useState } from 'react';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink, NavbarToggler, Collapse } from 'reactstrap';
import '../styles/navBar.css';
import sodium from '../assets/sodium.png'; 
import { useNavigate } from "react-router-dom";



const MyAppNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const navigate = useNavigate();

  return (
    <Navbar className="navbar-dark" color="secondary" expand="md">
      <NavbarBrand onClick={() => navigate("/home")} style={{ color: "white", cursor: "pointer" }} aria-label="Go to Home Page" >
        <img src={sodium} alt="MLB Logo" height="30" width="30"/>
        {' '}Personal Budget Application
      </NavbarBrand>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="mr-auto" navbar>
          <NavItem>
            <NavLink onClick={() => navigate("/worksheet")} style={{ color: "white", cursor: "pointer" }}>
              Worksheet
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink onClick={() => navigate("/import_data")} style={{ color: "white", cursor: "pointer" }}>
              Import Data
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink onClick={() => navigate("/budget_tool")} style={{ color: "white", cursor: "pointer" }}>
              Budget Tool
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink onClick={() => navigate("/tax_tool")} style={{ color: "white", cursor: "pointer" }}>
              Tax Tool
            </NavLink>
          </NavItem>
        </Nav>
        <Nav className="ml-auto" navbar>
          <NavItem className="ml-auto">
            <NavLink onClick={() => navigate("/my_budget")} style={{ color: "white", cursor: "pointer" }}>
              Dashboard
            </NavLink>
          </NavItem>
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default MyAppNavbar;