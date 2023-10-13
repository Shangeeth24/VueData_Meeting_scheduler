const express = require('express')
const {insertBooking,insertBookingView,roomName,employeeName,today,week,month,delete_entry,update_entry}= require('../Controllers/controllers')

const router = express.Router()

router.get("/booking",insertBookingView)
router.post("/insertBooking",insertBooking)
router.get('/getRooms',roomName)
router.get('/getEmployees',employeeName)
router.get('/today',today)
router.get('/week',week)
router.get('/home',month)
router.delete("/delete/:id",delete_entry)


module.exports = router
