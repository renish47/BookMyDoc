/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Card from 'react-bootstrap/Card';
import MyModal from '../General/MyModal';


import './AppointmentList.css'
import DateCard from './DateCard';
import toastConfig from '../../config/toastConfig'
import LongPlaceHolder from '../General/LongPlaceHolder';


function AppointmentList() {

    const [bookingData, setBookingData] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false)
    const [cancellationLoading, setCancellationLoading] = useState(false)
    const [id, setId] = useState('')
    const navigate = useNavigate()



    const fetchData = async () => {
        try {
            let res = await fetch('https://bookmydoc-bc.onrender.com/patient/appointments', {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            });
            let statusCode = res.status;
            let result = await res.json();
            if (statusCode === 401) {
                toast.warning('Session Timeout', toastConfig)
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                navigate('/login')
            } else if (statusCode === 200) {
                setBookingData(result.appointments)
                setTimeout(() => {
                    setIsLoaded(true);
                }, 200);
            }
        } catch (error) {
            console.log(error)
        }
        finally {
            setModalShow(false);
            setCancellationLoading(false)
        }
    };

    const cancelBookingHandler = async (id) => {
        try {
            setCancellationLoading(true)
            let res = await fetch('https://bookmydoc-bc.onrender.com/patient/cancel-appointment/' + id, {
                method: 'DELETE',
                headers:
                {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            });
            if (res.status === 401) {
                toast.warning('Session Timeout', toastConfig)
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                navigate('/login')
            }
            else if (res.status === 200) {
                fetchData()

            }
        } catch (error) {
            console.log(error)
        }
    }

    const rescheduleHandler = (id) => {
        navigate('/patient/edit-appointment/' + id);
    }


    const cancelBtnHandler = (id) => {
        setModalShow(true)
        setId(id)
    }

    useEffect(() => {
        fetchData()

    }, []);

    if (!isLoaded) {
        return <LongPlaceHolder />
    }

    if (bookingData.length) {
        return <>
            <MyModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                purposehandler={() => cancelBookingHandler(id)}
                purpose='Cancel'
                isCancelConfirmed={cancellationLoading}
            />
            <Container >
                {isLoaded &&
                    bookingData.map((appointment, i) => {
                        return (
                            <Row key={i} >
                                <Col>
                                    <DateCard bookingData={appointment.date} />
                                </Col>
                                <Col xs={7} className='text-start'>You have an Appointment with <span className='fw-bold'>Dr.{appointment.doctor.name}</span> at <span className='fw-bold text-primary'>{appointment.time}</span></Col>
                                <Col className='ms-5 mt-3 mt-sm-0  mb-4'>
                                    <OverlayTrigger
                                        key='Reschedule'
                                        placement='right'
                                        overlay={<Tooltip id={`tooltip-'bottom'`}> Reschedule</Tooltip>}>
                                        <Button className='btn-secondary m-1  btnInList' disabled={cancellationLoading} onClick={() => { rescheduleHandler(appointment._id) }} ><i className="fa-solid fa-clock"></i></Button>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        key='cancel'
                                        placement='right'
                                        overlay={<Tooltip id={`tooltip-'bottom'`}> Cancel</Tooltip>}>
                                        <Button className='btn-danger m-1 btnInList' disabled={cancellationLoading} onClick={() => { cancelBtnHandler(appointment._id) }}><i className="fa-solid fa-xmark" ></i></Button>
                                    </OverlayTrigger>
                                </Col>
                                <hr />
                            </Row>
                        )
                    })
                }

            </Container>
        </>
    }

    else {
        return <Card.Text className='text-muted text-center p-5'>
            No Appointments booked so far
        </Card.Text>
    }

}

export default AppointmentList;





