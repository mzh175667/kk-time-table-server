const Employee = require("../models/employee");
const { HTTP_STATUS } = require("../utils/constants");
const mongoose = require("mongoose");
const employeeSchema = require("../validators/employeeSchema");
const employee = require("../models/employee");
const loginSchema = require("../validators/admin/loginSchema");
const bcrypt = require("bcrypt");
const CustomErrorHandler = require("../services/CustomErrorHandler");
const employeeLoginSchema = require("../validators/employeeLoginSchema");
const { successResponse, errorResponse } = require("../utils/response");
const timeTable = require("../models/timeTable");

const { ObjectId } = mongoose.Types;

const employeeController = {
  // store employee
  async create(req, res, next) {
    // validation
    const { error } = employeeSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    // generating password
    let chars = "0123456789";
    let pinLength = 6;
    let pin = "";
    let randomNumber;
    for (let i = 1; i <= pinLength; i++) {
      randomNumber = Math.floor(Math.random() * chars.length);
      pin += chars.substring(randomNumber, randomNumber + 1);
    }

    const exist = await Employee.exists({ pin: pin });
    if (exist) {
      for (let i = 0; i <= pinLength; i++) {
        randomNumber = Math.floor(Math.random() * chars.length);
        pin += chars.substring(randomNumber, randomNumber + 1);
      }
      return next();
    }
    // user existing
    try {
      const exist = await Employee.exists({ email: req.body.email });
      if (exist) {
        return next(
          CustomErrorHandler.alreadyExist("This email is already existing")
        );
      }
    } catch (err) {
      return next(err);
    }
    const { name, email, designation } = req.body;
    let employee;
    try {
      employee = await Employee.create({
        name,
        email,
        designation,
        pin: pin,
      });
      if (employee.length == 0) {
        return errorResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          "Sorry, Employee is not created"
        );
      }

      return successResponse(
        res,
        next,
        {
          employee: employee,
        },
        HTTP_STATUS.CREATED,
        "Created successfully"
      );
    } catch (err) {
      return next(err);
    }
  },
  //get employee
  async getEmployees(req, res, next) {
    let employee;

    try {
      employee = await Employee.find();
      employee.reverse();
      if (employee.length == 0) {
        return errorResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          "Something went wrong"
        );
      }

      return successResponse(
        res,
        next,
        {
          employee: employee,
        },
        HTTP_STATUS.CREATED,
        "Get all employees successfully"
      );
    } catch (err) {
      return next(err);
    }
  },
  //update employee
  async update(req, res, next) {
    const { name, designation } = req.body;
    let employee;

    try {
      employee = await Employee.findByIdAndUpdate(
        { _id: req.params.employeeId },
        {
          name: name,
          designation: designation,
        },
        { new: true }
      ).select("-__v -updatedAt");

      if (employee.length == 0) {
        return errorResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          "Something went wrong"
        );
      }

      return successResponse(
        res,
        next,
        {
          employee: employee,
        },
        HTTP_STATUS.CREATED,
        "updated successfully"
      );
    } catch (err) {
      return next(err);
    }
  },
  // get employee by _id
  async getEmployeeById(req, res, next) {
    let employee;
    try {
      employee = await Employee.findById({ _id: req.params.employeeId }).select(
        "-password -updatedAt -__v "
      );

      if (employee.length == 0) {
        return errorResponse(res, HTTP_STATUS.NOT_FOUND, "Not found");
      }

      return successResponse(
        res,
        next,
        {
          employee: employee,
        },
        HTTP_STATUS.CREATED,
        "get employee by id successfully"
      );
    } catch (err) {
      return next(err);
    }
  },
  // delete employee
  async delete(req, res, next) {
    let employee;
    const { employee_ids } = req.body;
    try {
      await Promise.all(
        employee_ids &&
          employee_ids.map(async (employee_id) => {
            const exist = await timeTable.exists({
              employeeId: employee_id,
            });
            console.log("employeeId=>", exist);
            if (exist) {
              employee = await timeTable.findByIdAndDelete(exist._id);
            }
            employee = await Employee.findByIdAndDelete(employee_id);
          })
      );
      if (employee == null) {
        return errorResponse(res, HTTP_STATUS.NOT_FOUND, "No Data Found!");
      }

      return successResponse(
        res,
        next,
        {
          employee: null,
        },
        HTTP_STATUS.OK,
        "Employees deleted successfully"
      );
    } catch (err) {
      console.log(err);
      return next(err);
    }
  },
  async userLogin(req, res, next) {
    // Validation
    const { error } = employeeLoginSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    let employee, result;
    try {
      employee = await Employee.findOne({
        pin: req.body.pin,
      });
      if (!employee) {
        return next(CustomErrorHandler.wrongCredentials());
      }
    } catch (err) {
      console.log("err=", err);
      return next(err);
    }

    // database whitlist
    result = {
      message: "success",
      data: employee,
      success: true,
    };
    res.status(200).json(result);
  },
};

module.exports = employeeController;
