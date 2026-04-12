import styled from 'styled-components';
import { Modal, ModalBody, ModalHeader,ModalFooter, UncontrolledCollapse} from 'reactstrap';

/* 
    The state object defined in the parent (ImportData) and passed into this component contains the following properties:
    
    const[saveModalState, setSaveModalState] = useState({
        responseErr : false,  // if T, opens a custom error modal in the event that !response.ok ('Try Again'/'Cancel')
        newSubmit : true,     // this valus is used to open either a confirm modal ('Confirm'/'Cancel') or a ('Delete'/'Overwrite') modal 
        openModal: false,     // this value controls whether the modal is open or closed  
    });


*/


export default function SaveModal({
    saveModalState, setSaveModalState
}){
    // toggle function which is called to open/close modal
    const saveDataToggle = () => setSaveModalState((prevState) => ({
        ...prevState, //preserve the other object properties
        openModal : !prevState.openModal // reverse the openModal bool to open/close modal
    }));





    //Modal JSX: this modal needs to render one of three sets of JSX (depending on the value of the responseErr and newSubmit object properties)
    //Alternatively, it may be more efficient to return a single set of JSX and conditionally render the Buttons and <p> message using embedded JS
    
    return(
        <>
        </>

    );

}