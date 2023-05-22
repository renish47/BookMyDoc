import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

import '../../pages/signup.css'
import toastConfig from '../../config/toastConfig';


function SignupPatient() {
    const navigate = useNavigate();
    let emailRef = useRef();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState(' ');
    const [isLoading, setIsLoading] = useState(false)

    const SubmitHandler = async (event) => {
        event.preventDefault();
        try {
            setIsLoading(true)
            let res = await fetch('https://bookmydoc-bc.onrender.com/patient/signup', {
                method: 'POST',
                headers: { 'content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name,
                    age: age,
                    email: email,
                    password: password,
                    gender: gender
                })
            })
            let status = res.status;
            res = await res.json();
            if (status === 403) {
                toast.error(res.message, toastConfig)
                emailRef.current.focus();
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

    return (
        <Form>
            <h4 className='text-center pb-3 text-secondary fw-light'>Sign up Form</h4>
            <FloatingLabel controlId="floatingFullName" label="Full Name" className='text-muted'>
                <Form.Control type="text" className='mb-3' name='name' value={name} onChange={(e) => setName(e.target.value)} required placeholder="Full Name" />
            </FloatingLabel>
            <FloatingLabel controlId="floatingAge" label="Age" className='text-muted'>
                <Form.Control type="number" className='mb-3' value={age} name='age' onChange={(e) => setAge(e.target.value)} required min={1} step={1} placeholder="Age" />
            </FloatingLabel>
            <FloatingLabel controlId="floatingGender" label="Select Gender" className='text-muted'>
                <Form.Select className="form-select mb-4 text-secondary" placeholder='Select Gender' value={gender} onChange={(e) => setGender(e.target.value)} name='gender' required >
                    <option disabled value=' ' hidden></option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Others">Others</option>
                </Form.Select>
            </FloatingLabel>
            <FloatingLabel controlId="floatingEmail" label="Email Address" className='text-muted'>
                <Form.Control type="email" ref={emailRef} className='mb-3' value={email} name='email' onChange={(e) => setEmail(e.target.value)} required placeholder="Email Address" />
            </FloatingLabel>
            <FloatingLabel controlId="floatingPassword" label="Password" className='text-muted'>
                <Form.Control type="password" className='mb-3' value={password} name='password' onChange={(e) => setPassword(e.target.value)} required placeholder="Password" minLength={6} />
            </FloatingLabel>
            <div className="d-grid gap-2 col-6 mx-auto mt-4">
                <Button variant="primary" type="submit" onClick={SubmitHandler} disabled={isLoading}>
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

export default SignupPatient