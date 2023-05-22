/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import toastConfig from '../../config/toastConfig';

import Card from 'react-bootstrap/Card';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import MediumPlaceHolder from '../General/MediumPlaceHolder';


function MainCard(props) {

    const navigate = useNavigate();
    const [docData, setDocData] = useState({})
    const [timeSlotArray, setTimeSlotArray] = useState([]);
    const [date, setDate] = useState('');
    const [minDate, setMinDate] = useState('')
    const [maxDate, setMaxDate] = useState('')
    const [refresh, setRefresh] = useState(false)
    const [firstRender, setFirstRender] = useState(true)

    const createTimeSlots = async (docData) => {
        try {
            fetchAppointmentsTime()
                .then((res) => res.json())
                .then((res) => {
                    let appointments = res.appointments.map((e) => e.time);
                    let ids = res.appointments.map((e) => e._id);
                    let isCompleted = res.appointments.map((e) => e.isCompleted);
                    let startTime = docData.availability.startTime
                    let endTime = docData.availability.endTime
                    let tempTime = startTime;
                    let tempArr = []
                    let index = 0;
                    let bookedTime = ''
                    let id = ''
                    let isComp = false
                    // if (new Date(tempTime) > new Date(endTime)) {
                    //     endTime = moment(endTime).add(1, 'day')
                    //     let amTime = appointments.filter((e) => e.split(' ')[1] === 'AM').reverse()
                    //     let pmTime = appointments.filter((e) => e.split(' ')[1] === 'PM').sort()
                    //     appointments = [...pmTime, ...amTime]
                    // }
                    if (appointments[0]) {
                        bookedTime = appointments[index];
                        id = ids[index];
                        isComp = isCompleted[index];
                    }
                    while (new Date(tempTime) <= new Date(endTime)) {
                        let temp = moment(tempTime).format("h:mm A")
                        if (temp === bookedTime) {
                            tempArr.push({ time: temp, booked: true, id: id, isCompleted: isComp })
                            index += 1
                            if (index < appointments.length) {
                                bookedTime = appointments[index]
                                id = ids[index];
                                isComp = isCompleted[index];
                            }
                        }
                        else {
                            tempArr.push({ time: temp, booked: false, id: id, isCompleted: isComp })
                        }
                        tempTime = moment(tempTime).add(20, 'minutes').format("YYYY-MM-DD HH:mm")
                    }
                    setTimeSlotArray(tempArr)
                    // console.log(tempArr)
                })
                .catch(err => {
                    // console.log(err)
                });

        } catch (error) {
            console.log(error)
        }
    }


    const fetchAppointmentsTime = async () => {
        try {
            let res = await fetch('https://bookmydoc-bc.onrender.com/doctor/get-appointmentsTime', {
                method: 'POST',
                headers:
                {
                    'content-Type': 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({
                    date: date
                })
            });
            if (res.status === 401) {
                toast.warning('Session Timeout', toastConfig)
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                navigate('/login')
            }
            else if (res.status === 200) {
                return res
            }
        } catch (error) {
            console.log(error)
        }
    }

    const dateHandler = async (event) => {
        setDate(event.target.value);
    }

    const refreshHandler = () => {
        setRefresh(prev => !prev)
        toast.info('Appointments Refreshed', toastConfig)

    }

    const openAppointmentHandler = (id) => {
        navigate('/doctor/appointment/' + id)
    }
    useEffect(() => {
        try {
            if (props.docData) {
                if (firstRender) {
                    setDocData(props.docData);
                    const today = new Date()
                    const minDateObj = new Date(docData.availability.startDate)
                    setMinDate(docData.availability.startDate)
                    setMaxDate(docData.availability.endDate)

                    if (today > minDateObj)
                        setDate(moment(today).format("YYYY-MM-DD"))
                    else
                        setDate(docData.availability.startDate)

                    setFirstRender(false)
                }
                createTimeSlots(props.docData);
            }
        } catch (error) {

        }
    }, [props.docData, refresh, docData, date])

    return (<>
        <Card className='rounded-5 p-3 border-2'>
            <Card.Header className='whiteBg'>
                <Row className="justify-content-center">
                    <Col>
                        <h3 className='d-inline-block'>Appointments</h3>
                    </Col>
                    <Col xs='12' md='5' lg='4' className='mb-3'>
                        {props.isAvailabilityAdded && props.isLoaded && <Form.Control type="date" max={maxDate} min={minDate} value={date} name='startDate' onChange={dateHandler} />}
                    </Col>
                </Row>

            </Card.Header>
            <Card.Body className='p-0 p-xl-3'>
                {props.isAvailabilityAdded && props.isLoaded && <ButtonGroup>
                    <Container fluid className='p-0'>
                        {timeSlotArray.map((slot, idx) => (
                            <ToggleButton
                                key={idx}
                                id={`radio-${idx}`}
                                type="radio"
                                variant={slot.booked ? (slot.isCompleted ? 'success' : 'warning') : 'outline-secondary'}
                                disabled={!slot.booked}
                                name="radio"
                                value={slot.time}
                                className='m-1 m-md-2 p-2 timeSlotBtn rounded-3'
                                onClick={() => { openAppointmentHandler(slot.id) }}
                            >
                                {slot.time}
                            </ToggleButton>
                        ))}

                        <hr />
                        <Row>
                            <Col className='text-center'>
                                <button className="btn btn-outline-dark rounded-4 m-2  px-4" type="button" onClick={refreshHandler}>
                                    <i className="fa-solid fa-arrows-rotate" /> Refresh
                                </button>
                                <button className="btn btn-outline-dark rounded-4 m-2  px-3" type="button" >Block / Unblock Session(s)</button>
                                <button className="btn btn-outline-dark rounded-4 m-2  px-3 text-center" type="button">Block / Unblock Day(s)</button>
                            </Col>
                        </Row>
                    </Container>
                </ButtonGroup>}
                {!props.isLoaded && props.isAvailabilityAdded && <MediumPlaceHolder />}
                {!props.isAvailabilityAdded &&
                    <Card.Text className='text-center text-muted px-5'>Add your availability first</Card.Text>}
            </Card.Body>
        </Card>
    </>
    );
}
export default MainCard