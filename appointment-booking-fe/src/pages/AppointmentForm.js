/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from 'moment';


import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import NavBar from '../components/General/NavBar'
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import LongPlaceHolder from '../components/General/LongPlaceHolder';
import MediumPlaceHolder from '../components/General/MediumPlaceHolder';

import toastConfig from '../config/toastConfig';

import './AppointmentForm.css'


function AppointmentForm() {

  const { id } = useParams();
  const [docData, setDocData] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [isDocSelected, setIsDocSelected] = useState(false);
  const [isDateSelected, setIsDateSelected] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [doctor, setDoctor] = useState(' ');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  const [minDate, setMinDate] = useState('')
  const [maxDate, setMaxDate] = useState('')
  const navigate = useNavigate();
  const [timeSlotArray, setTimeSlotArray] = useState([]);



  const fetchDataForReschedule = useCallback(async () => {
    try {
      let res = await fetch('https://bookmydoc-bc.onrender.com/patient/appointment/' + id, {
        headers:
        {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      });
      if (res.status === 200) {
        res = await res.json();
        setDate(res.data.date.split('T')[0]);
        setDoctor(res.data.doctor.name);
        setReason(res.data.reason);
        setTime(res.data.time);
        setAllFields(res.data.doctor);
        setTimeout(() => {
          setIsLoaded(true)
        }, 200);
      }
      else if (res.status === 401) {
        toast.warning('Session Timeout', toastConfig)
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login')
      }

    } catch (error) {
      console.log(error)
    }
  }, []);

  const fetchDoctorsData = useCallback(async () => {
    try {
      let res = await fetch('https://bookmydoc-bc.onrender.com/doctor/get-doctors', {
        headers:
        {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      });
      if (res.status === 200) {
        res = await res.json()
        setDocData(res.docData)
        setTimeout(() => {
          setIsLoaded(true)
        }, 200);
      }
      else if (res.status === 401) {
        toast.warning('Session Timeout', toastConfig)
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login')
      }
    } catch (error) {
      console.log(error)
    }
  }, [])

  const SubmitHandler = async (event) => {
    event.preventDefault();
    if (time === '') {
      return toast.error('Select the Time Slot', toastConfig)
    }
    try {
      setIsLoading(true)
      let url = 'https://bookmydoc-bc.onrender.com/patient/book-appointment';
      let method = 'POST'
      if (id) {
        url = 'https://bookmydoc-bc.onrender.com/patient/edit-appointment/' + id;
        method = 'PUT'
      }
      let res = await fetch(url, {
        method: method,
        headers: { 'content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('token') },
        body: JSON.stringify({
          doctor: doctor,
          date: date,
          time: time,
          reason: reason
        })
      })
      if (res.status === 201 || res.status === 200) {
        let message = res.status === 201 ? 'Appointment Booked Successfully' : 'Appointment Rescheduled Successfully'
        toast.success(message, toastConfig)
        navigate('/patient/home');
      }
      else if (res.status === 401) {
        toast.warning('Session Timeout', toastConfig)
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login')
      }
      else if (res.status === 400) {
        res = await res.json()
        toast.error(res.message, toastConfig)
      }

    } catch (error) {
      // console.log(error)
    }
    finally {
      setIsLoading(false)
    }
  }

  const setDateHandler = (event) => {
    setDate(event.target.value);
    createTimeSlots(event.target.value)
  }

  const setReasonHandler = (event) => {
    setReason(event.target.value);
  }


  const createTimeSlots = async (selectedDate) => {
    try {
      let selectedDocData = docData.filter((doc) => doc.name === doctor)[0];
      await fetchAppointmentsTime(selectedDocData._id, selectedDate)
        .then((res) => res.json())
        .then((res) => {
          let today = new Date();
          let todayDate = moment(today).format('YYYY-MM-DD')
          let currentTime = '0'
          if (selectedDate === todayDate) {
            currentTime = moment(today).format("hh:mm A")
            if (currentTime.split(' ')[1] === 'PM')
              currentTime = moment(today).format("h:mm A")
            // currentTime = '3:00 PM'
            // currentTime = '11:59 AM'
          }
          let appointments = res.appointments.map((e) => e.time);
          let startTime = selectedDocData.availability.startTime
          let endTime = selectedDocData.availability.endTime
          let tempTime = startTime;
          let tempArr = []
          let index = 0;
          let bookedTime = ''
          // if (new Date(tempTime) > new Date(endTime)) {
          //   endTime = moment(endTime).add(1, 'day')
          //   let amTime = appointments.filter((e) => e.split(' ')[1] === 'AM').reverse()
          //   let pmTime = appointments.filter((e) => e.split(' ')[1] === 'PM').sort()
          //   appointments = [...pmTime, ...amTime]
          // }
          if (appointments[0]) {
            bookedTime = appointments[index];
          }
          while (new Date(tempTime) <= new Date(endTime)) {
            let temp = moment(tempTime).format("h:mm A")
            if (temp <= currentTime) {
              tempTime = moment(tempTime).add(20, 'minutes').format("YYYY-MM-DD HH:mm")
              continue
            }
            else if (temp > currentTime && temp === bookedTime) {
              tempArr.push({ time: temp, booked: true })
              index += 1
              if (index < appointments.length) {
                bookedTime = appointments[index]
              }
            }
            else {
              tempArr.push({ time: temp, booked: false })
            }
            tempTime = moment(tempTime).add(20, 'minutes').format("YYYY-MM-DD HH:mm")
          }
          setTimeSlotArray([...tempArr])
          setIsDateSelected(true);
        })
        .catch(err => {
          // console.log(err) 
        });

    } catch (error) {
      // console.log(error)
    }
  }

  const fetchAppointmentsTime = async (id, selectedDate) => {
    try {
      let res = await fetch('https://bookmydoc-bc.onrender.com/patient/get-appointmentsTime', {
        method: 'POST',
        headers:
        {
          'content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({
          id: id,
          date: selectedDate
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

  const setAllFields = (doctor) => {
    let selectedDocData;
    if (id)
      selectedDocData = doctor;
    else
      selectedDocData = docData.filter((doc) => doc.name === doctor)[0];

    try {
      setMaxDate(selectedDocData.availability.endDate)
      const today = new Date()
      const minDateObj = new Date(selectedDocData.availability.startDate)
      if (today > minDateObj) {
        setMinDate(moment(today).format("YYYY-MM-DD"))
      } else {
        setMinDate(selectedDocData.availability.startDate)
      }
      setIsDocSelected(true)
    } catch (error) {
      console.log(error)
    }
  }

  const setDocHandler = (event) => {
    setDoctor(event.target.value);
    setIsDateSelected(false)
    setDate('')
    setAllFields(event.target.value)
  }

  const changeDateFormat = (date) => {
    let dateItem = date.split('-')
    return `${dateItem[2]}-${dateItem[1]}-${dateItem[0]}`
  }

  const clickDisabledHandler = () => {
    if (!isDocSelected) {
      toast.warning('Select the doctor first', toastConfig)
    }
  }



  useEffect(() => {
    if (docData.length === 0) {
      fetchDoctorsData();
    }
    if (id) {
      if (!date) {
        fetchDataForReschedule();
      }
      createTimeSlots(date);
      setIsDateSelected(true)
    }

  }, [id, docData, fetchDataForReschedule, fetchDoctorsData, date]);


  return (
    <>
      <NavBar />
      <Container fluid='sm' className='mt-4'>
        {isLoaded &&
          <>
            <h3 className='h3 mb-5'>Appointment Form</h3>
            <Form onSubmit={SubmitHandler}>


              <Form.Label className='text-center fw-bold text-muted mb-2'>Doctor</Form.Label>
              <Form.Select className="form-select mb-5" name='Doctor' value={doctor} onChange={setDocHandler} required disabled={id ? true : false}>
                <option disabled value=' '>Select the Doctor to consult</option>
                {docData.map((doc) => {
                  return (<option value={doc.name} key={doc._id}>Dr.{doc.name}</option>)
                })}
              </Form.Select>


              <Form.Group className="mb-5" controlId="appointmentDate">
                <Form.Label className='text-center fw-bold text-muted mb-2'>Date</Form.Label>
                <div className='enableOnClick__container'>
                  <div onClick={clickDisabledHandler} className={!isDocSelected ? 'enableOnClick' : ''} />
                  <Form.Control type="date" name='appointmentDate' min={minDate} max={maxDate} onInput={setDateHandler} value={date} required disabled={!isDocSelected} onClick={clickDisabledHandler} />
                </div>

                {doctor !== ' ' && <Form.Text className="text-muted">
                  Note that Dr.{doctor} will be available only from  <span className='text-primary px-1'>{changeDateFormat(minDate)}</span> till <span className='text-primary px-1'>{changeDateFormat(maxDate)}</span>
                </Form.Text>}
              </Form.Group>

              {isDocSelected && isDateSelected && <div className="mb-5">
                <Form.Label className='fw-bold text-muted mb-2 '>Time Slot</Form.Label><br />
                {timeSlotArray.length !== 0
                  ? <ButtonGroup>
                    <Container fluid className='p-0'>
                      {timeSlotArray.map((slot, idx) => (
                        <ToggleButton
                          key={idx}
                          id={`radio-${idx}`}
                          type="radio"
                          variant={!id ? (slot.booked ? 'secondary' : 'outline-success') : (slot.booked && time !== slot.time ? 'secondary' : 'outline-success')}
                          name="radio"
                          disabled={!id ? slot.booked : slot.booked && time !== slot.time}
                          value={slot.time}
                          checked={time === slot.time}
                          onChange={(e) => setTime(e.target.value)}
                          className='m-2 p-2 timeSlotBtn rounded-3'
                        >
                          {slot.time}
                        </ToggleButton>
                      ))}
                    </Container>
                  </ButtonGroup>
                  : <div className='text-center mt-3mb-5'><Form.Text className='text-danger'>No More Slots available Today</Form.Text></div>
                }
              </div>
              }

              <Form.Group className="mb-5" controlId="Reason" >
                <Form.Label className='text-center fw-bold text-muted mb-2'>Reason for Consulting</Form.Label>
                <div className='enableOnClick__container'>
                  <div onClick={clickDisabledHandler} className={!isDocSelected ? 'enableOnClick' : ''} />
                  <Form.Control disabled={id || !isDocSelected ? true : false} type="text" placeholder="Reason" value={reason} onChange={setReasonHandler} required />
                </div>

              </Form.Group>

              <div className="d-grid gap-2 col-6 mx-auto mt-4 mb-2">
                <Button variant="primary" type="submit" disabled={isLoading}>
                  {
                    isLoading ?
                      <div className="spinner-border spinner-border-sm" role="status" />
                      : !id ? "Book Appointment" : "Reschedule"
                  }

                </Button>
              </div>
              {id && <div className="d-grid gap-2 col-6 mx-auto mt-3 mb-5">
                <Button variant="secondary" type="button" onClick={() => navigate('/patient/home')} >
                  Close
                </Button>
              </div>}


            </Form>
          </>}
        {
          !isLoaded && <><LongPlaceHolder /><MediumPlaceHolder /></>
        }

      </Container>
    </>
  );
}


export default AppointmentForm