import React from 'react';
import { Routes, Route } from 'react-router-dom'; // ✅ No BrowserRouter
import './styles/App.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import MyAppNavbar from './components/MyAppNavBar';
import Landing from './pages/Landing';
import ImportCSV from './pages/ImportCSV';
import ImportData from './pages/ImportData';
import Worksheet from './pages/Worksheet';
import Home from './pages/Home';
import TaxTool from './pages/TaxTool';
import BudgetTool from './pages/BudgetTool';
import GivingTool from './pages/GivingTool.js';
import { useAuth } from './components/AuthContext.js';



function App() 
{
  const { authenticated } = useAuth(); // or get it from props/context
  
  return (
    <>
      {authenticated && <MyAppNavbar />} {/* conditionally render Navbar */}
      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/worksheet" element={<Worksheet/>}/>
        <Route path="/import_data" element={<ImportData/>}/>
        <Route path="/budget_tool" element={<BudgetTool/>}/>
        <Route path="/tax_tool" element={<TaxTool/>}/>
        <Route path="/giving_tool" element={<GivingTool/>}/>
        <Route path="/my_budget" element={<ImportCSV/>}/> 
      </Routes>
    </>
  );
}

export default App;



