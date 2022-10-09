const employee = require("../models/employee");
const TimeTable = require("../models/timeTable");
const CustomErrorHandler = require("../services/CustomErrorHandler");
const { HTTP_STATUS } = require("../utils/constants");
const { errorResponse, successResponse } = require("../utils/response");
const checkInSchema = require("../validators/checkInSchema");
const checkOutSchema = require("../validators/checkOutSchema");

const timeTaleController = {
  // store timeTable
  async checkIn(req, res, next) {
    // validation
    const { error } = checkInSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { checkInTime, date, checkOutTime } = req.body;
    let timeTable;
    try {
      timeTable = await TimeTable.create({
        checkIn: true,
        checkInTime,
        date,
        checkOutTime,
        checkOut: false,
        employeeId: req.params.employeeId,
      });
      if (timeTable.length == 0) {
        return errorResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          "Sorry, you are not able to Check In"
        );
      }

      return successResponse(
        res,
        next,
        {
          timeTable: timeTable,
        },
        HTTP_STATUS.OK,
        "CheckIn successfully"
      );
    } catch (err) {
      return next(err);
    }
  },
  async checkOut(req, res, next) {
    // validation
    const { error } = checkOutSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { checkOutTime } = req.body;
    let timeTable;
    try {
      timeTable = await TimeTable.findByIdAndUpdate(
        { _id: req.params.id },
        {
          checkOut: true,
          checkOutTime: checkOutTime,
        },
        { new: true }
      ).select("-__v -updatedAt");
      if (timeTable.length == 0) {
        return errorResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          "Sorry, you are not able to CheckOut(This user is not existing for today)"
        );
      }

      return successResponse(
        res,
        next,
        {
          timeTable: timeTable,
        },
        HTTP_STATUS.OK,
        "CheckOut successfully"
      );
    } catch (err) {
      return next(err);
    }
  },
  //   //get timeTable
  async getTimeTables(req, res, next) {
    let allData, timeTable;

    try {
      const { name, date } = req.query;
      if (name) {
        timeTable = await employee.aggregate([
          {
            $match: {
              name: { $regex: name, $options: "i" },
            },
          },
          {
            $lookup: {
              from: "timeTable",
              as: "employeeId",
              let: { user_id: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$employeeId", "$$user_id"] }],
                    },
                  },
                },
              ],
            },
          },
          { $unwind: "$employeeId" },
        ]);
      } else {
        timeTable = await TimeTable.find({
          createdAt: {
            $lt: new Date(),
            $gte: new Date(new Date().setDate(new Date().getDate() - date)),
          },
        })
          .select("-updatedAt -__v ")
          .populate("employeeId");
      }
      allData = await TimeTable.find().populate("employeeId");
      if (timeTable.length == 0) {
        return errorResponse(res, HTTP_STATUS.NOT_FOUND, "No Data Found!");
      }

      return successResponse(
        res,
        next,
        {
          totalRecords: timeTable.length,
          allData: allData,
          timeTable: timeTable,
        },
        HTTP_STATUS.OK,
        "Get all timeTables successfully"
      );
    } catch (err) {
      return next(err);
    }
  },
  // get timeTables by _id
  async getSingleTimeTable(req, res, next) {
    let timeTable;
    try {
      timeTable = await TimeTable.findById({
        _id: req.params.employeeId,
      })
        .select("-updatedAt -__v ")
        .populate("employeeId");
      if (timeTable.length == 0) {
        return errorResponse(res, HTTP_STATUS.NOT_FOUND, "No Data Found!");
      }

      return successResponse(
        res,
        next,
        {
          timeTable: timeTable,
        },
        HTTP_STATUS.OK,
        "TimeTable of this employee got successfully"
      );
    } catch (err) {
      return next(err);
    }
  },
  //   // delete user
  async delete(req, res, next) {
    let timeTable;
    const { timeTable_ids } = req.body;
    try {
      await Promise.all(
        timeTable_ids &&
          timeTable_ids.map(async (timeTable_id) => {
            timeTable = await TimeTable.findByIdAndDelete(timeTable_id);
          })
      );
      if (timeTable == null) {
        return errorResponse(res, HTTP_STATUS.NOT_FOUND, "No Data Found!");
      }

      return successResponse(
        res,
        next,
        {
          timeTable: null,
        },
        HTTP_STATUS.OK,
        "TimeTables deleted successfully"
      );
    } catch (err) {
      return next(err);
    }
  },
};

module.exports = timeTaleController;
