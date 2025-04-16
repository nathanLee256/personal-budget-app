import { useContext } from 'react';
import styled from 'styled-components';
import "bootstrap/dist/css/bootstrap.min.css";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useAuth } from '../components/AuthContext.js';

// Register the necessary chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

/* This component is called from within the <Dashboard/> component using <Table data={result} />
It uses the result JSON object and displays the data for Income in a Pie ChartJS chart. */
export default function Dbar(){
  
  //destructure the data global state variable
  const { userData, setUserData } = useAuth();
  const { selectedMonth, setSelectedMonth } = useAuth();
  
  
  // Initialize variables
  let Income = {};
  let Expenditure = {};
  let result = {};
  let month = '';

  console.log(result);

  Income = userData.Income || {};
  Expenditure = userData.Expenditure || {};
  result = userData;
  month = selectedMonth;

    /* sort the Income object in descending order based on its values. This is a 3-step process
    which involves converting the object into an array of key-value pair objects, sorting the 
    array by the values in descending order, and then converting the sorted array back into an 
    object */ 
    const entries = Object.entries(Income);
    const sortedEntries = entries.sort(([, valueA], [, valueB]) => valueB - valueA);
    const incomeSorted = Object.fromEntries(sortedEntries);

    const entriesOne = Object.entries(Expenditure);
    const absEntries = entriesOne.map(([key, value]) => [key, Math.abs(value)]);
    const sortedEntriesOne = absEntries.sort(([, valueA], [, valueB]) => valueB - valueA);
    const expSorted = Object.fromEntries(sortedEntriesOne);

    // Create labels
    const incomeLabels = Object.keys(incomeSorted);
    const expLabels = Object.keys(expSorted);


  // Prepare data for the bar chart
  const chartData = result ? {
    labels: [...incomeLabels, '', ...expLabels], // Adding an empty string to separate the two sections
    datasets: [
      {
        axis: 'y',
        label: 'Income',
        data: [...Object.values(incomeSorted), ...Array(expLabels.length).fill(null)], // Pad with null values
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        axis: 'y',
        label: 'Expenditure',
        data: [...Array(incomeLabels.length).fill(null), ...Object.values(expSorted)], // Pad with null values
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  } : null;

  // Define the chart options using an object
  const chartOptions = {
    indexAxis: 'y', // This property makes the chart horizontal
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Income and Expenditure Summary'
      },
    },
  };

  

  return(
      <Container>   
          <h5>Summary for Month: {month} </h5>
          <Bar data={chartData} options={chartOptions} style={{ outline: '1px solid black'}} />  
      </Container>
  );
       
};

// Styled component for the container div
const Container = styled.div`
  margin: 0px; // narrow margins
  display: flex;
  flex-direction: column;
  height: 90%;
  width: 100%;
  gap: 10px;
`;
