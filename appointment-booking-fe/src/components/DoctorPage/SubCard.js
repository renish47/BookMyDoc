
import React, { useState, useEffect } from 'react';
import moment from 'moment';

import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


import SmallPlaceHolder from '../General/SmallPlaceHolder';
import AddAvailModal from './AddAvailModal';


function SubCard(props) {
    const [show, setShow] = useState(false);
    const [startDate, setStartdate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')


    const handleCloseModal = () => {
        setShow(false)
        props.onAvailHandler(true)
    };

    const handleShowModal = () => setShow(true);


    useEffect(() => {
        try {
            setStartdate(moment(props.docData.availability.startDate).format("MMM DD, YYYY"))
            setEndDate(moment(props.docData.availability.endDate).format("MMM DD, YYYY"))
            setStartTime(moment(props.docData.availability.startTime).format("h:mm A"))
            setEndTime(moment(props.docData.availability.endTime).format("h:mm A"))
        } catch (error) {

        }

    }, [props.docData])


    return (<>
        <AddAvailModal show={show} onHide={handleCloseModal} />
        <Card className='rounded-5 p-3 border-2 h-100 '>
            <Card.Header as="h3" className='whiteBg'>{props.title}</Card.Header>
            <Card.Body>
                {props.isAvailabilityAdded && !props.isLoaded && <SmallPlaceHolder />}
                {props.isAvailabilityAdded && props.isLoaded && props.title === 'Your Availability'
                    ? <>
                        <Row className='mb-2'>
                            <Col>From</Col>
                            <Col className='text-secondary'>{startDate}</Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col>Till</Col>
                            <Col className='text-secondary'>{endDate}</Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col>Session Timing</Col>
                            <Col className='text-secondary px-0'>{startTime} - {endTime}</Col>
                        </Row>
                        {/* <div className="d-grid gap-2 col-6 mx-auto mt-4">
                            <button className="btn btn-primary rounded-3" type="button" variant="primary" onClick={handleShowModal}>Edit Availability</button>
                        </div> */}
                    </>
                    :
                    props.title === 'Your Availability' && props.isLoaded &&
                    <>
                        <div className="d-grid gap-2 col-6 mx-auto mt-4 ">
                            <button className="btn btn-primary rounded-3" type="button" variant="primary" onClick={handleShowModal}>Add Availability</button>
                        </div>
                    </>
                }

                {props.title !== 'Your Availability' && props.isLoaded &&
                    <Card.Text className='text-center m-4 text-muted'>
                        No New Notifications
                    </Card.Text>
                }
            </Card.Body>
        </Card>
    </>
    );
}

export default SubCard