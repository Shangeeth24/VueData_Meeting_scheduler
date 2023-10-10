const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
    meetingId :{
        type : Number,
        required : "Meeting ID is required ",
        
    },
    room :{
        type:String,
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
    organizerName :{
        type:String,
        required : "Enter your ID eg:'VD123' "
    }
})


module.exports = mongoose.model("booking",bookingSchema)