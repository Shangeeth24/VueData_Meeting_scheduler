const express = require('express')

const { insertBooking, insertBookingView, roomName, employeeName, today, week, month, delete_entry, updateBooking, getMeetingById, all } = require('../Controllers/controllers')

const router = express.Router()

router.get("/booking", insertBookingView)
router.get('/getRooms', roomName)
router.get('/getEmployees', employeeName)
router.get('/today', today)
router.get('/week', week)
router.get('/home', all)
router.get('/month', month)
router.post("/insertBooking", insertBooking)
router.get('/getMeeting/:id', getMeetingById)
router.put("/update/:id", updateBooking)
router.delete("/delete/:id", delete_entry)

module.exports = router
