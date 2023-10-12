const express = require('express')
const {insertBooking,insertBookingView,bookingsView,roomName,employeeName,today,week,month}= require('../Controllers/controllers')

const router = express.Router()

router.get("/booking",insertBookingView)
router.get("/viewBookings",bookingsView)
router.post("/insertBooking",insertBooking)
router.get('/getRooms',roomName)
router.get('/getEmployees',employeeName)
router.get('/today',today)
router.get('/week',week)
router.get('/home',month)


module.exports = router
