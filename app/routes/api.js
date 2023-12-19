import express, { Router } from "express";
import ApiAuth from "../middleware/Auth.js"

import AuthController from "../controllers/Api/AuthController.js";
import DepartmentController from "../controllers/Api/DepartmentController.js";
import DesignationController from "../controllers/Api/DesignationController.js";
import EmployeeController from "../controllers/Api/EmployeeController.js";
import multer from "multer";
import upload from "../middleware/multerMiddleware.js"
import LeaveController from "../controllers/Api/LeaveController.js";
import HolidayController from "../controllers/Api/HolidayController.js";
import AttendanceController from "../controllers/Api/AttendanceController.js";
import DashboardController from "../controllers/Api/DashboardController.js"
import RoleController from "../controllers/Api/RoleController.js";
import LeaveTypeController from "../controllers/Api/LeaveTypeController.js";
const router = express.Router();

router.post("/login", AuthController.authCheck);
router.post("/register", AuthController.postRegister);
router.post("/logout", AuthController.logout);


router.get("/dashboard", ApiAuth, DashboardController.get);

router.get("/departments", ApiAuth, DepartmentController.get);
router.post("/department/create", ApiAuth, DepartmentController.create);
router.delete("/department/remove/:id", ApiAuth, DepartmentController.delete);

router.get("/designations", ApiAuth, DesignationController.get);
router.post("/save-designation", ApiAuth, DesignationController.create);
router.get("/remove-designation/:id", ApiAuth, DesignationController.delete);

router.get("/leave-type", ApiAuth, LeaveTypeController.get);
router.post("/save-leave-type", ApiAuth, LeaveTypeController.create);
router.get("/remove-leave-type/:id", ApiAuth, LeaveTypeController.delete);

router.get("/roles", ApiAuth, RoleController.get);

router.post("/save-leave", ApiAuth, LeaveController.create);
router.get("/leaves", ApiAuth, LeaveController.get);
router.get("/download-leaves", ApiAuth, LeaveController.downloadLeaves);
router.get("/leave/:id", ApiAuth, LeaveController.getById);
router.patch("/emp-leave/:id", ApiAuth, LeaveController.leaveUpdate);
router.put("/update-leave/:id", ApiAuth, LeaveController.update);

router.get("/hrtl-list/", EmployeeController.getAllTlHr);
router.get("/employee-list/:id", EmployeeController.getAll);
router.get("/employees/:page?", EmployeeController.get);
router.get("/employees-attendance/:month?", EmployeeController.getEmpAttendance);

router.patch("/employee-change-status/:id", ApiAuth, EmployeeController.changeStatus);
router.get("/employee/:id", ApiAuth, EmployeeController.getById);
router.get("/employee-view/:id", ApiAuth, EmployeeController.view);
router.post("/create-employee", upload.single('profile_img'), ApiAuth, EmployeeController.create);
router.get("/remove-employee/:id", ApiAuth, EmployeeController.remove);
router.patch("/update-profile/:id", upload.single('profile_img'), ApiAuth, EmployeeController.update);
router.patch("/update-password/:id", ApiAuth, EmployeeController.updatePassword);
router.get("/employee-leave/:id", ApiAuth, EmployeeController.getLeaveById);

router.post("/save-holiday", ApiAuth, HolidayController.create);
router.get("/holidays", ApiAuth, HolidayController.get);
router.get("/remove-holidays/:id", ApiAuth, HolidayController.remove);

router.post("/download-attendance", ApiAuth, AttendanceController.downloadAttendance);
router.post("/download-all-attendance", ApiAuth, AttendanceController.downloadAllAttendance);
router.post("/punch-in-out", ApiAuth, AttendanceController.create);
router.patch("/update-attendance/", ApiAuth, AttendanceController.UpdateAttendance);
router.get("/punch/:id", ApiAuth, AttendanceController.getOneByUserId);
router.get("/punch-user/:id", ApiAuth, AttendanceController.getByUserId);



export default router;