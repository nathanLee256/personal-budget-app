// AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';


const AuthContext = createContext();

/* This component uses the Context API which allows me to create a context for the application and provide it at the top level, 
making the state accessible to any child component that needs it. In other words if I declare state variables
and their respective setState() functions within this component, I can then access them globally within every 
application component by simply destructuring the them at the top of the child component I want to use them in.
The syntax to do that is :
const { authenticated, setAuthenticated, token, setToken } = useContext(AuthContext); 
 This useContext feature of React allows me to avoid having to pass state variables
 declared in the top-level component all the way down through multiple components using props (prop-drilling). 
 This means that the useEffect hook which checks if a user has a valid jwt stored in local storage every 5 minutes 
 needs to be declared in App.js. If you define the useEffect in the App.js component, it will run when the App 
 component mounts and whenever its dependencies change. If the authentication and token state variables are managed 
 in App.js and passed down via context, this can centralize your authentication logic.*/

const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [chooseLogin, setChooseLogin] = useState(false);
  const [chooseRegister, setChooseRegister] = useState(false);
  const [transactions, setTransactions] = useState([]);     //array of data objects representing the user's transactions for a selected month
  const [userId, setUserId] = useState(null); // state to store user_id
  const [userData, setUserData] = useState(null);

  /* budgetItems is a state object which is initialised with the user's current budget items and used to
  populate the dropdown menu in ImportData */
  const[budgetItems, setBudgetItems] = useState({});

  //create an instance of the navigate()
  const navigate = useNavigate();

  // This is a global useEffect which will will run once when AuthProvider mounts and manage the global authentication 
  //state and side effects.checks that a valid jwt is stored in localStorage. Then it executes a callback function which runs every 
  // 5 minutes and checks the token is still present and valid, logging out the user by props.setAuth() if 
  // their token has expired  and refreshing the page.
  useEffect(() => {

    const checkTokenValidity = () => {
        //first we check local storage for a jwt
        const activeToken = localStorage.getItem('token');
        const activeExpiration = localStorage.getItem('tokenExpiration');
        const storedUserId = localStorage.getItem('userId');
        const now = new Date().getTime();

        console.log("Checking token validity...");
        console.log("Current Time:", now);
        console.log("Stored Token Expiration:", activeExpiration);

        if (!activeToken || (activeExpiration && parseInt(activeExpiration) < now)) {
          /* if this block runs it means either no jwt was found or an expired one was found */
            console.log("Token expired or missing, logging out...");
            localStorage.removeItem('token');
            localStorage.removeItem('tokenExpiration');
            localStorage.removeItem('userID');

            if (authenticated) { // ✅if this block runs it means that a jwt was found but it is expired
              // in this event the user needs to be logged out by setting authenticated to false
                setAuthenticated(false);
                setUserId(null);
                window.location.reload();
                navigate("/", {replace: true});
            }
        } else if (!authenticated) { // ✅ Only set authenticated if it’s false
          /* If this block runs it means the user has a valid and current jwt found in local storage 
          In this event the user needs to be logged in when the app first mounts(user directed to Home page not Landing page)*/
            console.log("Token is still valid.");
            setAuthenticated(true);
            setToken(activeToken);
            if (storedUserId) {  
              setUserId(storedUserId); // ✅ Restore userId from localStorage
            }

            /* and then the user needs to be either directed to Home page, or taken to the current page with the state preserved
            (in the event of a page refresh) */
            let currentPage = window.location.pathname;

            if(currentPage === "/"){
              navigate("/home", {replace: true});
            };
            
            
        }
    };

    checkTokenValidity(); // ✅ Check once on mount

    // ✅ Only set up interval if the user is authenticated
    /* In the event that a valid jwt was found in local storage, we set up a setTimeout() to
    periodically call the checkTokenValidity() function to check the jwt is still valid (within its expiry date) */
    let checkTokenInterval;
    if (localStorage.getItem("token")) {
        checkTokenInterval = setInterval(() => {
            console.log("Checking token at interval...");
            checkTokenValidity();
        }, 300000); // 5-minute interval
    }

    /* and finally we define a cleanup function 
    When useEffect returns a function, that function acts as a cleanup function which runs a) before the component unmounts 
    or b) before the effect runs again (if the dependencies change). In this case the useEffect is contained within an application-level
    component, which doesn't technically unmount. But in the event that an authenticated user is logged out
    clearInterval() stops the repeating interval that was set using setInterval(), before the useEffect code runs again
    (to prevent SetTimeout() functions from accumulating)*/
    return () => {
        if (checkTokenInterval) {
            clearInterval(checkTokenInterval);
        }
    };
  }, [authenticated]); // ✅ Runs when authentication status changes

  /*  
  perform a fetch request to the server to retrieve the user's budget items stored in the current_budget_items table.
  The values from the item_name column will be used to  */
  useEffect(() => {
    if(!userId) return; //early exit the function is userId is falsey

    //this code runs if userId has been assigned a value
    const url = `http://localhost:3001/worksheet/retrieve_items?UserId=${userId}`; // use the same server route as in Worksheet (it does the same thing)

    // Perform the GET request
    fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      },
    })

      // set up the Promise chain
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })

      .then(data => {
        /* instead of iterating over object and extracting arrays from the level-3 properties, we will remove the userId
        property then copy the object*/

        if(data.IsUserData == true){ 
          delete data.IsUserData;
          console.log("BudgetItems object:", data);
          setBudgetItems(data);
        }
      })

      .catch(error => {
        console.error("Error:", error);
      });
  },[userId]); // runs once when the app mounts, then again whenever userId is assigned a value

  

  
  
  const contextValue = {
    authenticated, setAuthenticated,
    token, setToken,
    userId, setUserId,
    chooseLogin, setChooseLogin,
    chooseRegister, setChooseRegister,
    transactions, setTransactions,
    budgetItems, setBudgetItems,
    userData, setUserData
  };



  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom Hook - Place after AuthProvider
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
