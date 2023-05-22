import React, { useState } from 'react'


import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';


import './signup.css'
import SignupPatient from '../components/SignupPage/SignupPatient';
import SignupDoctor from '../components/SignupPage/SignupDoctor';

function Signup() {

    const [isDoctorUser, setIsDoctorUser] = useState(false);
    const [isPatientUser, setIsPatientUser] = useState(false);
    const [isuserSelected, setIsUserSelected] = useState(false);

    const patientUserBtnHandler = () => {
        setIsPatientUser(true);
        setIsUserSelected(true);
    }
    const DoctorUserBtnHandlerv = () => {
        setIsDoctorUser(true);
        setIsUserSelected(true);
    }


    return (
        <div className='signup__bg'>
            <Container className='p-5 pb-3 pt-0 signup__container d-flex align-items-center justify-content-around'>
                <Row className='w-100'>
                    <Col className='text-primary h1  border-end me-2 pb-3 d-flex align-items-center justify-content-center signup__border' md={6}>
                        <h1>BookMy<span className='text-dark'>Doc</span></h1></Col>
                    {!isuserSelected && <Col>
                        <h4 className='text-center pb-3 text-secondary fw-light'>Select the type of User</h4>
                        <div className="d-grid gap-2 col-6 mx-auto mt-4">
                            <Button variant="primary" type="submit" onClick={patientUserBtnHandler}>
                                I am a Patient
                            </Button>
                        </div>
                        <p className='text-center pt-3 text-secondary fw-light'>or</p>
                        <div className="d-grid gap-2 col-6 mx-auto mt-4">
                            <Button variant="primary" type="submit" onClick={DoctorUserBtnHandlerv}>
                                I am a Doctor
                            </Button>
                        </div>
                    </Col>}
                    {isPatientUser && <Col> <SignupPatient/> </Col>}
                    {isDoctorUser && <Col> <SignupDoctor/> </Col>}
                </Row>
            </Container>
        </div>
    )
}

export default Signup;