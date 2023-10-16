const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
    meetingId :{
        type : Number,        
    },
    roomId :{
        type:Number,
        required :"select room name"

    },
    startTime : {
        type:Date,
        required : "Start Time  is required "
    },
    endTime : {
        type:Date,
        required : "End Time  is required "
    },
    employeeId :{
        type:String,
        required : "Enter your ID eg:'VD123' "
    }
})


module.exports = mongoose.model("booking",bookingSchema)