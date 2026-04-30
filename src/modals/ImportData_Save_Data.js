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
    handleDataSubmit,
    prevInstruction
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

    //helper function which examines the current state object and returns the modal ID which needs to be rendered based on the state
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
                
                //if the fetch was successful, the server route will send a json object containing the 
                // inserted transactions and a message. the isDataSubmitted state will be set to T to
                // render the success component. If there was a server error, the saveModalState will
                //be set to render modal 4. Note that since the action we perform in this case is the same
                //as the next, we can let this case "fall through" to case 2. Now the handleDataSubmit() function
                //always returns an obj. Either { success: false, prevInstruction : instruction } or { success: true, result }

            case 2:
                //if T it means user clicked 'Append' to insert the new data onto the previously submitted data
                //in which case we need to send the server the transactions with the instruction to also insert
                const returnObj = await handleDataSubmit(INSERT);
                setLoading(false);
                //if the fetch was successful, the server will send the json response to display the success component.
                //handleSubmit will reset the modal state
                //if there was a server error then handleDataSubmit will set the state obj to display modal 4
                //note that in this case newSubmit will still be false
                break;
            case 3:
                //if T it means user clicked the 'Try Again' button in Modal 3 after an error occurred in preSubmitCheck() fetch
                // in this case we need to call the function again. It will run and check the db and update the state obj
                // to render modals 1, 2, or 3, depending on the result (newSubmission and error)
                await preSubmitCheck();
                setLoading(false);
                break;
            case 4:
                //if T it means user clicked the 'Try Again' button in modal 4 after an error occurred in handleDataSubmit().
                //in this case we need to call the function again and pass it the instruction param (either 'Append' or 'Overwrite')

                if(prevInstruction && prevInstruction === OVERWRITE){
                    const returnObj = await handleDataSubmit(OVERWRITE);
                    setLoading(false);
                }else{
                    if(prevInstruction && prevInstruction === ADD_TO){
                        const returnObj = await handleDataSubmit(ADD_TO);
                        setLoading(false);
                    }
                }
                //in either case, handleSubmit() resets the modal state in the event of a successful fetch. Else the values persist
                break;
            default:

        }

    }

    async function handleDanger(modState){ //modState is a copy of state not state itself
        
        switch(returnCase(modState)){
            case 1:
                
                //if T it means modal 1 was rendered (which prompts user to insert their transactions- no prev submissions) and 
                // user clicked 'Cancel' in modal 1  in which case we need to simply close the modal (reset the modal state)
                // case falls through to case 4 code block since the action is the same in cases 1, 3, and 4
                /* 
                    If you simply close the modal without refreshing the page (window.location.reload()) or clearing your data arrays, 
                    the app will remain in its current state. The user can click the button, the handleDataSubmit function will fire, 
                    the fetch will re-verify the status with the server, and the modal will pop up again—exactly like the first time.
                */
                
                
            case 3:
                //if T it means modal 3 was rendered which is displayed when the fetch in 
                // preSubmit() returns an error after the user clicks the 'Save Budget Data' button or clicks 'Try again' button when 
                // this modal (3) is re-rendered- and user clicked 'Cancel' button. In this case, once again we simply close the modal
                
            case 4:
                //if T it means modal 4 was rendered which is displayed when user clicked 'Confirm' in modal 1, 'Append' or 'Overwrite'
                // in modal 2, or 'Try Again' in modal 4, and the fetch in handleDataSubmit() returned an error. In these cases, once
                //again, we just close the modal (by resetting its state)
                setSaveModalState(initialState);
                
                break;
            case 2:
                //this is the only unique case. If T it means modal 2 was rendered after a successful preSubmitCheck which 
                //returned { newSubmission : false }, and the user clicked the 'Overwrite' button. In this case we need to
                // call handleDataSubmit and instruct it to overwrite the previously submitted data
                const returnObj = await handleDataSubmit(OVERWRITE);
                setLoading(false);

                //handleDataSubmit will either 1-return a success object and reset the modal state to close the modal and 
                //display the success component, or 2- return a fail object and set the modal state to render modal 4 again
                
                break;
            default:

        };


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