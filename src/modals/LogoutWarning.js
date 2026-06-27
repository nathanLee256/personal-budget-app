import { useEffect, useState } from 'react';
import { Button, Modal, ModalBody, ModalHeader,ModalFooter, Spinner} from 'reactstrap';

export default function LogoutWarning({
    isOpen, 
    setLogoutWarning, 
    warningModalToggle
}){
    //Continue handler function
    function handleSuccess(){
        //execute a fetch request to the server to obtain a new jwt in the same way as we user in
        warningModalToggle(); //close modal
        //reset modal state
        setLogoutWarning(false);
    }

    //Cancel handler function
    function handleDanger(){
        //log user out now before token expires
        // we don't want a situation where the user ignores warning, keeps working and is logged out when jwt expires
        //insert code to logout first before closing modal and resetting state
        warningModalToggle(); //close modal
        setLogoutWarning(false);
        
    }

    return(
        <div>
            <Modal isOpen={isOpen} toggle={warningModalToggle}>
                {/* Modal Header */}
                <ModalHeader toggle={warningModalToggle}>Warning</ModalHeader>
                <ModalBody>
                Your session is about to expire. Continue working?
                </ModalBody>
                <ModalFooter>
                    <Button color="success" onClick={()=> handleSuccess()}>
                        Continue
                    </Button>
                    <Button color="danger" onClick={()=> handleDanger()}>
                        Logout
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );

}