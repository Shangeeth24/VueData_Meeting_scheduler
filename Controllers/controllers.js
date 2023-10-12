const booking = require('../Model/booking');
const meetingIdGenerate = require('../Model/meetingId');
const room = require('../Model/room')
const employee = require('../Model/employee')
const data = require('../Service/lookup.js');
const moment = require("moment")

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
exports.employeeName = async (req, res) => {
    try {
      const employees = await employee.find({});
      res.json(employees);
    } catch (err) {
      res.status(500).send("Internal Server Error");
    }
  }



// async function getTodayBooking(res,req,next){
//     let datas = await data.getBooking();
//     console.log(datas)
// }
// getTodayBooking();

// today
const today = new Date();
today.setHours(0, 0, 0, 0);

exports.today = async (req, res, next) => {
  try {
    const datas = await data.getBooking();
    
    const startOfDay = new Date(today);
    const endOfDay = new Date(today);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const filteredData = datas.filter(item => {
      return item.startTime >= startOfDay && item.startTime < endOfDay;
    });

    res.render('index', { 
      nav1: "Dashboard",
      nav2: "Book",
      con1: "MEETING DASHBOARD",
      con2: "Select Timeframe",
      datas: filteredData 
    });
  } catch (err) {
    console.log(err);
    // next(err);
  }
}

// weekly

exports.week = async (req, res, next) => {
  try {
    const datas = await data.getBooking();

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - today.getDay()) + 1); 

    const filteredData = datas.filter(item => {
      return item.startTime >= startOfWeek && item.startTime < endOfWeek;
    });

    res.render('index', {
      nav1: "Dashboard",
      nav2: "Book",
      con1: "MEETING DASHBOARD",
      con2: "Select Timeframe",
      datas: filteredData 
    });
  } catch (err) {
    console.log(err);
    // next(err);
  }
}

//monthly

exports.month = async (req, res, next) => {
  try {
    const datas = await data.getBooking();

    const startOfMonth = new Date(today);
    startOfMonth.setDate(1); 
    const endOfMonth = new Date(today);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1); 
    const filteredData = datas.filter(item => {
      return item.startTime >= startOfMonth && item.startTime < endOfMonth;
    });

    res.render('index', {
      nav1: "Dashboard",
      nav2: "Book",
      con1: "MEETING DASHBOARD",
      con2: "Select Timeframe",
      datas: filteredData 
    });
  } 
  catch (err) {
    console.log(err);
    // next(err);
  }
}




