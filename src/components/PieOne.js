import { useContext } from 'react';
import { Doughnut } from 'react-chartjs-2';
import styled from 'styled-components';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from '../components/AuthContext.js';

// Register the necessary chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

/* here we define a custom plugin (defined gloablly here outside of the component). This
can be used to configure some different options (plug-ins) for the doughnut charts.
We only need to define it once and register it, and then it can be used in both grid
components which contain a doughnut chart by specifying the centerText object and 
including some parameters in the plugins section of the options object */
const centerTextPlugin = {
  id: 'centerText',
  beforeDraw: function(chart) {
    const centerText = chart.options.plugins.centerText;
    if (centerText && centerText.display) {
      const width = chart.width;
      const height = chart.height;
      const ctx = chart.ctx;
      ctx.restore();
      const fontSize = (height / 150).toFixed(2); // Adjusted size to make it slightly smaller
      ctx.font = `bold ${fontSize}em sans-serif`;
      ctx.textBaseline = 'middle';
      ctx.fillStyle = centerText.color; // Use the color specified in the options

      const text = `$${centerText.text}`;
      const textX = Math.round((width - ctx.measureText(text).width) / 2);
      const textY = height / 2;

      ctx.fillText(text, textX, textY);
      ctx.save();
    }
  }
};

// Register the custom plugin
ChartJS.register(centerTextPlugin);



export default function PieOne() {

  //destructure the data global state variables
  const { userData, setUserData } = useAuth();
  const { selectedMonth, setSelectedMonth } = useAuth();
  
  
  
  // Initialize variables
  let Income = {};
  let Expenditure = {};
  let result = {};

  Income = userData.Income || {};
  Expenditure = userData.Expenditure || {};
  result = userData;

  // Calculate the total income and total expenditure
  let total_inc = Object.values(Income).reduce((acc, value) => acc + value, 0);
  let total_exp = Object.values(Expenditure).reduce((acc, value) => acc + value, 0);
  total_inc = total_inc.toFixed(2);
  total_exp = total_exp.toFixed(2);

  // Prepare data for doughnut chart 
  const doughData_1 = result ? {
    labels: [...Object.keys(result.Income)],
    datasets: [
      {
        data: [...Object.values(result.Income)],
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#FF6384', '#36A2EB', '#FFCE56', // Add more colors as needed
        ],
        hoverBackgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#FF6384', '#36A2EB', '#FFCE56', // Add more hover colors as needed
        ],
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
        text: total_inc,  // Display total income in the center
        color: 'green' // Set the color to red for expenditure
      }
    },
  };

  

  

  return (
    <Container>
      <h5>Income</h5>
      <Doughnut data={doughData_1} options={doughnutOptions} />
    </Container>
  );
}

// Styled component for the container div
const Container = styled.div`
  margin: 0px; // narrow margins
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 10px;
`;
