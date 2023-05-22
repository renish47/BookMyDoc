const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
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
    purchaseCode:{
        type: String,
        required: true
    },
    appointments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Appointment'
        }
    ],
    availability:{
        startDate:{
            type: String
        },
        endDate:{
            type: String
        },          
        startTime:{
            type: String
        },
        endTime:{
            type: String
        }           
    }
    
});

module.exports = mongoose.model('Doctor', doctorSchema);