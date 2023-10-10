const express = require('express')
const {insertBooking,insertBookingView,bookingsView}= require('../Controllers/controllers')

const router = express.Router()




router.get("/booking",insertBookingView)
router.get("/viewBookings",bookingsView)
router.post("/insertBooking",insertBooking)


module.exports = router
