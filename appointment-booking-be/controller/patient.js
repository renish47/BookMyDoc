const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Appointment = require('../model/appointment')
const Patient = require('../model/patient')
const Doctor = require('../model/doctor')


exports.postAppointment = async (req, res, next) => {
    let docName = req.body.doctor;
    let date = req.body.date;
    let reason = req.body.reason;
    let time = req.body.time;

    let existingAppointment = await Appointment.findOne({ date: date, time: time }).populate('doctor')
    if (!existingAppointment) {
        let doctor = await Doctor.findOne({ name: docName })
        let patient = await Patient.findById({ _id: req.userId })

        const appointment = new Appointment({
            doctor: doctor._id,
            date: date,
            time: time,
            reason: reason,
            patient: req.userId
        })

        try {
            let savedAppointment = await appointment.save();
            patient.appointments.push(savedAppointment._id);
            doctor.appointments.push(savedAppointment._id);
            await patient.save()
            await doctor.save()
            res.status(201).json({
                message: 'appointment booked!',
                appointment: appointment
            });

        }
        catch (err) {
            console.log(err);
        }
    }
    else{
        if(existingAppointment.doctor.name=== docName){
            res.status(400).json({
                message: "Appointment can't be made with the specified time"
            })
        }
    }
};

exports.getAppointments = async (req, res, next) => {
    try {
        let dateObj = new Date()
        dateObj.setDate(dateObj.getDate() - 1);
        let yesterday = dateObj.toISOString().split('T')[0]

        // let outDatedAppointments = await Appointment.find({ patient: req.userId, date: yesterday });
        // if (outDatedAppointments) {
        //     outDatedAppointments.forEach(async (app) => {
        //         let id = app._id
        //         const appointment = await Appointment.findByIdAndDelete(id)
        //         const doctor = await Doctor.findById({ _id: appointment.doctor });
        //         const patient = await Patient.findById({ _id: req.userId })

        //         patient.appointments = patient.appointments.filter((app) => app != id.toString());
        //         doctor.appointments = doctor.appointments.filter((app) => app != id.toString());
        //         await patient.save();
        //         await doctor.save();
        //     });
        // }
        const appointments = await Appointment.find({ patient: req.userId, date:{$gt: yesterday} }).populate('doctor', 'name').sort({ date: 1 });

        res.status(200).json({
            message: 'Data Fetched Successfully',
            statusCode: 200,
            appointments: appointments
        });
    }
    catch (err) {
        console.log(err);
    }
};

exports.getAppointment = async (req, res, next) => {
    const id = req.params.id
    const data = await Appointment.findById(id).populate('doctor', 'name availability');
    res.status(200).json({
        message: 'Appointment fetched Successfully',
        data: data
    })
};

exports.editAppointment = async (req, res, next) => {
    const id = req.params.id;
    const data = await Appointment.findByIdAndUpdate(id, {
        date: req.body.date, time: req.body.time
    })
    res.status(200).json({
        message: 'Appointment Rescheduled Successfully',
        data: data
    })
}

exports.deleteAppointment = async (req, res, next) => {
    const id = req.params.id
    const appointment = await Appointment.findByIdAndDelete(id)
    const doctor = await Doctor.findById({ _id: appointment.doctor });
    const patient = await Patient.findById({ _id: req.userId })

    patient.appointments = patient.appointments.filter((app) => app != id.toString());
    doctor.appointments = doctor.appointments.filter((app) => app != id.toString());
    await patient.save();
    await doctor.save();
    res.status(200).json({
        message: 'Appointment Deleted Successfully'
    })
};


exports.createPatient = async (req, res, next) => {
    let name = req.body.name;
    let age = req.body.age;
    let email = req.body.email;
    let password = req.body.password;
    let gender = req.body.gender
    try {
        let user = await Patient.findOne({ email: email })
        if (user) {
            res.status(403).json({
                message: 'User with this Mail ID already Exists',
                status: 403
            })

        } else {
            let hashedPassword = await bcrypt.hash(password, 12);
            const patient = new Patient({
                name: name,
                age: age,
                email: email,
                password: hashedPassword,
                gender: gender
            });
            let userData = await patient.save();
            res.status(201).json({
                message: 'Account Created Successfully!'
            });
        }

    } catch (error) {
        console.log(error);
    }
};

exports.getPatient = async (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;

    try {
        let userData = await Patient.findOne({ email: email })
        if (userData) {
            let isEqual = await bcrypt.compare(password, userData.password);
            if (isEqual) {
                const token = jwt.sign(
                    {
                        email: email,
                        userId: userData._id.toString()
                    }, "verySuperSecretCode007", { expiresIn: '1h' });

                res.status(200).json({
                    message: 'Logged in Successfully',
                    token: token,
                    userId: userData._id.toString(),
                    user: 'patient'
                })
            }
            else {
                res.status(401).json({
                    message: 'Wrong Password'
                })
            }
        }
        else {
            res.status(404).json({
                message: 'No User Found with this Email Address'
            })
        }
    }
    catch (error) {
        console.log(error)
    }
}

exports.getAppointmentsTime = async (req, res, next) => {
    try {
        const date = req.body.date;
        const id = req.body.id;
        const appointments = await Appointment.find({ date: date }, { time: 1 }).sort({ time: 1 });


        res.status(200).json({
            message: 'Data Fetched Successfully',
            appointments: appointments
        });
    }
    catch (err) {
        console.log(err);
    }
};

exports.checkToken = async (req, res, next) => {
    try {
        const patient = await Patient.findById({ _id: req.userId });
        if (patient) {
            res.status(200).json({
                message: 'user Checked Successfully',
                user: 'patient'
            })
        }
        else {
            res.status(404).json({
                message: 'No user found with this token'
            })
        }
    } catch (error) {
        throw error
    }
};