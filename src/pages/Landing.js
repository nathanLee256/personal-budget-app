
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import React, { useState, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Row, Col, CardBody } from 'reactstrap';
import styled from 'styled-components';
import portfolioHero from '../assets/portfolioHero.png';
import MyAppFooter from '../components/MyAppFooter.js';
import Login from '../components/Login.js';
import Register from '../components/Register.js';
import Home from './Home.js'
import { useAuth } from '../components/AuthContext.js';
import { useNavigate } from 'react-router-dom';



/* Application Landing page component which will be rendered if the user is not already authenticated.
If this is true, this page will present  login and register buttons. When the user clicks the Login 
button, the <Login/> component will be rendered which presents the login form. If they click the 
register button, the <Register/> component will be rendered which presents the registration form.  
 */
export default function Landing()
{
    // destructure the global state variables
    const { authenticated, setAuthenticated, token, setToken, userId, setUserId } = useAuth();
    const { chooseLogin, setChooseLogin, chooseRegister, setChooseRegister} = useAuth();
    

    //hooks

    const navigate = useNavigate();

    // State variables. authenticated will be set to true when user is authenticated.
    // token will be assigned the value of the token field from the servers' JSON response (to the POST request).
    
    

    const loginOption = () => {
        setChooseLogin(true);

    }

    const registerOption = () => {
        setChooseRegister(true);

    }

    



    if (!chooseLogin && !chooseRegister){
        return(
            <Wrapper>
                <HomeContainer> 
                    <ImageFormatter>
                        <LoginContainer>
                            <div>
                                <h1>Login or Register</h1>
                                <Row> 
                                    <Col md={3}>
                                        <Button onClick={loginOption} color="info">Login</Button>
                                    </Col>
                                </Row>
                                <Row style= {{paddingTop: '20px'}}> 
                                    <Col md={3}>
                                        <Button onClick={registerOption} color="info">Register</Button>
                                    </Col>
                                </Row>
                            </div>                    
                        </LoginContainer>
                    </ImageFormatter>
                </HomeContainer>
                <MyAppFooter></MyAppFooter> {/* Manually add the footer to keep it at the bottom */}
            </Wrapper>
        )
    }else if(chooseLogin){ 
        return(
            <Wrapper>
                <HomeContainer> 
                    <ImageFormatter>
                        <LoginContainer>
                            <div>
                                <h1>Login</h1>
                                <Login/>
                            </div>                    
                        </LoginContainer>
                    </ImageFormatter>
                </HomeContainer>
                <MyAppFooter></MyAppFooter> {/* Manually add the footer to keep it at the bottom */}
            </Wrapper>
        );
    } else if(chooseRegister){
        return(
            <Wrapper>
                <HomeContainer> 
                    <ImageFormatter>
                        <LoginContainer>
                            <div>
                                <h1> Register</h1>
                                    <Register/>
                            </div>                    
                        </LoginContainer>
                    </ImageFormatter>
                </HomeContainer>
                <MyAppFooter></MyAppFooter> {/* Manually add the footer to keep it at the bottom */}
            </Wrapper>
        );
    };
};

/* formats the page text */
const LargeText = styled.p`
  font-size: 1.2rem; // Standard font size
  line-height: 1.5; // Standard line height
  font-weight: normal; // Normal font weight
  color: #333; // Standard text color
  margin: 1rem 0; // Standard margin
  outline: 2px solid purple;
  
`;
/* formats the <ol> list */
const LargeTextList = styled.ol`
  font-size: 1.2rem; // Same as LargeText
  line-height: 1.5; // Same as LargeText
  font-weight: normal; // Same as LargeText
  color: #333; // Same as LargeText
  margin: 1rem 0; // Same as LargeText
  

  li {
    margin-bottom: 0.5rem; // Adjust the margin as needed
  }
`;

const LoginContainer = styled.div`
    margin: 30px;
    display: block;
`;

const RegisterContainer = styled.div`
    padding-top: 30px;
    display: block;
    margin-bottom: 10px;
`;

const Wrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    min-height: 100%;
    outline: 2px solid black; 
`;

const HomeContainer = styled.div`
    height: 100vh; /* Set the height of the Home component to the height of the viewport */
    display: flex; /* Use flexbox to center the hero image vertically and horizontally */
    justify-content: center;
    align-items: center;
    outline: 2px solid black;
`;

const ImageFormatter = styled.div` 
    background-image:  url(${portfolioHero}); /* Set the background image of the hero section */
    background-size: cover; /* Make sure the image covers the entire section */
    background-position: center center; /* Center the image vertically and horizontally */
    height: 100%; /* Set the height of the hero section to 100% of its parent element */
    width: 100%;
    display: flex; /* Use flexbox to center the text inside the hero section */
    justify-content: left;
    align-items: left;
    flex-direction: column;
    color: #fff; /* Set the color of the text to white */
    text-align: left; /* Center the text horizontally */
    padding-top: 100px;
`;

const HeroText =styled.h1`
    color: white;
    top:5;
    text-align: center;
    font-weight: 1000;
    justify-content: center;
    align-items: center;
    font-size: 2.5rem;
    font-family: 'Bebas Neue', sans-serif;
    font-weight: bold;
    text-shadow: 4px 4px 4px rgb(18, 18, 18);
    padding-top: 80px;
`;

const SubWrapper = styled.div`
    background-color: #f5f5f5; /* Replace with your desired background color */
    min-height: 100vh;
    outline: 2px solid black;
    flex: 1;
    padding-bottom: 50px;
`;


const AgThemeBalham = styled.div.attrs(() => ({
    className: 'ag-theme-balham',
  }))`
    padding-top: 20px;
    padding-bottom: 40px;
    outline: 2px solid red;
    /* You can add additional styles here if needed */
  `;

const CardBodyStyled = styled(CardBody)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100% - 350px); /* Subtract the height of the image */
  padding: 20px; /* Adjust padding as needed */
`;
