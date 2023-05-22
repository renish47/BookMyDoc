import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

import '../../pages/signup.css';
import toastConfig from '../../config/toastConfig';


const focusChangeHandler = (event) => {
    let thisElement = event.target;
    if (thisElement.nextSibling && thisElement.value.length >= 4) {
        thisElement.nextSibling.focus();
    }
    if (thisElement.value.length < 1 && !thisElement.nextSibling.value) {
        thisElement.previousElementSibling.focus();
    }
}


function SignupDoctor() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [pc1, setPc1] = useState('');
    const [pc2, setPc2] = useState('');
    const [pc3, setPc3] = useState('');
    const [pc4, setPc4] = useState('');
    const [isLoading, setIsLoading] = useState(false)

    const SubmitHandler = async (event) => {
        event.preventDefault();
        let purchaseCode = `${pc1}-${pc2}-${pc3}-${pc4}`
        if (purchaseCode !== '1111-2222-3333-4444') {
            toast.error('Invalid Purchase Code', toastConfig)
            return;
        }
        try {
            setIsLoading(true)
            let res = await fetch('https://bookmydoc-bc.onrender.com/doctor/signup', {
                method: 'POST',
                headers: { 'content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                    purchaseCode: purchaseCode
                })
            })
            let status = res.status;
            res = await res.json();
            if (status === 403) {
                toast.error(res.message, toastConfig)
                // emailRef.current.focus();
            } else {
                navigate('/login');
                toast.success(res.message, toastConfig)
            }
        } catch (error) {
            console.log(error)
        }
        finally {
            setIsLoading(false)
        }
    }

    const pc1Handler = (event) => {
        focusChangeHandler(event)
        setPc1(event.target.value)
    }
    const pc2Handler = (event) => {
        focusChangeHandler(event)
        setPc2(event.target.value)
    }
    const pc3Handler = (event) => {
        focusChangeHandler(event)
        setPc3(event.target.value)
    }
    const pc4Handler = (event) => {
        focusChangeHandler(event)
        setPc4(event.target.value)
    }

    return (
        <Form onSubmit={SubmitHandler}>
            <h4 className='text-center pb-3 text-secondary fw-light'>Sign up Form</h4>
            <FloatingLabel controlId="floatingFullName" label="Full Name" className='text-muted'>
                <Form.Control className="mb-3" type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
            </FloatingLabel>
            <FloatingLabel controlId="floatingEmail" label="Email address" className='text-muted'>
                <Form.Control className="mb-3" type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </FloatingLabel>
            <FloatingLabel controlId="floatingPassword" label="Password" className='text-muted'>
                <Form.Control className="mb-3" type="password" placeholder="Password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required />
            </FloatingLabel>
            <br />
            <div className='text-center'>
                <Form.Label className='ps-2'>Purchase Key</Form.Label><br />
                <Form.Control type="text" value={pc1} onChange={event => pc1Handler(event)} required maxLength={4} id='code1' placeholder="xxxx" className='signup__purchaseCodeInp' />
                <Form.Control type="text" maxLength={4} id='code2' placeholder="xxxx" className='signup__purchaseCodeInp' value={pc2} onChange={event => pc2Handler(event)} required />
                <Form.Control type="text" maxLength={4} id='code3' placeholder="xxxx" className='signup__purchaseCodeInp' value={pc3} onChange={event => pc3Handler(event)} required />
                <Form.Control type="text" maxLength={4} id='code4' placeholder="xxxx" className='signup__purchaseCodeInp' value={pc4} onChange={event => pc4Handler(event)} required /><br /><br />
                <Form.Text className='pt-2'>Not Purchased the App yet? <Link className=' signup__signupBtn ps-1 link-primary' to={'/doctor/purchase'}>Purchase Now</Link></Form.Text>
            </div><br />

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
    )
}

export default SignupDoctor