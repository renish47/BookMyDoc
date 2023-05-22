/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

import './login.css'
import toastConfig from '../config/toastConfig';

function Login() {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false)

    const checkForAlreadyLoggedIn = async () => {
        try {
            let res = await fetch('https://bookmydoc-bc.onrender.com/patient/check-token', {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            });

            if (res.status === 404) {
                res = await fetch('https://bookmydoc-bc.onrender.com/doctor/check-token', {
                    headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
                });
            }
            if (res.status === 200) {
                res = await res.json();
                if (res.user === 'doctor') {
                    navigate('/doctor/home');
                }
                else if (res.user === 'patient')
                    navigate('/patient/home');
            }
        } catch (error) {
            console.log(error)
        }
    }

    const submitHandler = async (event) => {
        event.preventDefault();
        try {
            setIsLoading(true)
            let res = await fetch('https://bookmydoc-bc.onrender.com/patient/login', {
                method: 'POST',
                headers: { 'content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });
            if (res.status === 404) {
                res = await fetch('https://bookmydoc-bc.onrender.com/doctor/login', {
                    method: 'POST',
                    headers: { 'content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                });
            }
            let status = res.status;
            res = await res.json();
            if (status === 404 || status === 401) {
                toast.error(res.message, toastConfig)
            }
            else if (status === 200) {
                localStorage.setItem('token', res.token);
                localStorage.setItem('userId', res.userId);
                if (res.user === 'doctor')
                    navigate('/doctor/home');
                else if (res.user === 'patient')
                    navigate('/patient/home');
                toast.success(res.message, toastConfig)
            }
        } catch (error) {
            console.log(error)
        }
        finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (localStorage.getItem('token'))
            checkForAlreadyLoggedIn()
    }, [])


    return (
        <div className='login__bg'>
            <Container className='p-5 pb-3 pt-0 login__container d-flex align-items-center justify-content-around '>
                <Row className='w-100'>
                    <Col className='text-primary h1  border-end me-2 pb-3 d-flex align-items-center justify-content-center login__border' md={6}>
                        <h1>BookMy<span className='text-dark'>Doc</span></h1></Col>
                    <Col className='text-center'>
                        <h4 className='pb-3 text-secondary fw-light'>Login Here</h4>
                        <Form onSubmit={submitHandler}>
                            <FloatingLabel controlId="floatingEmail" label="Email Address" className='text-muted'>
                                <Form.Control className="mb-3" type="email" placeholder="Email Address" onChange={(e) => setEmail(e.target.value)} required value={email} />
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingPassword" label="Password" className='text-muted'>
                                <Form.Control className="mb-3" type="password" placeholder='Password' value={password} name='password' onChange={(e) => setPassword(e.target.value)} required />
                            </FloatingLabel>
                            <Form.Text className="mb-3">Not a user? <span onClick={() => navigate('/signup')} className=' login__signupBtn ps-1 link-primary'>Sign up</span></Form.Text>
                            <div className="d-grid gap-2 col-6 mx-auto mt-4">
                                <Button variant="primary" type="submit" disabled={isLoading}>
                                    {
                                        isLoading ?
                                            <div className="spinner-border spinner-border-sm" role="status" />
                                            : "Sign up"
                                    }
                                </Button>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Login

