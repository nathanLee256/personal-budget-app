import styled from 'styled-components';
import { useState, useContext } from 'react';
import { Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext.js';

/* This component is called from within the <Table/> component and passed a userId and a data objects
as props using <SaveData data={result} userId={id}/>. The data object is the JS object returned from 
server in response to the fetch() in <ImportCSV/>. It contains the user's processed budget stats.
This component simply presents 2 <Button/>s to the user. Button 1 has an event handler that performs a HTTP
POST request to the /save_data server route and sends the data object as the JSON req.body. The server
 then responds by using the data object and the knex query builder objecty to construct and execute
a mySQL query which adds the information to the respective database tables (users, income, and 
expenditure). Button 2 is used to direct the user to the <MyBudget/> page.*/
export default function SaveData() {
    // Destructure the data global state variables
    const { userData, token } = useAuth();

    // Declare state variables and constants
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState('');

    // Event handler for Button 1
    const handleSave = async () => {
        const URL = 'http://localhost:3001/save_data';
        const payload = userData;

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        };

        if (userData) {
            try {
                const response = await fetch(URL, options);
                const responseData = await response.json();
                setSuccessMessage(responseData.message);
                if(successMessage){
                  alert("Data successfully saved to your budget!");
                };
            } catch (error) {
                console.error('Error uploading data', error);
            }
        }
    };

    // Event handler for Button 2
    const handleNavigate = () => {
        navigate('/my_budget');
    };

    return (
        <Container>
            <Button
                color="info"
                style={{ width: '100%' }}
                onClick={handleSave}
            >
                Save Data
            </Button>
            <Button
                color="info"
                style={{ width: '100%' }}
                onClick={handleNavigate}
            >
                View My Budget
            </Button>
        </Container>
    );
};

// Styled component for the container div
const Container = styled.div`
  margin: 0px; // narrow margins
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 10px;
  padding-bottom: 20px;
`;
