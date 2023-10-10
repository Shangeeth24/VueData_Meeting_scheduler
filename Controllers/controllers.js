const booking = require('../Model/booking')

exports.insertBooking =async (req, res) => {
    try {
        console.log("Received form data:");
        console.log(req.body);
        var newBooking = new booking(req.body);
        
        await newBooking.save();
        
        res.status(200).send("Data received");
    } catch (error) {
        console.error("Error inserting booking:", error);
        res.status(500).send("Internal Server Error");
    }
}


exports.insertBookingView = (req, res) => {
    res.render("booking")
}


exports.bookingsView =(req, res) => {
    res.render("viewBookings")
}
