import React from 'react';
import { Container } from 'reactstrap';
import styled from 'styled-components';


const MyAppFooter = () => {
  return (
    <Footer>
      <div>
        <p style={{ color: "white" }}>&copy; 2024 Nathan Ahern. ReactStrap.</p>
      </div>
    </Footer>
  );
};

export default MyAppFooter;


const Footer = styled.footer`
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
  height: 65px; 
  padding-top: 20px;
  padding-bottom: 20px;
  background-color: var(--bs-secondary);
  justify-content: center;
  align-items: center;
  outline: 2px solid black;
`;