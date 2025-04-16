import React, { useState, useContext } from 'react';
import { Button, Input, Form, FormGroup, Label, Row, Col } from 'reactstrap';
import { useAuth } from '../components/AuthContext.js';
import { jwtDecode } from "jwt-decode"; 
import { useNavigate } from 'react-router-dom';

/*  This component renders input fields to prompt the user to enter their email and password. These values are stored in state
variables and included as JSON string in the body of a HTTP POST request to the localhost:3001/users/login API endpoint. 
The server-side Express code performs a mySQL query to check whether that user is in the database. If they are, 
the user is authenticated and assigned a JWT.*/



const Login = (props) => {

  //destructure the global state variables
  const { authenticated, setAuthenticated, token, setToken, userId, setUserId } = useAuth();
  const { chooseLogin, setChooseLogin, chooseRegister, setChooseRegister} = useAuth();

  // State variables to hold email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  
  const handleReset = () => {
    setMessage('');
    setEmail('');
    setPassword('');
  };

  /* This function 1- Constructs the payload using user input, 2- Constructs the options for the fetch request
  3- performs the POST request to the API endpoint*/
  const handleLogin = () => {
    const payload = {
      email: email,
      password: password
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'insomnia/8.6.0'
      },
      body: JSON.stringify(payload)
    };

    fetch('http://localhost:3001/users/login', options)
    .then(response => response.json())
    .then(data => {
      console.log("🔹 Login Response Data:", data); // Check if user_id is present

      if (data.token) {
        setToken(data.token);
        localStorage.setItem('token', data.token);

        try {
            const decoded = jwtDecode(data.token);
            const expirationTime = decoded.exp * 1000; // Convert from seconds to milliseconds
            localStorage.setItem('tokenExpiration', expirationTime);
            console.log("Token Expiration set to:", expirationTime);
        } catch (error) {
            console.error("Error decoding token:", error);
        }

        setAuthenticated(true);
        setMessage(data.message);
        navigate("/home", {replace : true}); //this line is added to avoid conditionally rendering <Home> from within the Landing page

        if (data.user_id !== undefined && data.user_id !== null) {
          console.log("✅ Setting User ID in state:", data.user_id);
          setUserId(data.user_id);  // Set userId in state
          localStorage.setItem('userId', data.user_id);
        } else {
          console.error("❌ `user_id` is missing from the response!");
        }
        
        
      } else {
        setMessage(data.message);
      }
    })
    .catch(err => setMessage(err.message));
  };
  const handleSuccess = () => {
    setAuthenticated(true);
  }

  switch(message){
    case 'Request body incomplete- email and password needed.':
      return(
        <div>
          <p>{message}</p>
          <button onClick={handleReset}>Try Again</button>
        </div>
      );
    case 'User does not exist. You are the weakest link. Goodbye.':
      return(
        <div>
          <p>{message}</p>
          <button onClick={handleReset}>Try Again</button>
        </div>
      );
    case 'Passwords do not match. Consult medical professional.':
      return(
        <div>
          <p>{message}</p>
          <button onClick={handleReset}>Try Again</button>
        </div>
      );
    case 'Successful login.':
      return(
        <div>
          <p>{`${message} Go to Home.`}</p>
          <Button onClick={handleSuccess} color="info">Home</Button>
        </div>
      );
    case '':
      return(
        <Form>
          <Row>
            <Col md={3}>
              <FormGroup> 
                <Label>Email:</Label>
                <Input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
              </FormGroup>
            </Col> 
          </Row>
          <Row>
            <Col md={3}>
              <FormGroup> 
                <Label>Password:</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </FormGroup>
            </Col>
          </Row>
          <div>
              <Button onClick={handleLogin} color="info">Login</Button>
          </div>
        </Form>
      );
  }
};

export default Login;