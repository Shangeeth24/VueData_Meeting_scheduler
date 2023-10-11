const booking = require('../Model/booking')
const meetingIdGenerate = require('../Model/meetingId')
const room = require('../Model/room')
const moment = require('moment');

exports.insertBooking = async (req, res) => {
    try {
        // Generate the meeting ID
        let sequence = await meetingIdGenerate.findOneAndUpdate(
            { meeting: "justForChecking" },
            { "$inc": { "meetingId": 1 } },
            { new: true }
        );

        let incrementedId;

        if (sequence === null) {
            const firstTimeValue = new meetingIdGenerate({ meeting: "justForChecking", meetingId: 1 });
            await firstTimeValue.save();
            incrementedId = 1;
        } else {
            incrementedId = sequence.meetingId;
        }
        const { startTime, endTime } = req.body;

        const start = moment(startTime);
        const end = moment(endTime);
      
        if (end.isBefore(start)) {
          return res.status(400).json({ message: "End time should be after start time" });
        }
      
        const duration = moment.duration(end.diff(start)).asHours();
        
        if (duration > 30) {
          return res.status(400).json({ message: "Meeting duration exceeds 9 hours" });
        }

        console.log("incrementedId : " + incrementedId);

        // Prepare the new booking data
        let newBookingData = req.body;
        newBookingData.meetingId = incrementedId;

        var newBooking = new booking(newBookingData);
        await newBooking.save();

        res.status(200).send("Data received");
    } catch (error) {
        console.error("Error inserting booking:", error);
        res.status(500).send("Internal Server Error");
    }
};


exports.insertBookingView = (req, res) => {
    res.render("booking")
}


exports.bookingsView =(req, res) => {
    res.render("viewBookings")
}


exports.roomName = async (req, res) => {
    try {
      const rooms = await room.find({});
      res.json(rooms);
    } catch (err) {
      res.status(500).send("Internal Server Error");
    }
  }