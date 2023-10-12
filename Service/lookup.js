const bookings = require('../Model/booking');
async function getBooking(){

    let data = await bookings.aggregate([
        [
            {
              $lookup: {
                from: "rooms",
                localField: "roomId",
                foreignField: "roomId",
                as: "room",
              },
            },
            {
              $lookup: {
                  from: "employees",
                  localField: "employeeId",
                  foreignField: "employeeId",
                  as: "employee",
                },
            },
            {
              $unwind: {
                  path: "$room",
                },
            },
            {
              $unwind: {
                path: "$employee",
              },
            },
            {
              $addFields: {
                  roomName: "$room.room",
                },
            },
            {
              $addFields: {
                employeeName: "$employee.employeeName",
              },
            },
            {
              $project:
                {
                  _id: 0,
                  room: 0,
                  employee: 0,
                  __v: 0,
                  roomId: 0,
                  employeeId: 0,
                },
            },
          ]
      ]);
    return data;
}

 

module.exports = { getBooking } 