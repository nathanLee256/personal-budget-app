import { useState, useContext } from 'react';
import styled from 'styled-components';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement} from 'chart.js';
import "bootstrap/dist/css/bootstrap.min.css";
import Table from './Table.js';
import PieOne from './PieOne.js';
import PieTwo from './PieTwo.js';
import Dbar from './Dbar.js';
import Sbar from './Sbar.js';
import { useAuth } from '../components/AuthContext.js';

// Register the necessary chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

/* This component is called from within the <ImportCSV/> component, after the user has 
uploaded a .csv file and the server has processed it and returned JSON . It renders a number of 
graphical charts to the user which summarise their monthly budget. The charts are displayed in
in grid/flexbox, presenting a 'budget dashboard' to the user. The notation in <ImportCSV/>
used to pass the object is <Dashboard data= {result} />*/

export default function Dashboard(){
  //destructure the data global state variable
  const { userData, setUserData } = useAuth();
  const { selectedMonth, setSelectedMonth } = useAuth();




  // In the code below I have destructured the prop object and assign the respective values
  //to local variables. However, I think I will need to assign them to state variables to allow the 
  // Dashboard component to still be displayed if the user refreshes the page. This means that 
  // every child component of Dashboard will also need to store the props as state.


  // Initialize variables
  let Income = {};
  let Expenditure = {};
  let result = {};
  let month = '';
    
    

  if (userData){

    Income = userData.Income || {};
    Expenditure = userData.Expenditure || {};
    result = userData;
    month = selectedMonth;

    //sum the values of each object and store them in a variable. Round the variable to two decimal
    //places and remove the minus sign from the expenditure variable
    let inc = Object.values(Income).reduce((acc, value) => acc + value, 0);
    let exp = Object.values(Expenditure).reduce((acc, value) => acc + value, 0);
    inc = inc.toFixed(2);
    exp = exp.toFixed(2); 
    exp = Math.abs(exp);
  

    return(
      <Wrapper>
        <h2>Dashboard</h2>  
        <Container>
          <GridItem>
            <Sbar/>
          </GridItem>
          <GridItemOne>
            <Table/>
          </GridItemOne>
          <GridItemTwo>
            <PieOne/>
          </GridItemTwo>
          <GridItemTwo>
            <PieTwo/>
          </GridItemTwo>
          <GridItemSix>
            <Dbar/>
          </GridItemSix>
        </Container> 
      </Wrapper>   
    );
  } else{
    return (
      
        <Container>
          <p>No data available. Please upload a file to see the dashboard.</p>
        </Container>
      
    );
  }
};

// Parent Grid component
const Container = styled.div`
  display: grid; //creates a grid display: Displays container div as a block-level grid container
  width: 90%; /* Width less than the full viewport width */
  max-width: 1200px; /* Maximum width to prevent stretching too much */
  height: 100%; // container will occupy 100% percent of the containing block (SubWrapper)
  grid-template-columns: repeat(4, 1fr); // Keeps four columns at all sizes
  gap: 1rem; // space between grid items
  grid-template-rows:46% 46%;
`;

const Wrapper = styled.div`
  margin: 30px; //creates a margin on the left and right of dashboard
  padding-top: 20px;
  padding-bottom: 65px;
`;


// Styled component for each grid item
// Stacked bar chart
const GridItem = styled.div`
  border: 1px solid black; // outline for visualization
  padding: 20px; // adjust padding as needed
  background-color: #f9f9f9; // optional background color
  border-radius: 0.5rem;
  grid-column: 1 / span 1;
  grid-row: 1 /span 2;
  height: 100%; // 
  max-height: 1600px;
  overflow: hidden; // Ensure content doesn't overflow
`;
// Table
const GridItemOne = styled.div`
  border: 1px solid black; // outline for visualization
  padding: 20px; // adjust padding as needed
  background-color: #f9f9f9; // optional background color
  border-radius: 0.5rem;
  grid-column: 2 / span 1;
  grid-row: 1 /span 1;
  height: 100%; // 
  max-height: 1600px;
  overflow: hidden; // Ensure content doesn't overflow
`;
const GridItemTwo = styled.div`
  border: 1px solid black; // outline for visualization
  padding: 20px; // adjust padding as needed
  background-color: #f9f9f9; // optional background color
  border-radius: 0.5rem;
  height: 100%; // Adjust this value as needed
  overflow: hidden; // Ensure content doesn't overflow
`;


const GridItemSix = styled.div`
  border: 1px solid black; // outline for visualization
  padding: 20px; // adjust padding as needed
  background-color: #f9f9f9; // optional background color
  grid-column: span 3;
  border-radius: 0.5rem;
  height: 100%;
`;

