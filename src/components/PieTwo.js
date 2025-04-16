import { useContext } from 'react';
import styled from 'styled-components';
import "bootstrap/dist/css/bootstrap.min.css";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useAuth } from '../components/AuthContext.js';

// Register the necessary chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

/* This component is called from within the <Dashboard/> component using <Table data={result} />
It uses the result JSON object and displays the data for Income in a Pie ChartJS chart. */
export default function PieOne(){
  
  //destructure the data global state variables
  const { userData, setUserData } = useAuth();
  const { selectedMonth, setSelectedMonth } = useAuth();
  
  // Initialize variables
  let Income = {};
  let Expenditure = {};
  let result = {};

  console.log(result);

  Income = userData.Income || {};
  Expenditure = userData.Expenditure || {};
  result = userData;

  //calculate the total income and total expenditure
  let total_inc = Object.values(Income).reduce((acc, value) => acc + value, 0);
  let total_exp = Object.values(Expenditure).reduce((acc, value) => acc + value, 0);
  total_inc = total_inc.toFixed(2);
  total_exp = total_exp.toFixed(2);

  // Updated color palette for doughnut chart
  const colors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
    '#8A2BE2', '#00FA9A', '#FFD700', '#FF4500', '#DA70D6', '#00CED1',
    '#ADFF2F', '#FF6347', '#4682B4', '#FF1493', '#20B2AA', '#EE82EE',
    '#87CEEB', '#6B8E23'
  ];

  // Prepare data for doughnut chart 2
  const doughData_2 = result ? {
    labels: [...Object.keys(Expenditure)],
    datasets: [
      {
        data: [...Object.values(Expenditure)],
        backgroundColor: colors.slice(0, Object.keys(Expenditure).length),
        hoverBackgroundColor: colors.slice(0, Object.keys(Expenditure).length),
      },
    ],
  } : {};

  // Doughnut chart options for consistent sizing
  const doughnutOptions = {
    cutout: '50%', // Adjust the cutout percentage
    radius: '100%', // Ensure the radius is consistent
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
        legend: {
          display: false, // Disable the legend
        },
        centerText: {
          display: true,
          text: total_exp,  // Display total expenditure in the center
          color: 'red' // Set the color to red for expenditure
        }
      },
  };


  
  return(
      <Container> 
          <h5>Expenditure</h5>
          <Doughnut data={doughData_2} options={doughnutOptions}/>
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
`;