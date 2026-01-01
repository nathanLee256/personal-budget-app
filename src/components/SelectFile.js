import styled from 'styled-components';
import { Button } from 'reactstrap';


/* This component is called from within ImportData. It:
-prompts user to select a year, month, and week
-prompts them to upload a .csv file which contains bank transactions for the selected period (year, month, week) 
-prompts them to submit said file which triggers a POST request that results in the userData state array of data objects
(representing a row of transaction data) being updated, which can then be displayed in the table of the parent component*/


//first receive the props and assign them to variables
export default function SelectFile({
    yearLabels, setYearLabels,
    selectedMonth, setSelectedMonth,
    selectedYear, setSelectedYear,
    file, setFile,
    userData, setUserData
}){


    // START DEFINE constants for years, months, weeks, and the category map

        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

    //END DEFINE

    //START EVENT HANDLERS
        

        const handleYearChange = (e) => {
            setSelectedYear(e.target.value);
            setSelectedMonth("");
        };

        
        const handleMonthChange = (e) => setSelectedMonth(e.target.value);
        const handleFileChange = (e) => setFile(e.target.files[0]);
        
        
        const handleFileUpload = () => {
            document.getElementById('fileInput').click();
        };



        const handleSubmit = async (e) => {
            const url = "http://localhost:3001/import_data/upload_2";
            e.preventDefault();
            if (file) {
                const formData = new FormData();
                formData.append('file', file);
                try {
                    const response = await fetch(url, { method: 'POST', body: formData });
                    const result = await response.json();
                    console.log('File uploaded successfully', result);
                    setUserData(result);
                } catch (error) {
                    console.error('Error uploading file', error);
                }
            }
        };

    //END EVENT HANDLERS

    //JSX
    return(
        <SubWrapper>
            <StyledContainer>
                <AgThemeBalham>
                    <h1>Import .csv File</h1>
                    <LargeText>
                        This page allows you to import a .csv file which represents the list of transactions 📝 from your spendings
                        bank account, for the specified period. You can choose to do this once a month, or once a week, according
                        to your preference. Most online banking websites allows users to export their transactions as a .csv file
                        by clicking the 'Export' option from the page where you view a list of your transactions for a specified 
                        period. Click below to view a demonstration. Once you have exported the file from your online banking site,
                        save it to a dedicated location in your file system on your pc 💻. Then, when prompted, navigate to this location
                        and import the file by selecting it and clicking the 'Import' button at the bottom of the screen. This will 
                        the full list of your transactions for the specified period, and prompt you to select an item to categorise
                        each transaction. The purpose of doing this is two-fold. Firstly, after categorising your transactions each 
                        month, you will begin to accumulate accurate data about how much you earn/spend for each of your budget items.
                        This will allow you to change the amount you entered in the Worksheet page (for how much you earn/spend in a 
                        certain category) as more data becomes available. By doing so your budget becomes far more precise 🎯 and you will
                        gain a much clearer picture 💡 of where you actually stand 📊. Secondly, going through your transactions each month is 
                        useful for acquiring a deeper understanding about your spending habits, often revealing areas of wastefulness ❌
                        which can be easily corrected ✅ 🔥 🚀. 
                    </LargeText>
                    <LargeText>Click here to import .csv file</LargeText>
                    <OutlineContainer> 
                        <DropdownWrapper>
                            <label htmlFor="year">Select Year:</label>
                            <select id="year" value={selectedYear} onChange={handleYearChange}>
                                <option value="">--Select Year--</option>
                                {yearLabels.map((year) => (
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
                            <Button color="info" style={{ width: '200px ' }} onClick={handleFileUpload}>
                                Upload .csv File
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
                        <Button color="info" style={{ width: '200px ' }} onClick={handleSubmit}>
                            Submit
                        </Button>
                    </OutlineContainer>
                </AgThemeBalham>
            </StyledContainer>
        </SubWrapper>
    );
}

const LargeText = styled.p`
    font-size: 1.2rem; // Standard font size
    line-height: 1.5; // Standard line height
    font-weight: normal; // Normal font weight
    color: #333; // Standard text color
    margin: 1rem 0; // Standard margin
    text-align: left;
`;

const OutlineContainer = styled.div`
    outline: 1px solid black;
`

const StyledContainer = styled.div`
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    padding-left: 15px;
    padding-right: 15px;
    @media (min-width: 576px) {
        max-width: 540px;
    }
    @media (min-width: 768px) {
        max-width: 720px;
    }
    @media (min-width: 992px) {
        max-width: 960px;
    }
    @media (min-width: 1200px) {
        max-width: 1140px;
    }
    @media (min-width: 1400px) {
        max-width: 1320px;
    }
`;

const AgThemeBalham = styled.div.attrs(() => ({
    className: 'ag-theme-balham',
  }))`
  
`;
  
const SubWrapper = styled.div`
    background-color: #f5f5f5;
    min-height: 100vh;
    padding-top: 80px;
    outline: 1px solid black;
    padding-bottom: 120px;
`;

const DropdownWrapper = styled.div`
    margin: 20px 0;
    label {
        margin-right: 10px;
    }
    select {
        padding: 5px;
    }
    outline: 1px solid black;
`;

const FileUploadWrapper = styled.div`
    margin: 20px 0;
    outline: 1px solid black;
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