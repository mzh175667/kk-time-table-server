const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const timeTableSchema = new mongoose.Schema(
  {
    checkIn: { type: Boolean, default: false },
    checkInTime: {
      type: String,
    },
    checkOut: { type: Boolean, default: false },
    checkOutTime: {
      type: String,
    },
    time: {
      type: String,
    },
    status: {
      type: String,
    },
    employeeId: {
      type: ObjectId,
      ref: "Employee",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TimeTable", timeTableSchema, "timeTable");
