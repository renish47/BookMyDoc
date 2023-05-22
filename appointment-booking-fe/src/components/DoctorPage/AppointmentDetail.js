/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import toastConfig from '../../config/toastConfig'
import NavBar from '../General/NavBar';
import MediumPlaceHolder from '../General/MediumPlaceHolder'

import Container from 'react-bootstrap/esm/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function AppointmentDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [patientName, setPatientName] = useState(' ');
    const [age, setAge] = useState(null);
    const [gender, setGender] = useState('');
    const [reason, setReason] = useState('');
    const [remarks, setRemarks] = useState('');
    const [isCompleted, setIsCompleted] = useState('');
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const remarksRef = useRef();

    const fetchData = useCallback(async () => {
        try {
            let res = await fetch('https://bookmydoc-bc.onrender.com/doctor/appointment/' + id, {
                headers:
                {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            });
            if (res.status === 200) {
                res = await res.json();
                setPatientName(res.data.patient.name);
                setAge(res.data.patient.age);
                setReason(res.data.reason);
                setGender(res.data.patient.gender);
                setRemarks(res.data.remarks)
                setIsCompleted(res.data.isCompleted)
                setTimeout(() => {
                    setIsDataLoaded(true)
                }, 200);
            }
            else if (res.status === 401) {
                toast.warning('Session Timeout', toastConfig)
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                navigate('/login')
            }

        } catch (error) {
            console.log(error)
        }
    }, []);

    const submitHandler = async () => {
        let res = await fetch('https://bookmydoc-bc.onrender.com/doctor/edit-appointment/' + id, {
            method: 'PUT',
            headers: { 'content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('token') },
            body: JSON.stringify({
                remarks: remarksRef.current.value === '' ? "Nil" : remarksRef.current.value
            })
        })
        if (res.status === 200) {
            toast.success('Appointment Marked as Complete', toastConfig)
            navigate('/doctor/home');
        }
        else if (res.status === 401) {
            toast.warning('Session Timeout', toastConfig)
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            navigate('/login')
        }
    }

    const backToHomeHandler = () => {
        navigate('/doctor/home')
    }

    useEffect(() => {
        fetchData()
    }, [isCompleted])
    return (
        <>
            <NavBar in='doctorsPage' />
            <Container fluid='sm' className='my-5 '>
                <h3 className='h3 mb-5'>Appointment <span className='text-primary ps-1'>#{id}</span></h3>

                {isDataLoaded && <Card className='rounded-5 p-3 border-2 h-100 '>
                    <Card.Header className='whiteBg'><h3 className='d-inline-block'>Patient Info</h3>
                        {isCompleted && isDataLoaded && <Card.Text className='d-block text-success  float-sm-end d-sm-inline-block'><i className="fa-solid fa-circle-check text-success pe-2"></i>Marked as Completed</Card.Text>}
                    </Card.Header>
                    <Card.Body style={{ fontSize: '18px' }}>
                        <Row className='mb-2'>
                            <Col>Name</Col>
                            <Col className='text-secondary'>{patientName}</Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col>Age</Col>
                            <Col className='text-secondary'>{age}</Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col>Gender</Col>
                            <Col className='text-secondary px-0'>{gender}</Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col>Reason for Consulting</Col>
                            <Col className='text-secondary px-0'>{reason}</Col>
                        </Row>
                        {isCompleted && <Row className='mb-2 '>
                            <Col>Remarks</Col>
                            <Col className='text-muted px-0'>{remarks}</Col>
                        </Row>}

                    </Card.Body>
                </Card>}
                {!isCompleted && isDataLoaded && <>
                    <Card className='rounded-5 p-3 border-2 h-100 mb-5 mt-4'>
                        {/* <Card.Header as="h3" className='whiteBg'>Remarks</Card.Header> */}
                        <Card.Body>
                            <Form>
                                <Form.Label className='h3 mb-4'>Remarks</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    placeholder="Add your remarks here"
                                    style={{ height: '100px' }}
                                    ref={remarksRef}
                                />

                            </Form>
                        </Card.Body>
                    </Card>
                    <Row className='gap-2 mt-4 mb-2 px-5'>
                        <Col>
                            <Button variant="primary" type="submit" className='rounded-pill w-100' onClick={submitHandler} >
                                Mark as Completed
                            </Button>
                        </Col>
                        <Col>
                            <Button variant="danger" type="submit" className='rounded-pill w-100'>
                                Cancel Appointment
                            </Button>
                        </Col>
                    </Row></>}
                {isCompleted && isDataLoaded &&
                    <div className="d-grid gap-2 col-6 mx-auto mt-3 mb-5">
                        <Button variant="primary" type="button" className='rounded-pill' onClick={() => backToHomeHandler()} >
                            Back to Home
                        </Button>
                    </div>
                }
                {
                    !isDataLoaded && <Card className='rounded-5 p-3 border-2 h-100 '> <MediumPlaceHolder /> </Card>
                }
            </Container>
        </>
    )
}

export default AppointmentDetail