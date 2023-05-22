const express = require('express');

const patientController = require('../controller/patient')

const auth = require('../middleware/auth')

const router = express.Router();

router.post('/book-appointment', auth, patientController.postAppointment);

router.post('/signup', patientController.createPatient);

router.post('/login', patientController.getPatient);

router.get('/check-token', auth, patientController.checkToken);

router.post('/get-appointmentsTime', auth ,  patientController.getAppointmentsTime);

router.get('/appointments',  auth, patientController.getAppointments);

router.get('/appointment/:id',  auth, patientController.getAppointment );

router.put('/edit-appointment/:id',  auth, patientController.editAppointment );

router.delete('/cancel-appointment/:id',  auth, patientController.deleteAppointment );

module.exports = router;