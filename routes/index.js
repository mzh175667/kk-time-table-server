const express = require("express");
const router = express.Router();
const {
  employeesController,
  timeTableController,
  registerController,
  loginController,
  adminController,
} = require("../controller");
const auth = require("../middlewares/auth");

// admin_user routes
router.post("/admin/register", registerController.register);
router.post("/admin/login", loginController.login);
router.get("/admin/me", auth, adminController.me);

// employee routes
router.post("/employee", employeesController.create);
router.post("/employee/login", employeesController.userLogin);
router.get("/employees", employeesController.getEmployees);
router.put("/employee/:employeeId", employeesController.update);
router.get("/employee/:employeeId", employeesController.getEmployeeById);
router.delete("/employee", employeesController.delete);

// timetable routes
router.post("/checkin/:employeeId", timeTableController.checkIn);
router.post("/checkout/:id", timeTableController.checkOut);
router.get("/timeTable", timeTableController.getTimeTables);
router.get("/timeTable/:employeeId", timeTableController.getSingleTimeTable);
router.delete("/timeTable", timeTableController.delete);

module.exports = router;
