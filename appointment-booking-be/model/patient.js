const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const patientSchema = new Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        type:String,
        required: true
    },
    name:{
        type:String,
        required: true
    },
    age:{
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    appointments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Appointment'
        }
    ]
});

module.exports = mongoose.model('Patient', patientSchema);