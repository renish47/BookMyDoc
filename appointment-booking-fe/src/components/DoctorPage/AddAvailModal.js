import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';

import toastConfig from '../../config/toastConfig'


function AddAvailModal(props) {

    let today = new Date().toISOString().split('T')[0];
    const [startDate, setStartDate] = useState(today);
    const [isLoading, setIsLoading] = useState(false)

    const startDateRef = useRef();
    const endDateRef = useRef();
    const startTimeRef = useRef();
    const endTimeRef = useRef();
    const navigate = useNavigate();

    const setAvailHandler = async () => {
        if (startDateRef.current.value === '' || endDateRef.current.value === '' || startTimeRef.current.value === '' || endTimeRef.current.value === '') {
            toast.warning('Fill all the fields', toastConfig)
            return
        }
        let sDate = new Date(startDateRef.current.value)
        let eDate = new Date(endDateRef.current.value)
        let sTime = startTimeRef.current.value
        let eTime = endTimeRef.current.value

        if (sTime > eTime)
            return toast.error('Select the Valid Timing', toastConfig)
        if (sDate > eDate) {
            return toast.error('Select the Valid Date', toastConfig)
        }

        else {
            try {
                setIsLoading(true)
                let res = await fetch('https://bookmydoc-bc.onrender.com/doctor/add-availability', {
                    method: 'POST',
                    headers:
                    {
                        'content-Type': 'application/json',
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    },
                    body: JSON.stringify({
                        startDate: startDateRef.current.value,
                        endDate: endDateRef.current.value,
                        startTime: '2000-01-01 ' + sTime,
                        endTime: '2000-01-01 ' + eTime
                    })
                });
                if (res.status === 201) {
                    toast.success('Availability Added Succesfully', toastConfig)
                    props.onHide()
                }
                else if (res.status === 401) {
                    toast.warning('Session Timeout', toastConfig)
                    localStorage.removeItem('token');
                    localStorage.removeItem('userId');
                    navigate('/login')
                }
            } catch (error) {
                console.log(error.text)
            }
            finally {
                setIsLoading(false)
            }
        }
    }

    return (
        <>

            <Modal {...props}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Availability</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Form>
                            <Row>
                                <Col xs={6} md={4}>
                                    <Form.Label className='text-muted'>From</Form.Label>
                                </Col>
                                <Col xs={12} md={8}>
                                    <Form.Control type="date" ref={startDateRef} min={today} name='startDate' onChange={(e) => setStartDate(e.target.value)} required />
                                </Col>
                            </Row>
                            <Row className='mt-4'>
                                <Col xs={6} md={4}>
                                    <Form.Label className='text-muted'>Till</Form.Label>
                                </Col>
                                <Col xs={12} md={8}>
                                    <Form.Control type="date" name='endDate' min={startDate} ref={endDateRef} required />
                                </Col>
                            </Row>
                            <Row className='mt-4'>
                                <Col xs={6} md={4}>
                                    <Form.Label className='text-muted'>Session Start Time</Form.Label>
                                </Col>
                                <Col xs={12} md={8}>
                                    <Form.Control type="time" ref={startTimeRef} name='startTime' required />
                                </Col>
                            </Row>
                            <Row className='mt-4'>
                                <Col xs={6} md={4}>
                                    <Form.Label className='text-muted'>Session Start Time</Form.Label>
                                </Col>
                                <Col xs={12} md={8}>
                                    <Form.Control type="time" ref={endTimeRef} name='endTime' required />
                                </Col>
                            </Row>
                        </Form>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <div className="d-grid gap-2 col-6 mx-auto text-center">
                        <button className="btn btn-primary rounded-pill" type="button" variant="primary" onClick={setAvailHandler} disabled={isLoading}>
                            {
                                isLoading ?
                                    <div className="spinner-border spinner-border-sm" role="status" />
                                    : "Set Availability"
                            }
                        </button>
                    </div>

                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AddAvailModal; 