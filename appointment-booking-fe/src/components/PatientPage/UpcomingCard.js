import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import AppointmentList from './AppointmentList';


function UpcomingCard() {

    
    return (
        <Card className='rounded-5 p-3  border-2'>
            <Card.Header as="h3" className='whiteBg'>Upcoming Appointments</Card.Header>
            <Card.Body>
                <AppointmentList/>
                <Link to='/patient/book-appointment' className='navLink'>
                    <div className="d-grid gap-2 col-6 mx-auto mt-4">
                        <button className="btn btn-primary rounded-pill" type="button">Book Now</button>
                    </div>
                </Link>
            </Card.Body>
        </Card>
    );
}
export default UpcomingCard