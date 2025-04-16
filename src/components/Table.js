import { useContext } from 'react';
import styled from 'styled-components';
import { Table as ReactstrapTable, Button, Badge, Row, Col, Card, CardTitle, CardImg, CardBody, CardSubtitle } from 'reactstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import SaveData from './SaveData';
import { useAuth } from '../components/AuthContext.js';

/* This component is called from within the <Dashboard/> component using <Table data={result} />
It uses the result JSON object and displays the data in 2 AgGridReact tables: Income and Expenditure */
export default function Table(){

    //destructure the data global state variable
    const { userData, setUserData } = useAuth();
    const { selectedMonth, setSelectedMonth } = useAuth();

    // Initialize variables
    let Income = {};
    let Expenditure = {};
    let result = {};

    Income = userData.Income || {};
    Expenditure = userData.Expenditure || {};
    result = userData;

    //calculate the total income and total expenditure
    let total_inc = Object.values(Income).reduce((acc, value) => acc + value, 0);
    let total_exp = Object.values(Expenditure).reduce((acc, value) => acc + value, 0);
    total_inc = total_inc.toFixed(2);
    total_exp = total_exp.toFixed(2);

    // Create an array to define the columns of the table
    const columns = ['Category', 'Amount'];

    // Use map() to create an array of objects (incData) which will populate each row
    const tableData = [
        { category: 'Income', amount: total_inc },
        { category: 'Expenditure', amount: total_exp }
    ];



    const calculateHeight = (rowCount) => {
        const rowHeight = 30; // Height of each row
        const headerHeight = 30; // Height of the header
        return rowCount * rowHeight + headerHeight;
    }

    const tableHeight = calculateHeight(tableData.length);
    
    // Calculate net
    const net = total_inc - Math.abs(total_exp);

    // calculate percentage of income used
    let inc_proportion = ((Math.abs(total_exp)/ total_inc)* 100);
    inc_proportion = inc_proportion.toFixed(2);

    return(
        <Container>
            <ReactstrapTable striped>
                <thead>
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index}>{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((row, index) => (
                        <tr key={index}>
                            <td>{row.category}</td>
                            <td>{row.amount}</td>
                        </tr>
                    ))}
                </tbody>
            </ReactstrapTable>
            <h5>Net: ${net} </h5>
            <h5>Available Balance: </h5>
            <h5 style={{ color: inc_proportion > 100 ? 'red' : 'green' }}>
              You have used {inc_proportion}% of your income this month
            </h5>
            <SaveData/>  {/* add a prop later: userId={id} */}
        </Container>
    );
       
};

// Styled component for the container div
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 10px;
  padding-bottom: 30px;
`;



