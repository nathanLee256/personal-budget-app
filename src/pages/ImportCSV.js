import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button} from 'reactstrap';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement} from 'chart.js';
import "bootstrap/dist/css/bootstrap.min.css";
import Dashboard from '../components/Dashboard.js';
import MyAppFooter from '../components/MyAppFooter';
import { useAuth } from '../components/AuthContext.js';

// Register the necessary chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

/* This page (component) prompts the user to select a month, then select 
and upload a .csv file from their file system which contains one month's 
worth of bank transactions. The .csv file is passed to the Express server, which processes the data and returns a JSON
data object that is used to populate the charts in Dashboard. */

{/* I would like to modify this component in the future so that once the user has selected and imported their 
.csv file, the component performs a fetch request to a new server route, which executes a python script that transforms 
the imported .csv file into an array of data objects (transactions), which are displayed in a table. The table will have 
additional columns (Category, Subcategory) which contain a dropdown menu which prompt the user to select a category for 
that transaction. Once the user has done this, I would also like to present a button to the user which has a route handler that
 performs another POST fetch() to the server, which takes the .csv file with class labels, loads it into a dataframe, and performs 
association mining, returning the salient association rules which are presented to the user allowing them to gain insights into 
their spending habits. This may be the function of another component called from within this <ImportCSV/>. Finally, after this
the array of data objects with class labels is sent to the server, which processes the data and returns the JSON data object 
that is displayed in the Dashboard charts. */}

export default function ImportCSV() {
  
  //destructure the data global state variable
  const { userData, setUserData } = useAuth();
  const { selectedMonth, setSelectedMonth } = useAuth(); 
  
  const [selectedYear, setSelectedYear] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const years = [2021, 2022, 2023, 2024]; // Example years
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    setSelectedMonth(""); // Reset month when year changes
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = () => {
    document.getElementById('fileInput').click();
  };

  const handleSubmit = async (e) => {
    const url = 'http://localhost:3001/upload'
    e.preventDefault(); // Prevent default form submission behavior
  
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await fetch(url, {
          method: 'POST',
          body: formData,
        });
  
        const result = await response.json();
        console.log('File uploaded successfully', result);
        // Handle the result as needed
        setUserData(result); // Store the result in the state
      } catch (error) {
        console.error('Error uploading file', error);
      }
    }
  };
  /*  if(transactions){                                     //future development-transactions is a global stae variable
        <DisplayTransacts/>                                 // this component receives the global state variable transactions
  } */


  if (userData){
    return(
      <DashWrapper>
        <Dashboard/>
        <MyAppFooter></MyAppFooter>
      </DashWrapper>

    );
  } else{
      return (
        <SubWrapper>
          <div className='container'>
            <AgThemeBalham>
              <h1>Import .csv File</h1>
              <p>Click here to import .csv file</p>
              
              <DropdownWrapper>
                <label htmlFor="year">Select Year:</label>
                <select id="year" value={selectedYear} onChange={handleYearChange}>
                  <option value="">--Select Year--</option>
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </DropdownWrapper>
    
              {selectedYear && (
                <DropdownWrapper>
                  <label htmlFor="month">Select Month:</label>
                  <select id="month" value={selectedMonth} onChange={handleMonthChange}>
                    <option value="">--Select Month--</option>
                    {months.map((month, index) => (
                      <option key={index} value={month}>{month}</option>
                    ))}
                  </select>
                </DropdownWrapper>
              )}
    
              <FileUploadWrapper>
                <Button 
                    color="info"
                    style={{ width: '200px '}}
                    onClick={handleFileUpload}
                >Upload .csv File
                </Button>
                <input
                  type="file"
                  id="fileInput"
                  accept=".csv"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                {file && <p>Selected file: {file.name}</p>}
              </FileUploadWrapper>
              <Button
                color="info"
                style={{ width: '200px '}} 
                onClick={handleSubmit}>Submit</Button>
            </AgThemeBalham>
            <GraphContainer>
            </GraphContainer>
          </div>
          <MyAppFooter></MyAppFooter>
        </SubWrapper>
      );
    }

  
  
  
  

  
};

const GraphContainer = styled.div`
  padding-top: 20px;
  padding-bottom: 40px;
  outline: 2px solid yellow;
`;

const AgThemeBalham = styled.div.attrs(() => ({
  className: 'ag-theme-balham',
}))`
  /* You can add additional styles here if needed */
  outline: 2px solid red; /* Adds a red outline of 2 pixels */
`;

const SubWrapper = styled.div`
  background-color: #f5f5f5; // light grey
  min-height: 100vh; // specifies that element will automatically adjust its height to allow its 
  // content to be displayed correctly
  padding-top: 80px; // allows some room at the top for the nav
  outline: 2px solid blue; 
`;
const DashWrapper = styled.div`
  background-color: #f5f5f5; /* Replace with your desired background color */
  min-height: 100vh;
  padding-top: 50px;
  outline: 2px solid blue; /* Adds a red outline of 2 pixels */
`;

const DropdownWrapper = styled.div`
  margin: 20px 0;
  label {
    margin-right: 10px;
  }
  select {
    padding: 5px;
  }
  outline: 2px solid purple; /* Adds a red outline of 2 pixels */
`;

const FileUploadWrapper = styled.div`
  margin: 20px 0;
  outline: 2px solid green; /* Adds a red outline of 2 pixels */
  button {
    padding: 10px 20px;
    color: black;
    border: none;
    cursor: pointer;
    &:hover {
      background-color: #0056b3;
    }
  }
  input {
    display: none;
  }
  p {
    margin-top: 10px;
  }
`;
