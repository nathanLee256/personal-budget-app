import { useEffect, useState } from 'react';
import { Button, Modal, ModalBody, ModalHeader,ModalFooter, UncontrolledCollapse} from 'reactstrap';

/* 
    The state object defined in the parent (ImportData) and passed into this component contains the following properties:
    
    const[saveModalState, setSaveModalState] = useState({
        responseErr : "",  // if truthy (an error message has been assigned) which will open a custom error modal('Try Again'/'Cancel')
        newSubmit : true,     // this valus is used to open either a confirm modal ('Confirm'/'Cancel') or a ('Delete'/'Overwrite') modal 
        openModal: false,     // this value controls whether the modal is open or closed  
    });


*/


export default function SaveModal({
    saveModalState, setSaveModalState
}){

    //local state variable which will store the modal body string
    const [header, setHeader] = useState("");
    const [body, setBody] = useState("");
    const [successButton, setSuccessButton] = useState("");
    const [dangerButton, setDangerButton] = useState("");

    const ERROR_HEADER = "ERROR";
    const REGULAR_HEADER = "Confirm Action";
    
    const CONFIRM_BODY = "Confirm Action: Saving Transactions to database";
    const DEL_OVERWRITE_BODY = "You have previously saved transactions this month. Would you like to add to existing transactions or overwrite them?"
    const ERROR_BODY = "An error occurred saving data.";

    const ERR_SUCCESS = "Try Again";
    const CANCEL = "Cancel";
    const CONFIRM = "Confirm";
    const OVERWRITE = "Overwrite";
    const ADD_TO = "Add to";

    // toggle function which is called to open/close modal
    const saveDataToggle = () => setSaveModalState((prevState) => ({
        ...prevState, //preserve the other object properties
        openModal : !prevState.openModal // reverse the openModal bool to open/close modal
    }));

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





    //Modal JSX: this modal needs to render one of three sets of JSX (depending on the value of the responseErr and newSubmit object properties)
    //Alternatively, it may be more efficient to return a single set of JSX and conditionally render the Buttons and <p> message using embedded JS
    
    return(
        <div> 
          <Modal isOpen={saveModalState.openModal} toggle={saveDataToggle}>
            <ModalHeader toggle={saveDataToggle}>{header}</ModalHeader>
                <ModalBody>
                    {body}
                    <br />
                    {
                        saveModalState.responseErr && (
                            <em>{saveModalState.responseErr}</em>
                        )
                    }
                </ModalBody>
            <ModalFooter>
              <Button color="success" onClick={(e) => {

                //stop the dropdown and submenu from closing
                e.preventDefault(); 
                e.stopPropagation(); 

                }}
              >
                {successButton}
              </Button>
              <Button color="danger" onClick={(e) => {

                //stop the dropdown and submenu from closing
                e.preventDefault(); 
                e.stopPropagation(); 

                // reset state
                
            
              }}
              >
                {dangerButton}
              </Button>
            </ModalFooter>
          </Modal>
        </div>

    );

}