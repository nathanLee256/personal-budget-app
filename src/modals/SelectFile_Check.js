import { useEffect, useState } from 'react';
import { Button, Modal, ModalBody, ModalHeader,ModalFooter} from 'reactstrap';

/* 
    The state object defined in the parent (ImportData) and passed into this component contains the following properties:
    
    const[saveModalState, setSaveModalState] = useState({
        responseErr : "",  // if truthy (an error message has been assigned) which will open a custom error modal('Try Again'/'Cancel')
        newSubmit : true,     // this valus is used to open either a confirm modal ('Confirm'/'Cancel') or a ('Delete'/'Overwrite') modal 
        openModal: false,     // this value controls whether the modal is open or closed  
    });


*/


export default function CheckModal({
    
}){





    //Modal JSX
    return(
        <div> 
            <Modal isOpen={saveModalState.openModal} toggle={saveDataToggle}>
                <ModalHeader saveDataToggle={saveDataToggle}>{header}</ModalHeader>
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

                    //close modal
                    saveDataToggle();

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