import { useEffect, useState } from 'react';
import { Button, Modal, ModalBody, ModalHeader,ModalFooter, Spinner} from 'reactstrap';

/* 
    The state object defined in the parent (ImportData) and passed into this component contains the following properties:
    
    const[saveModalState, setSaveModalState] = useState({
        responseErr : "",  // if truthy (an error message has been assigned) which will open a custom error modal('Try Again'/'Cancel')
        newSubmit : true,     // this valus is used to open either a confirm modal ('Confirm'/'Cancel') or a ('Delete'/'Overwrite') modal 
        openModal: false,     // this value controls whether the modal is open or closed
        handleSubmitErr: ""  
    });


*/


export default function SaveModal({
    saveModalState, 
    setSaveModalState,
    saveDataToggle,
    preSubmitCheck,
    handleDataSubmit
}){

    //local state variables which will store the modal elements
    const [header, setHeader] = useState("");
    const [body, setBody] = useState("");
    const [successButton, setSuccessButton] = useState("");
    const [dangerButton, setDangerButton] = useState("");
    const [loading, setLoading] = useState(false);

    const ERROR_HEADER = "ERROR";
    const REGULAR_HEADER = "Confirm Action";
    
    const CONFIRM_BODY = "Confirm Action: Saving Transactions to database";
    const DEL_OVERWRITE_BODY = "You have previously saved transactions this month. Would you like to add to existing transactions or overwrite them?"
    const ERROR_BODY = "An error occurred saving data.";

    const ERR_SUCCESS = "Try Again";
    const CANCEL = "Cancel";
    const CONFIRM = "Confirm";
    const OVERWRITE = "Overwrite";
    const ADD_TO = "Append";
    const INSERT = "Insert";

    const initialState = {
        responseErr : "",  
        newSubmit : true,     
        openModal: false,
        handleSubmitErr: ""        
    };

    //helper function
    function returnCase(obj){
        if(obj.responseErr){
            if(obj.handleSubmitErr){
                return 4;
            }
            return 3;
        }else{
            if(!obj.newSubmit){
                return 2;
            }
            return 1;
        }
    }

    

    //component useEffect hook function with cleanup
    //function will run everytime the SaveModal component is called to be rendered, and also whenever saveModalState object changes
    //the side effect it will perform is to dynamically assign modal content based on the saveModalState(e.g. Modal Header, Body, Buttons)
    useEffect(() => {
        if(saveModalState.responseErr){
            setHeader(ERROR_HEADER);
            setBody(ERROR_BODY);
            setSuccessButton(ERR_SUCCESS);
            setDangerButton(CANCEL);
            

        } else{
            if(saveModalState.newSubmit){
                setHeader(REGULAR_HEADER);
                setBody(CONFIRM_BODY);
                setSuccessButton(CONFIRM);
                setDangerButton(CANCEL);
                
            } else{
                setHeader(REGULAR_HEADER);
                setBody(DEL_OVERWRITE_BODY);
                setSuccessButton(ADD_TO);
                setDangerButton(OVERWRITE);
                
            }
        }
    }, [saveModalState]);

    

    async function handleSuccess(modState){ //modState is a copy of state not state itself
        
        //render the loading... message
        setLoading(true);
        switch(returnCase(modState)){
            case 1:
                
                //if T it means user clicked confirm to submit data (no prev submissions)
                //in which case we need to simply send the server the (new) transactions to simply insert
                await handleDataSubmit(INSERT);
                setLoading(false);

                break;
            case 2:
                //code block
                break;
            case 3:
                //code block
                break;
            case 4:
                //code block
                break;
            default:



        }

        if(modState.responseErr){
            // "Try Again"

            if(modState.handleSubmitErr){
                //call handleDataSubmit() to try again in the event of a server Err from the /save_budget_data route
                if(modState.newSubmit){
                    //"Confirm" button
                    // here we need to perform the POST request, sending the server the (new) transactions to simply insert
                    await handleDataSubmit(INSERT);
                    //display the error modal in the case of a server error (else a success component is rendered)
                    setLoading(false);
                
                } else{

                    if(!newSubmit){
                        //if !newSubmit it means the user clicked to Overwrite and there was a server error
                        //in which case we need the 'Try Again' button needs to send the 'Overwrite instruction'
                        await handleDataSubmit(OVERWRITE);
                        setLoading(false);

                    } else{
                        //otherwise it means the user has clicked the 'Confirm' button and there was a server error
                        // in which case we need to tell handleData Submit to 'Append'
                        
                        await handleDataSubmit(ADD_TO);
                        //display the error modal in the case of a server error (else a success component is rendered)
                        setLoading(false);

                    }
                    
                }
            }else{
                //call the preSubmitCheck function again, effectively creating a while loop
                await preSubmitCheck();
                setLoading(false); //display one of 3 modals depending on the response

                //explicitly reset the state obj to initialised state (closes modal)
                //setSaveModalState(initialState);
            }
            

        } else{
            if(modState.newSubmit){
                //"Confirm" button
                // here we need to perform the POST request, sending the server the (new) transactions to simply insert
                await handleDataSubmit(INSERT);
                //display the error modal in the case of a server error (else a success component is rendered)
                setLoading(false);
                
            } else{
                // "Append" button
                // here we need to perform the POST request, sending the server the additional trans (and an instruction to append)
                await handleDataSubmit(ADD_TO);
                //display the error modal in the case of a server error (else a success component is rendered)
                setLoading(false);
            }
        }
        
        // Close the modal after the action is triggered
        //setSaveModalState(prev => ({ ...prev, openModal: false }));

    }

    async function handleDanger(modState){ //modState is a copy of state not state itself
        
        //render the loading... message
        setLoading(true);

        if(!modState.newSubmit){
            //if True it means the 'Append/Overwrite' modal was rendered and the user clicked the 'OverWrite' button
            // in which case we need to call the server route and send it the 'Overwrite' instruction, 
            // then handle the server response
            /*
                initialState = {
                    openModal: true,
                    responseErr: "",
                    handleSubmitErr: false,
                    newSubmit: false
                }

            */
            await handleDataSubmit(OVERWRITE);
            //the server will either send back a success object containing the inserted rows, 
            // in which case the state obj is reset and the modal closes.
            // if the server encounters an error, handleDataSubmit will update the state to the following:
            /*
                setSaveModalState((prevState) => ({
                    ...prevState,  //newSubmit wil be false, openModal will be true
                    responseErr: true,
                    handleSubmitErr: true
                    
                })) 
            */
            //this should render the 'Try Again'/'Cancel' modal
            

        }else{
            //if T it means the user has clicked the 'Cancel' button in either the 'Try Again'/'Cancel' modal or the 'Confirm'/'Cancel'
            // in either case we simply need to close the modal and reset the state
            setSaveModalState(initialState);

        }


        // Close the modal after the action is triggered
        //setSaveModalState(prev => ({ ...prev, openModal: false }));

    }


    //Modal JSX: this modal needs to render one of three sets of JSX (depending on the value of the responseErr and newSubmit object properties)
    //Alternatively, it may be more efficient to return a single set of JSX and conditionally render the Buttons and <p> message using embedded JS
    
    return(
        <div> 
            <Modal isOpen={saveModalState.openModal} toggle={saveDataToggle}>
                {/* Modal Header */}
                {   loading ? 
                        <ModalHeader saveDataToggle={saveDataToggle}>Please Wait</ModalHeader> : 
                        <ModalHeader saveDataToggle={saveDataToggle}>{header}</ModalHeader>
                }
                {/* Modal Body */}
                {
                    loading ? 
                        <ModalBody>
                            <p>Performing operation....</p>
                            <Spinner
                                color="primary"
                                style={{
                                height: '3rem',
                                width: '3rem'
                                }}
                            >
                                Loading...
                            </Spinner>
                        </ModalBody> :
                        <ModalBody>
                            {body}
                            <br />
                            {
                                saveModalState.responseErr && (
                                    <em>{saveModalState.responseErr}</em>
                                )
                            }
                        </ModalBody>
                }
                {/* Modal Footer */}
                {
                    !loading && (
                        <ModalFooter>
                            <Button color="success" onClick={()=> handleSuccess(saveModalState)}
                            >
                                {successButton}
                            </Button>
                            <Button color="danger" onClick={(e) => {

                                //stop the dropdown and submenu from closing
                                e.preventDefault(); 
                                e.stopPropagation(); 

                                //close modal
                                saveDataToggle();

                                // reset state
                            }}
                            >
                                {dangerButton}
                            </Button>
                        </ModalFooter>

                    )
                }
            </Modal>
        </div>
    );
}