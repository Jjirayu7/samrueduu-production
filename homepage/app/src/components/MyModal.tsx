import React from 'react';
import { Modal, Button } from 'react-bootstrap';

function MyModal(props) {
    return (
        <Modal show={props.isOpen} onHide={props.onClose} id={props.id} dialogClassName="modal-xl">
            <Modal.Header closeButton>
                <Modal.Title>{props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ height: '500px', overflowY: 'auto' }}>
                {props.children}
            </Modal.Body>
            <Modal.Footer>
                <button type="button" className="btn btn-secondary" onClick={props.onClose}>ปิด</button>
                <button type="button" className="btn btn-primary" onClick={props.onSave}>บันทึก</button>
            </Modal.Footer>
        </Modal>
    );
}

export default MyModal;