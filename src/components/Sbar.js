import { useEffect, useContext } from 'react';
import styled from 'styled-components';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { useAuth } from '../components/AuthContext.js';

// Register the necessary chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Sbar() {
  // this array is used in development as a placeholder. I need to implement a POST fetch() request within this
  //component which sends the props.data JSON in the req.body to the server, which executes a python script that
  // transforms the data into a format that can easily be displayed using a stacked bar chart. This format is an 
  // array of objects like the one below. 

  //destructure the data global state variable
  const { userData, setUserData } = useAuth();
  const { selectedMonth, setSelectedMonth } = useAuth();
  const {transactions, setTransactions} = useAuth();

  /* const transactions = [
    { "Transaction Cat": "Rent Income", "Amount": 1500.0, "Transaction Type": "Income" },
    { "Transaction Cat": "Salary", "Amount": 1619.28, "Transaction Type": "Income" },
    { "Transaction Cat": "Bank Fee", "Amount": 4.17, "Transaction Type": "Expenditure" },
    { "Transaction Cat": "Bike Expenses", "Amount": 240.01, "Transaction Type": "Expenditure" },
    { "Transaction Cat": "Car Registration", "Amount": 408.41, "Transaction Type": "Expenditure" },
    { "Transaction Cat": "Coffee", "Amount": 66.89, "Transaction Type": "Expenditure" },
    { "Transaction Cat": "Food", "Amount": 541.85, "Transaction Type": "Expenditure" },
    { "Transaction Cat": "Fuel", "Amount": 157.92, "Transaction Type": "Expenditure" },
    { "Transaction Cat": "Gifts", "Amount": 53.73, "Transaction Type": "Expenditure" },
    { "Transaction Cat": "Giving", "Amount": 41.0, "Transaction Type": "Expenditure" },
    { "Transaction Cat": "Groceries", "Amount": 379.72, "Transaction Type": "Expenditure" },
    { "Transaction Cat": "Health Insurance", "Amount": 138.64, "Transaction Type": "Expenditure" },
    { "Transaction Cat": "Home Loan Repayment", "Amount": 583.56, "Transaction Type": "Expenditure" },
    { "Transaction Cat": "House Maintenance", "Amount": 600.0, "Transaction Type": "Expenditure" },
    { "Transaction Cat": "Medicines", "Amount": 36.98, "Transaction Type": "Expenditure" },
    { "Transaction Cat": "Mobile Phone", "Amount": 15.0, "Transaction Type": "Expenditure" },
    { "Transaction Cat": "Parking", "Amount": 49.0, "Transaction Type": "Expenditure" },
    { "Transaction Cat": "Printing", "Amount": 15.0, "Transaction Type": "Expenditure" },
    { "Transaction Cat": "Public Transport", "Amount": 50.0, "Transaction Type": "Expenditure" },
    { "Transaction Cat": "Road Tolls", "Amount": 44.16, "Transaction Type": "Expenditure" },
    { "Transaction Cat": "Subscriptions", "Amount": 115.78, "Transaction Type": "Expenditure" },
    { "Transaction Cat": "Utilities", "Amount": 263.21, "Transaction Type": "Expenditure" }
  ]; */

  //hooks and constants
  const url = 'http://localhost:3001/transform'

  // destructure props and assign to local variables
  let result = {};
  let month = '';
  result = userData;
  // month = selectedMonth;

  

  //useEffect which runs everytime the result state changes, to fetch new data from the server to display in the 
  //stacked bar chart
  
  useEffect(() => {
    if (result && Object.keys(result).length > 0) {
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(result)
      })
      .then(response => response.json())
      .then(responseData => {
        // Handle the response data from the server
        console.log('Data received from server:', responseData);
        setTransactions(responseData);
      })
      .catch(error => {
        console.error('Error fetching data from server:', error);
      });
    }
  }, [result]);

  

  const categories = [...new Set(transactions.map(obj => obj['Transaction Cat']))];

  // Initialize an object to store the amounts for each category
  const categoryAmounts = {};
  categories.forEach(category => {
    categoryAmounts[category] = { Income: 0, Expenditure: 0 };
  });

  // Fill in the amounts for each category
  transactions.forEach(transaction => {
    const { 'Transaction Cat': category, Amount: amount, 'Transaction Type': type } = transaction;
    categoryAmounts[category][type] += amount;
  });

  // Initialize an empty datasets array
  let datasets = [];

  // Function to generate a random color
  function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 0.6)`;
  }

  // Loop through each category to create dataset objects
  categories.forEach(category => {
    let datasetObj = {
      label: category, // Set the label to the current category
      data: [
        categoryAmounts[category].Income, // Income value for this category
        categoryAmounts[category].Expenditure // Expenditure value for this category
      ],
      backgroundColor: getRandomColor(), // Random background color for the bar
      borderColor: getRandomColor(), // Random border color for the bar
      borderWidth: 1, // Width of the border
      stack: 'Stack 0' // Stack this dataset with others in the same stack group
    };

    // Push the dataset object into the datasets array
    datasets.push(datasetObj);
  });

  // Prepare data for Chart.js
  const data = {
    labels: ['Income', 'Expenditure'],
    datasets: datasets
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Legend'
      },
      tooltip: {
        mode: 'index',
        intersect: false
      },
      legend: {
        display: false,
        position: 'top'
      }
    },
    responsive: true,
    maintainAspectRatio: false,  // Disable aspect ratio to allow custom dimensions
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      }
    }
  };

  return (
    <ChartContainer>
      <h5>Income vs. Expenditure</h5>
      <ChartWrapper>
        <Bar data={data} options={options} />
      </ChartWrapper>
    </ChartContainer>
  );
}

// Styled component for the container div
const ChartContainer = styled.div`
  width: 100%;  // Adjust the width as needed
  height: 100%;  // Adjust the height as needed
  margin: 0px;  // narrow margins
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height:2000px;
`;

const ChartWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

