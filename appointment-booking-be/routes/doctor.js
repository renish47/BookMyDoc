const express = require('express');

const doctorController = require('../controller/doctor')
const auth = require('../middleware/auth')

const router = express.Router();


router.post('/signup', doctorController.createDoctor);

router.post('/login', doctorController.login);

router.post('/add-availability',auth, doctorController.postAvailability);

router.get('/get-doctor', auth, doctorController.getDoctor)

router.get('/get-doctors', auth, doctorController.getDoctors)

router.post('/get-appointmentsTime', auth, doctorController.getAppointmentsTime);

router.get('/check-token', auth, doctorController.checkToken);

router.get('/appointment/:id',  auth, doctorController.getAppointment );

router.put('/edit-appointment/:id',  auth, doctorController.editAppointment );

module.exports = router;