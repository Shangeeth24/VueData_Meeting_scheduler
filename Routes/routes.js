const express = require('express')
const {insertBooking,insertBookingView,bookingsView,roomName,employeeName}= require('../Controllers/controllers')

const router = express.Router()




router.get("/booking",insertBookingView)
router.get("/viewBookings",bookingsView)
router.post("/insertBooking",insertBooking)
router.get('/getRooms',roomName)
router.get('/getEmployees',employeeName)


module.exports = router
