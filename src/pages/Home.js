
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import React, { useContext, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Row, Col, Card, CardImg, CardBody, CardSubtitle } from 'reactstrap';
import { useAuth } from '../components/AuthContext.js';
import styled from 'styled-components';
import portfolioHero from '../assets/portfolioHero.png';
import weight_see_saw_1 from '../assets/weight_see_saw_1.jpg';
import weight_loss_1 from '../assets/weight_loss_1.png';
import weightLossFactors from '../assets/weightLossFactors.png';
import csv from '../assets/CSV.jpg';
import Tool from '../assets/tool.png';
import MyAppFooter from '../components/MyAppFooter.js';


/* Application Home page component which returns either a login, register, or menu page 
 based on the value of the state variable: authenticated. */
export default function Home(props)
{
    // destructure the global state variables
    const 
    { 
        authenticated, setAuthenticated, 
        token, setToken, 
        userId, setUserId, 
        chooseLogin, setChooseLogin,
        chooseRegister, setChooseRegister 
    } 
    = useAuth(); 
    
    //hooks
    const navigate = useNavigate();


    //button event handlers
    const handleCSVButtonClick = () => {  /* event handler for the Button on Teams Card */
        navigate('/importCSV'); 
      };
    
    const handleToolButtonClick = () => {  /* event handler for the Button on Teams Card */
        navigate('/budget_tool'); 
    };

    const handleLogout = () => {
        setAuthenticated(false);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('userID');
        setUserId(null);
        setChooseLogin(false);
        setChooseRegister(false);
        window.location.replace("/"); // ✅ Completely resets history
    };

    //useEffect to 
    useEffect(()=>{
        if(!authenticated){
            navigate("/");
        }
    },[authenticated, navigate]);

    return(
        <Wrapper>
            <HomeContainer> 
                <ImageFormatter>
                    <HeadingFormatter> 
                        <h1> Welcome!</h1>
                        <Button onClick={handleLogout} color="info">Logout</Button>
                    </HeadingFormatter>
                    
                </ImageFormatter>
            </HomeContainer>
            <SubWrapper>
                <div className='container'> 
                    <AgThemeBalham>
                        <LargeText>
                            Budgeting is similar in many respects to losing weight, which is something 
                            that is both straightforward and complex, simultaneously. 
                            Weight loss is simple in the sense that there are only two primary factors 
                            which influence it:
                        </LargeText>
                        <LargeTextList> 
                            <li>Energy Intake</li>
                            <li>Energy Expenditure</li>
                        </LargeTextList>
                        <Row style= {{outline: '2px solid blue'}}>
                            <Col sm="6">
                                <CardImg src={weight_see_saw_1} alt="see-saw" />
                            </Col>
                            <Col sm="6">
                            </Col>
                        </Row>
                        <LargeText>
                            To lose weight, a person's energy expenditure must be consistently greater 
                            than their energy intake (energy expenditure {'>'} energy intake). This is known 
                            as an energy deficit and creating one simply involves eating less and exercising 
                            more. Simple enough, right? In this case, why is it that so many people struggle 
                            with losing weight or maintaining a healthy weight? The reason is that there are 
                            many other factors (both internal and external) which influence a person's energy 
                            intake and energy expenditure.  To complicate matters, these factors are interrelated 
                            and dynamic. For example, a person over 100 kg may struggle to achieve the energy 
                            deficit needed to lose weight due to a medical condition they are taking medication 
                            for, which increases appetite. The person may also have an injury or be limited in 
                            terms of the type of physical activity they can perform. In addition, if the person 
                            has been that weight for a significant period of time their body may have developed 
                            a homeostatic 'set point', which will cause it to resist weight loss efforts by 
                            releasing hunger hormones like ghrelin. All of these factors will also decrease their 
                            intrinsic motivation which is required to adhere to an exercise regimen. Therefore, 
                            in order for this individual to successfully lose weight and maintain that healthy weight, 
                            it will be necessary for them to address many of these factors which influence energy 
                            intake and energy expenditure. This may involve seeking medical advice to change to a 
                            medication which does not increase appetite, finding a form of physical activity they 
                            are able to perform consistently, and enlisting the support of personal trainers or 
                            training partners to keep them accountable and motivated on their weight loss journey.        
                        </LargeText>
                        <Row style= {{outline: '2px solid blue'}}>
                            <Col sm="6" style= {{outline: '2px solid green'}}>
                                <CardImg 
                                    src={weight_loss_1} 
                                    alt="see-saw"
                                    style={{ width: '100%', height: '100%', objectFit: 'contain'}}
                                />
                            </Col>
                            <Col sm="6" style= {{outline: '2px solid green'}}>
                                <CardImg 
                                    src={weightLossFactors} 
                                    alt="see-saw" 
                                    style={{ width: '100%', height: '100%', objectFit: 'contain'}}
                                />                         
                            </Col>
                        </Row>
                        <LargeText>
                            Budgeting is similar to weight loss in the sense that there are only two primary 
                            factors which influence whether we are in the black or red: 
                        </LargeText>
                        <LargeTextList>
                            <li>Income</li>
                            <li>Expenditure</li>
                        </LargeTextList>
                        <LargeText>
                            In other words, achieving a budget surplus is as simple as consistently spending less 
                            than we earn. However, as with weight loss, there are many interrelated and dynamic 
                            factors which influence income/expenditure and which should be addressed to reach one's 
                            financial goals. This is the purpose of this application. It has been developed to 
                            simplify the budgeting process so you can see exactly where your money is going, which 
                            will enable you to pinpoint areas of wasteful spending, and help you develop ideas for 
                            creating additional income streams. To begin, click below to import your monthly bank 
                            statement .csv file, or go to the personal budget online calculator. 
                        </LargeText>
                        <Row style= {{outline: '2px solid blue'}}>
                            <Col sm="6" style= {{outline: '2px solid green'}}>
                                <Card color='light' style={{  height: '500px' }}> {/* start card 1 */}
                                    <CardImg src={csv} alt="CSV Image" style={{  height: '350px' }}/>
                                    <CardBodyStyled>
                                        <h2>Import CSV File</h2>
                                    <CardSubtitle
                                    className="mb-2 text-muted"
                                    tag="h6"
                                    >Import bank transactions .csv file.
                                    </CardSubtitle>
                                    <Button
                                        color="info"
                                        style={{ width: '200px '}}
                                        onClick={handleCSVButtonClick}
                                    >Import CSV                        
                                    </Button>
                                    </CardBodyStyled>
                                </Card> {/* end card 1 */}
                            </Col>
                            <Col sm="6" style= {{outline: '2px solid green'}}>
                                <Card color='light' style={{  height: '500px' }}> {/* start card 1 */}
                                    <CardImg src={Tool} alt="Tool Image" style={{  height: '350px' }}/>
                                    <CardBodyStyled>
                                        <h2>Budget Tool</h2>
                                    <CardSubtitle
                                        className="mb-2 text-muted"
                                        tag="h6"
                                    >Use Planning Tool to Create Budget.
                                    </CardSubtitle>
                                    <Button
                                        color="info"
                                        style={{ width: '200px '}}
                                        onClick={handleToolButtonClick}
                                    >Create Budget                        
                                    </Button>
                                    </CardBodyStyled>
                                </Card> {/* end card 1 */}                        
                            </Col>
                        </Row>  
                    </AgThemeBalham>
                </div>  {/* end card deck */}
            </SubWrapper>
            <MyAppFooter></MyAppFooter> {/* Manually add the footer to keep it at the bottom */}
        </Wrapper>
    );
}
/* formats the page text */
const LargeText = styled.p`
  font-size: 1.2rem; // Standard font size
  line-height: 1.5; // Standard line height
  font-weight: normal; // Normal font weight
  color: #333; // Standard text color
  margin: 1rem 0; // Standard margin
  outline: 2px solid purple;
  
`;
/* formats the <ol> list */
const LargeTextList = styled.ol`
  font-size: 1.2rem; // Same as LargeText
  line-height: 1.5; // Same as LargeText
  font-weight: normal; // Same as LargeText
  color: #333; // Same as LargeText
  margin: 1rem 0; // Same as LargeText
  

  li {
    margin-bottom: 0.5rem; // Adjust the margin as needed
  }
`;

const LoginContainer = styled.div`
    margin: 30px;
    display: block;
`;

const RegisterContainer = styled.div`
    padding-top: 30px;
    display: block;
    margin-bottom: 10px;
`;

const Wrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    min-height: 100%;
    outline: 2px solid black; 
`;

const HomeContainer = styled.div`
    height: 100vh; /* Set the height of the Home component to the height of the viewport */
    display: flex; /* Use flexbox to center the hero image vertically and horizontally */
    justify-content: center;
    align-items: center;
    outline: 2px solid black;
`;

const ImageFormatter = styled.div` 
    background-image:  url(${portfolioHero}); /* Set the background image of the hero section */
    background-size: cover; /* Make sure the image covers the entire section */
    background-position: center center; /* Center the image vertically and horizontally */
    height: 100%; /* Set the height of the hero section to 100% of its parent element */
    width: 100%;
    display: flex; /* Use flexbox to center the text inside the hero section */
    justify-content: left;
    align-items: left;
    flex-direction: column;
    color: #fff; /* Set the color of the text to white */
    text-align: left; /* Center the text horizontally */
    padding-top: 100px;
`;
const HeadingFormatter = styled.div`
    padding-top: 20px;
    margin: 30px;
`;

const HeroText =styled.h1`
    color: white;
    top:5;
    text-align: center;
    font-weight: 1000;
    justify-content: center;
    align-items: center;
    font-size: 2.5rem;
    font-family: 'Bebas Neue', sans-serif;
    font-weight: bold;
    text-shadow: 4px 4px 4px rgb(18, 18, 18);
    padding-top: 80px;
`;

const SubWrapper = styled.div`
    background-color: #f5f5f5; /* Replace with your desired background color */
    min-height: 100vh;
    outline: 2px solid black;
    flex: 1;
    padding-bottom: 50px;
`;


const AgThemeBalham = styled.div.attrs(() => ({
    className: 'ag-theme-balham',
  }))`
    padding-top: 20px;
    padding-bottom: 40px;
    outline: 2px solid red;
    /* You can add additional styles here if needed */
`;

const CardBodyStyled = styled(CardBody)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100% - 350px); /* Subtract the height of the image */
  padding: 20px; /* Adjust padding as needed */
`;
