import React from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const MyModal = (props) => {
    console.log(props.isCancelConfirmed)
    return (
        <Modal
            show={props.show}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered

        >
            <div style={{ zIndex: "9999" }}>
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Are you Sure?
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='py-2 text-center '>
                    <p>Do you want to {props.purpose}</p>
                </Modal.Body>
                <Modal.Footer className='text-center' >
                    <Button onClick={props.onHide} variant='dark' disabled={props.isCancelConfirmed}>Close</Button>
                    <Button onClick={props.purposehandler} variant={props.purpose === 'Cancel' ? "danger" : 'warning'} disabled={props.isCancelConfirmed}>
                        {
                            props.isCancelConfirmed ?
                                <div className="spinner-border spinner-border-sm" role="status" />
                                : props.purpose
                        }
                    </Button>
                </Modal.Footer>
            </div>
        </Modal>
    );
}

export default MyModal