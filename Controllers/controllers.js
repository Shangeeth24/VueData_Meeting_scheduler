const booking = require("../Model/booking");
const meetingIdGenerate = require("../Model/meetingId");
const room = require("../Model/room");
const employee = require("../Model/employee");
const data = require("../Service/lookup.js");
const moment = require("moment");

exports.insertBooking = async (req, res) => {
  try {
    const { startTime, endTime, roomId, employeeId } = req.body;
    console.log(startTime, endTime, roomId);
    const start = moment(startTime);
    const end = moment(endTime);

    if (end.isBefore(start)) {
      return res.status(400).json({ message: "End time should be after start time" });
    }

    const currentTime = moment();
    if (start.isBefore(currentTime)) {
      return res.status(400).json({ message: "Cannot book time in the past" });
    }

    const overlappingBooking = await booking.findOne({
      $and: [
        { roomId },
        {
          $or: [
            { startTime: { $gte: start.toDate(), $lt: end.toDate() } },
            { endTime: { $gt: start.toDate(), $lte: end.toDate() } },
            { startTime: { $lt: start.toDate() }, endTime: { $gt: end.toDate() } },
          ],
        },
      ],
    });

    if (overlappingBooking) {
      console.log("overlapping exists");
      res.status(400).send({
        message: "Overlapping booking exists",
      });
      return;
    }

    const duration = moment.duration(end.diff(start)).asHours();

    if (duration > 30) {
      return res.status(400).json({ message: "Meeting duration exceeds 30 hours" });
    }

    let sequence = await meetingIdGenerate.findOneAndUpdate(
      { meeting: "justForChecking" },
      { $inc: { meetingId: 1 } },
      { new: true }
    );

    let incrementedId;

    if (sequence === null) {
      const firstTimeValue = new meetingIdGenerate({
        meeting: "justForChecking",
        meetingId: 1,
      });
      await firstTimeValue.save();
      incrementedId = 1;
    } else {
      incrementedId = sequence.meetingId;
    }

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
  res.render("booking", { currentPath: "/Booking" });
};

exports.roomName = async (req, res) => {
  try {
    const rooms = await room.find({});
    res.json(rooms);
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};

exports.employeeName = async (req, res) => {
  try {
    const employees = await employee.find({});
    res.json(employees);
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};

const today = new Date();
today.setHours(0, 0, 0, 0);

exports.today = async (req, res, next) => {
  try {
    const datas = await data.getBooking();
    const startOfDay = new Date(today);
    const endOfDay = new Date(today);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const filteredData = datas.filter((item) => {
      return item.startTime >= startOfDay && item.startTime < endOfDay;
    });

    filteredData.sort((a, b) => a.startTime - b.startTime);
    
    if (filteredData.length === 0) {
      res.render("index", {
        nav1: "Dashboard",
        nav2: "Book",
        con1: "MEETING DASHBOARD",
        con2: "Select Timeframe",
        select1: "Today",
        select2: "Weekly",
        select3: "Monthly",
        msg: "No Record Found",
        noRecordsFound: true, 
        currentPath: "/today",
      });
    } else {
      res.render("index", {
        nav1: "Dashboard",
        nav2: "Book",
        con1: "MEETING DASHBOARD",
        con2: "Select Timeframe",
        select1: "Today",
        select2: "Weekly",
        select3: "Monthly",
        datas: filteredData,
        currentPath: "/today",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.today = async (req, res, next) => {
  try {
    const datas = await data.getBooking();
    const startOfDay = new Date(today);
    const endOfDay = new Date(today);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const now = new Date(); 

    const filteredData = datas.filter((item) => {
      return item.startTime >= startOfDay && item.startTime < endOfDay;
    });

    filteredData.sort((a, b) => a.startTime - b.startTime);

    const currentAndFutureMeetings = filteredData.filter((item) => item.endTime > now);
    const finishedMeetings = filteredData.filter((item) => item.endTime <= now);

    const sortedData = currentAndFutureMeetings.concat(finishedMeetings);

    if (sortedData.length === 0) {
      res.render("index", {
        nav1: "Dashboard",
        nav2: "Book",
        con1: "MEETING DASHBOARD",
        con2: "Select Timeframe",
        select1: "Today",
        select2: "Weekly",
        select3: "Monthly",
        msg: "No Record Found",
        noRecordsFound: true,
        currentPath: "/today",
      });
    } else {
      res.render("index", {
        nav1: "Dashboard",
        nav2: "Book",
        con1: "MEETING DASHBOARD",
        con2: "Select Timeframe",
        select1: "Today",
        select2: "Weekly",
        select3: "Monthly",
        datas: sortedData,
        currentPath: "/today",
      });
    }
  } catch (err) {
    console.log(err);
  }
};


exports.week = async (req, res, next) => {
  try {
    const datas = await data.getBooking();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - today.getDay()) + 1);

    const filteredData = datas.filter((item) => {
      return item.startTime >= startOfWeek && item.startTime < endOfWeek;
    });

    const now = new Date(); 

    filteredData.sort((a, b) => a.startTime - b.startTime);

    const currentAndFutureMeetings = filteredData.filter((item) => item.endTime > now);
    const finishedMeetings = filteredData.filter((item) => item.endTime <= now);

    const sortedData = currentAndFutureMeetings.concat(finishedMeetings);

    if (sortedData.length === 0) {
      res.render("index", {
        nav1: "Dashboard",
        nav2: "Book",
        con1: "MEETING DASHBOARD",
        con2: "Select Timeframe",
        select1: "Today",
        select2: "Weekly",
        select3: "Monthly",
        msg: "No Record Found",
        noRecordsFound: true, 
        currentPath: "/week",
      });
    } else {
      res.render("index", {
        nav1: "Dashboard",
        nav2: "Book",
        con1: "MEETING DASHBOARD",
        con2: "Select Timeframe",
        select1: "Today",
        select2: "Weekly",
        select3: "Monthly",
        datas: sortedData,
        currentPath: "/week",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.month = async (req, res, next) => {
  try {
    const datas = await data.getBooking();
    const startOfMonth = new Date(today);
    startOfMonth.setDate(1);
    const endOfMonth = new Date(today);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    const filteredData = datas.filter((item) => {
      return item.startTime >= startOfMonth && item.startTime < endOfMonth;
    });

    const now = new Date(); 

    filteredData.sort((a, b) => a.startTime - b.startTime);

    const currentAndFutureMeetings = filteredData.filter((item) => item.endTime > now);
    const finishedMeetings = filteredData.filter((item) => item.endTime <= now);

    const sortedData = currentAndFutureMeetings.concat(finishedMeetings);

    if (sortedData.length === 0) {
      res.render("index", {
        nav1: "Dashboard",
        nav2: "Book",
        con1: "MEETING DASHBOARD",
        con2: "Select Timeframe",
        select1: "Today",
        select2: "Weekly",
        select3: "Monthly",
        msg: "No Record Found",
        noRecordsFound: true, 
        currentPath: "/month",
      });
    } else {
      res.render("index", {
        nav1: "Dashboard",
        nav2: "Book",
        con1: "MEETING DASHBOARD",
        con2: "Select Timeframe",
        select1: "Today",
        select2: "Weekly",
        select3: "Monthly",
        datas: sortedData,
        currentPath: "/month",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.all = async (req, res, next) => {
  try {
    const datas = await data.getBooking();
    const now = new Date(); 

    datas.sort((a, b) => a.startTime - b.startTime);

    const currentAndFutureMeetings = datas.filter((item) => item.endTime > now);
    const finishedMeetings = datas.filter((item) => item.endTime <= now);

    const sortedData = currentAndFutureMeetings.concat(finishedMeetings);
    if (sortedData.length === 0) {
      res.render("index", {
        nav1: "Dashboard",
        nav2: "Book",
        con1: "MEETING DASHBOARD",
        con2: "Select Timeframe",
        select1: "Today",
        select2: "Weekly",
        select3: "Monthly",
        msg: "No Record Found",
        noRecordsFound: true, 
        currentPath: "/home",
      });
    } else {
      res.render("index", {
        nav1: "Dashboard",
        nav2: "Book",
        con1: "MEETING DASHBOARD",
        con2: "Select Timeframe",
        select1: "Today",
        select2: "Weekly",
        select3: "Monthly",
        datas: sortedData,
        currentPath: "/home",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.delete_entry = async (req, res) => {
  try {
    const meetingId = req.params.id;
    const meetingToDelete = await booking.findOne({ meetingId: meetingId });

    if (!meetingToDelete) {
      return res.status(404).json({ message: "Booking not found" });
    }

    await meetingToDelete.deleteOne({ meetingId: meetingId });

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const meetingId = req.params.id;
    const { startTime, endTime, roomId, employeeId } = req.body;
    console.log(startTime, endTime);
    const start = moment(startTime);
    const end = moment(endTime);
    const now = moment();

    if (start.isBefore(now) || end.isBefore(now)) {
      return res.status(400).json({ message: "Can't update to past dates and times" });
    }

    const existingBooking = await booking.findOne({ meetingId: meetingId });
    if (!existingBooking) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    const overlappingBooking = await booking.findOne({
      $and: [
        { roomId },
        { meetingId: { $ne: meetingId } },
        {
          $or: [
            { startTime: { $gte: start.toDate(), $lt: end.toDate() } },
            { endTime: { $gt: start.toDate(), $lte: end.toDate() } },
            { startTime: { $lt: start.toDate() }, endTime: { $gt: end.toDate() } },
          ],
        },
      ],
    });

    if (overlappingBooking) {
      return res.status(400).json({ message: "Overlapping booking exists" });
    }

    if (end.isBefore(start)) {
      return res.status(400).json({ message: "End time should be after start time" });
    }

    const duration = moment.duration(end.diff(start)).asHours();
    if (duration > 30) {
      return res.status(400).json({ message: "Meeting duration exceeds 30 hours" });
    }

    const updatedBooking = await booking.findOneAndUpdate(
      { meetingId: meetingId },
      {
        $set: {
          startTime: start.toDate(),
          endTime: end.toDate(),
          roomId: roomId,
          employeeId: employeeId,
        },
      },
      { new: true }
    );

    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

function UTCtolocalFormatter(dateString) {
  const localDateString = new Date(dateString).toLocaleString("en-US", {
    hour12: true,
  });

  const inputDate = new Date(localDateString);
  const year = inputDate.getFullYear();
  const month = (inputDate.getMonth() + 1).toString().padStart(2, "0");
  const day = inputDate.getDate().toString().padStart(2, "0");
  const hours = inputDate.getHours().toString().padStart(2, "0");
  const minutes = inputDate.getMinutes().toString().padStart(2, "0");
  const seconds = inputDate.getSeconds().toString().padStart(2, "0");
  const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  return formattedDateTime;
}

exports.getMeetingById = async (req, res) => {
  const meetingId = req.params.id;
  try {
    const meeting = await booking.findOne({ meetingId: meetingId });
    console.log(meeting);
    let bookingJSON = JSON.parse(JSON.stringify(meeting));
    bookingJSON.startTime = UTCtolocalFormatter(bookingJSON.startTime);
    bookingJSON.endTime = UTCtolocalFormatter(bookingJSON.endTime);
    if (meeting) {
      res.json({ success: true, data: bookingJSON });
    } else {
      res.status(404).json({ success: false, message: "Meeting not found" });
    }
  } catch (error) {
    console.error("Error fetching meeting by ID:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
