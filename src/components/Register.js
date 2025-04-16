import React, { useState, useContext } from 'react';
import { Button, Input, Form, FormGroup, Label, Row, Col } from 'reactstrap';
import { useAuth } from '../components/AuthContext.js';

/*  This component renders input fields to prompt the user to enter their email and password. These values are stored in state
variables and included as JSON string in the body of a HTTP POST request to the localhost:3001/users/register API endpoint. 
The server-side Express code performs a mySQL query to check whether that user is in the database. If they are not, 
the new user's details along with a unique hash code are added to the database.*/



const Register = () => {

    //destructure the global state variables
    const { authenticated, setAuthenticated, token, setToken } = useAuth();
    const { chooseLogin, setChooseLogin, chooseRegister, setChooseRegister} = useAuth();
    
    //local state variables
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [registered, setRegistered] = useState(false); //this one is not being used currently

    const handleRegister = () => {
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

        fetch('http://localhost:3001/users/register', options)
            .then(response => response.json())
            .then((response) => {
                setMessage(response.message);
                setRegistered(true);
            })
            .catch(err => setMessage(err.message));
    };

    const handleReset = () => {
        setEmail('');
        setPassword('');
        setMessage('');
        setMessage('');
        setRegistered(false);
    };

    const handleNewLogin = () => {
        setChooseLogin(true);
    }

    switch (message) {
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
                        <Button onClick={handleRegister} color="info">Register</Button>
                    </div>
                </Form>
            );
        case 'User successfully created!':
            return(
                <div>
                    <p>{`${message} Click to log in.`}</p>
                    <Button onClick={handleNewLogin} color="info">Log in</Button>
                </div>
            );
        case 'User already exists':
            return(
                <div>
                    <p>{message}</p>
                    <button onClick={handleReset}>Try Again</button>
                </div>
            );
        default:
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
                        <Button onClick={handleRegister} color="info">Register</Button>
                    </div>
                </Form>
            );
    }
};

export default Register;