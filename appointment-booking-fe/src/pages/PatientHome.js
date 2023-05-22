import React from 'react'

import UpcomingCard from '../components/PatientPage/UpcomingCard';
import Container from 'react-bootstrap/Container';
import NavBar from '../components/General/NavBar'

function PatientHome() {
  return (
    <>
    <NavBar/>
      <Container className='my-5'>
        <UpcomingCard />
      </Container>
    </>
  )
}

export default PatientHome