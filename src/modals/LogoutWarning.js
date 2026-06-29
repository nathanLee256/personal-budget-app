import { useEffect, useState } from 'react';
import { Button, Modal, ModalBody, ModalHeader,ModalFooter, Spinner} from 'reactstrap';
import { useAuth } from '../components/AuthContext.js';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

export default function LogoutWarning({
    isOpen, 
    setLogoutWarning, 
    warningModalToggle
}){ 

    //destructure the required application-level state from the global component
    const { 
        authenticated, 
        setAuthenticated, 
        userId,
        setUserId,
        token,
        setToken,
        chooseLogin,
        setChooseLogin,
        chooseRegister,
        setChooseRegister
    } = useAuth(); 

    //create an instance of the navigate()
    const navigate = useNavigate();

    //Continue button handler function
    async function handleSuccess(){
        //execute a fetch request to the server to refresh jwt

        //define URL for server route
        const url = "http://localhost:3001/users/refresh_jwt";

        //retrieve the active jwt from local storage
        const activeToken = localStorage.getItem('token');
        const activeExpiration = localStorage.getItem('tokenExpiration');
        const now = new Date().getTime();

        //perform a jwt check (probably redundant but just for safety)
        if (!activeToken || (activeExpiration && parseInt(activeExpiration) < now)) {
          /* if this block runs it means either no jwt was found or an expired one was found */
          // in which case the user needs to be logged out by setting authenticated to false
            console.log("Token expired or missing, logging out...");
            localStorage.removeItem('token');
            localStorage.removeItem('tokenExpiration');
            localStorage.removeItem('userID');

            //reset global state and re-navigate to Landing page
            setAuthenticated(false);
            setUserId(null);
            setChooseLogin(false);
            setChooseRegister(false);
            navigate("/", {replace: true});

            return; // 💥 early exit so the fetch request below never runs
        }

        // code block containing async code
        try{
            // Perform the POST request
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${activeToken}` //send token in request header not req.body
                    //NB: server route is pre-configured to automatically look for incoming tokens in the HTTP headers
                }
            });

            //handle response
            /* 
                expected format:
                {
                    "success": true,
                    "token": "XQiOjE3MTk2Njk0MzksImV4cCI6MTcxOTY3MDE1OX0.signature..."
                }

            */
            if (!response.ok) {
                throw new Error('Failed to refresh token');
            }

            //convert JSON to JS object, assigned to data
            const data = await response.json();
            if (data.token) {
                //this block runs if the server successfully sent back a bearer token
                //in which case we need to store the updated token and its expiration time in local storage
            
                localStorage.setItem('token', data.token);
                const decoded = jwtDecode(data.token);
                const expirationTime = decoded.exp * 1000; // Convert from seconds to milliseconds
                localStorage.setItem('tokenExpiration', expirationTime);
                console.log("Token Expiration set to:", expirationTime);

                //update global state
                setToken(data.token);
                warningModalToggle(); //close the modal by resetting its state
                console.log("Session successfully extended via modal handler!");
            }


        } catch(error){
            console.error('Error occurred in refresh_jwt POST request:', error);

        }

    }

    //Cancel handler function
    function handleDanger(){
        //log user out now before token expires
        // we don't want a situation where the user ignores warning, keeps working and is logged out when jwt expires
        //insert code to logout first before closing modal and resetting state
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiration');
        localStorage.removeItem('userID');

        //reset global state and re-navigate to Landing page
        setAuthenticated(false);
        setUserId(null);
        setChooseLogin(false);
        setChooseRegister(false);
        

        warningModalToggle(); //close modal
        setLogoutWarning(false);
        navigate("/", {replace: true});
        
    }

    return(
        <div>
            <Modal isOpen={isOpen} toggle={warningModalToggle}>
                {/* Modal Header */}
                <ModalHeader toggle={warningModalToggle}>Warning</ModalHeader>
                <ModalBody>
                Your session is about to expire. Continue working?
                </ModalBody>
                <ModalFooter>
                    <Button color="success" onClick={()=> handleSuccess()}>
                        Continue
                    </Button>
                    <Button color="danger" onClick={()=> handleDanger()}>
                        Logout
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );

}