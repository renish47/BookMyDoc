const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema(
    {
        doctor : {
            type: Schema.Types.ObjectId,
            ref:'Doctor'
        },
        date: {
            type: String,
            required: true
        },
        time: {
            type: String,
            required: true
        },

        reason:{
            type: String,
            required: true
        },
        patient:{
            type: Schema.Types.ObjectId,
            ref:'Patient'
        },
        remarks:{
            type: String
        },
        isCompleted:{
            type: Boolean,
            default: false
        }
    }
);

module.exports = mongoose.model('Appointment', appointmentSchema);