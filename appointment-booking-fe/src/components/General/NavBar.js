import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import MyModal from './MyModal';



function NavBar(props) { 
  const navigate = useNavigate();
  const [modalShow, setModalShow] = useState(false);


  const logoutHandler = ()=>{
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login')
  }

  const logoutBtnHandler = ()=>{
    setModalShow(true)
  }
  return (
    <>
    <MyModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        purposehandler={logoutHandler}
        purpose='Logout'
      />
      <Navbar bg="light" className='shadow' variant="light">
        <Container>
          <Link to={props.in==='doctorsPage'?"/doctor/home":"/patient/home"} className='navLink'>
            <Navbar.Brand className='text-primary h4 pe-0'>BookMy<span className='text-dark'>Doc</span></Navbar.Brand>
          </Link>
          <Nav className="me-end py-2">
              <Nav.Link onClick={logoutBtnHandler}>Logout</Nav.Link>  
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default NavBar;