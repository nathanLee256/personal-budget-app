import { useEffect, useState } from 'react';
import { Button, Modal, ModalBody, ModalHeader,ModalFooter, Spinner} from 'reactstrap';

/* 
    The state object defined in the parent (ImportData) and passed into this component contains the following properties:
    
    const[saveModalState, setSaveModalState] = useState({
        responseErr : "",  // if truthy (an error message has been assigned) which will open a custom error modal('Try Again'/'Cancel')
        newSubmit : true,     // this valus is used to open either a confirm modal ('Confirm'/'Cancel') or a ('Delete'/'Overwrite') modal 
        openModal: false,     // this value controls whether the modal is open or closed  
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
    };

    

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

        if(modState.responseErr){
            // "Try Again"

            //call the preSubmitCheck function again, effectively creating a while loop
            await preSubmitCheck();
            setLoading(false); //display one of 3 modals depending on the response

            //explicitly reset the state obj to initialised state (closes modal)
            setSaveModalState(initialState);
            

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
                await handleDataSubmit(INSERT);
                //display the error modal in the case of a server error (else a success component is rendered)
                setLoading(false);
            }
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