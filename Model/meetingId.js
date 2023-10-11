const mongoose = require('mongoose')

const meetingIdGenerate = new mongoose.Schema({
    meeting :{
        type : String,
       
    },


    meetingId :{
        type : Number,
       
        
    }
})


module.exports = mongoose.model("meetingId_Auto_Inrement",meetingIdGenerate)