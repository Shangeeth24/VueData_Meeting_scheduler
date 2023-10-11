const express = require('express')
const {insertBooking,insertBookingView,bookingsView,roomName}= require('../Controllers/controllers')

const router = express.Router()




router.get("/booking",insertBookingView)
router.get("/viewBookings",bookingsView)
router.post("/insertBooking",insertBooking)
router.get('/getRooms',roomName)


module.exports = router
