import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';


import PatientHome from './pages/PatientHome';
import AppointmentForm from './pages/AppointmentForm';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DoctorHome from './pages/DoctorHome';
import Error from './pages/Error';
import AppointmentDetail from './components/DoctorPage/AppointmentDetail';
import PurchaseApp from './pages/PurchaseApp';


function App() {

  return (
    <>
      <Routes>
        <Route path='/patient/home' element={<PatientHome />} />
        <Route path='/doctor/home' element={<DoctorHome />} />
        <Route path='/doctor/purchase' element={<PurchaseApp />} />
        <Route path='/doctor/appointment/:id' element={<AppointmentDetail/>} />
        <Route path='/patient/book-appointment' element={<AppointmentForm/>} />
        <Route path='/patient/edit-appointment/:id' element={<AppointmentForm/>} />
        <Route path='/login' element={<Login/>} /> 
        <Route path='/' element={<Login/>} /> 
        <Route path='/signup' element={<Signup/>} />
        <Route path='/error' element={<Error/>} />

        <Route path='*' element={<Navigate to={'/error'} />} />
      </Routes>
    </>
  );
}

export default App;
