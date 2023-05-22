/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


import Container from 'react-bootstrap/esm/Container'
import MainCard from '../components/DoctorPage/MainCard'
import NavBar from '../components/General/NavBar'
import Placeholder from 'react-bootstrap/Placeholder';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SubCard from '../components/DoctorPage/SubCard';
import toastConfig from '../config/toastConfig';

function DoctorHome() {

    const navigate = useNavigate();
    const [docData, setDocData] = useState({});
    const [isAvailabilityAdded, setIsAvailabilityAdded] = useState(true)
    const [isLoaded, setIsLoaded] = useState(false)

    const fetchData = async () => {
        try {
            let res = await fetch('https://bookmydoc-bc.onrender.com/doctor/get-doctor', {
                headers: {
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
                res = await res.json();
                setDocData(res.data);
                if (res.data.availability) {
                    setIsAvailabilityAdded(true)
                } else {
                    setIsAvailabilityAdded(false)
                }
                setTimeout(() => {
                    setIsLoaded(true)
                }, 500);

            }
        } catch (error) {
            console.log(error)
        }
    }

    const setAvailabilityAdded = (isAdded) => {
        setIsAvailabilityAdded(isAdded)
    }

    useEffect(() => {
        fetchData()
    }, [isAvailabilityAdded]);

    return (
        <>
            <NavBar in='doctorsPage' />
            <Container className='mt-5 pt-3'>
                {isLoaded
                    ?
                    <h2 className='pb-3 ms-3 mb-4'>Hi, <span className='text-primary '>Dr.{docData.name}!</span></h2>
                    :
                    <Placeholder as={Card.Title} animation="wave" className='pb-3 ms-3 mb-4'>
                        <Placeholder xs={2} />
                    </Placeholder>}
                <MainCard docData={docData} isLoaded={isLoaded} isAvailabilityAdded={isAvailabilityAdded} setIsLoaded={setIsLoaded} />
            </Container>
            <Container className='mb-5 mt-3'>
                <Row>
                    <Col md className='mt-3'>
                        <SubCard title='Your Availability' isLoaded={isLoaded} docData={docData} isAvailabilityAdded={isAvailabilityAdded} onAvailHandler={setAvailabilityAdded} />
                    </Col>
                    <Col md="7" className='mt-3'><SubCard title='Notifications' isAvailabilityAdded={isAvailabilityAdded} isLoaded={isLoaded} /></Col>
                </Row>
            </Container>
        </>
    )
}

export default DoctorHome