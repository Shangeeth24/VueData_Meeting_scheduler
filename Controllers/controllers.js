const booking = require('../Model/booking')
const meetingIdGenerate = require('../Model/meetingId')

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
