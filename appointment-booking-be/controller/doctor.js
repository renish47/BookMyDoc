const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Appointment = require('../model/appointment')
const Doctor = require('../model/doctor')


exports.createDoctor = async (req, res, next) => {
    let name = req.body.name;
    let purchaseCode = req.body.purchaseCode;
    let email = req.body.email;
    let password = req.body.password;

    try {
        let user = await Doctor.findOne({ email: email })
        if (user) {
            res.status(403).json({
                message: 'User with this Mail ID already exists',
                status: 403
            })

        } else {
            let hashedPassword = await bcrypt.hash(password, 12);
            const doctor = new Doctor({
                name: name,
                email: email,
                password: hashedPassword,
                purchaseCode: purchaseCode
            });
            let userData = await doctor.save();
            res.status(201).json({
                message: 'Account Created Successfully!',
                status: 201
            });
        }

    } catch (error) {
        console.log(error);
    }
};

exports.getDoctor = async (req, res, next) =>{
    try {
        let data = await Doctor.findOne({_id: req.userId},{name:1, availability:1, appointments:1});
    if(!data){
        let err = new Error('No Doctors data found');
        err.status = 404;
        throw err;
    }
    res.status(200).json({
        message:'Doctor Data Fetched Successfully',
        data: data
    })
    } catch (error) {
        console.log(error)
    }
}

exports.login = async (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;

    try {
        let userData = await Doctor.findOne({ email: email })
        if (userData) {
            let isEqual = await bcrypt.compare(password, userData.password);
            if(isEqual){
                const token = jwt.sign(
                    {
                        email: email,
                        userId: userData._id.toString()
                    }, "verySuperSecretCode007", {expiresIn: '1h'});
                    
                res.status(200).json({
                    message: 'Logged in Successfully',
                    token: token,
                    userId : userData._id.toString(),
                    user:'doctor'
                })
            }
            else{
                res.status(401).json({
                    message: 'Wrong Password'
                })
            }
        } 
        else{
            res.status(404).json({
                message: 'No User Found with this Email Address'
            })
        }
    }
    catch(error){
        console.log(error)
    }
}

exports.postAvailability = async (req, res, next)=>{
    let startDate = req.body.startDate
    let endDate = req.body.endDate
    let startTime = req.body.startTime
    let endTime = req.body.endTime
    let response = await Doctor.findByIdAndUpdate({_id: req.userId},{availability:{startDate, endDate, startTime, endTime}})
    if(response){
        res.status(201).json({message:'Availability Added Successfully'})
    }
}

exports.getDoctors = async (req, res, next)=>{
   try {
    let today =  new Date().toISOString().split('T')[0]
    let docData = await Doctor.find({},{_id:1, name:1, availability:1});
    if(!docData){
        let err = new Error('No Doctors data found');
        err.status = 404;
        throw err;
    }
    res.status(200).json({message:'doctors data fetched successfully', docData: docData})
   } catch (error) {
        throw error
   }
}

exports.getAppointmentsTime = async (req, res, next) => {
    try {
        const date = req.body.date;
        const appointments = await Appointment.find({doctor: req.userId, date:date},{time:1, isCompleted:1}).sort({time:1});


        res.status(200).json({
            message: 'Data Fetched Successfully',
            appointments:appointments
        });
    }
    catch (err) {
        console.log(err);
    }
};

exports.checkToken = async (req , res , next) => {
    try {
        const doc = await Doctor.findById({_id: req.userId});
        if(doc){
            res.status(200).json({
                message: 'user Checked Successfully',
                user: 'doctor'
            })
        }
        else{
            res.status(404).json({
                message: 'No user found with this token'
                
            })
        }
    } catch (error) {
        throw error
    }
};

exports.getAppointment = async (req, res, next) => {
    const id = req.params.id
    const data = await Appointment.findById(id).populate('patient', 'name age gender')
    res.status(200).json({
        message: 'Appointment fetched Successfully',
        data: data
    })
};

exports.editAppointment = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = await Appointment.findByIdAndUpdate(id, {
            remarks: req.body.remarks, isCompleted: true
        })
        res.status(200).json({
            message: 'Appointment Marked as Complete'
        }) 
    } catch (error) {
        throw error
    }
}