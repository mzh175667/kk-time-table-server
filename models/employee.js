const mongoose = require("mongoose");
const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    pin: {
      type: String,
    },
    originalPin: {
      type: String,
    },
    designation: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema, "employee");
