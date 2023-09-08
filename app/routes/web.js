
import express from "express";
import WebAuth from "../middleware/WebAuth.js"
import AuthController from "../controllers/AuthController.js";
import DashboardController from "../controllers/DashboardController.js"
import CoursesController from "../controllers/CoursesController.js";
//import groupRout from "express-group-routes";
//require('express-group-routes');
const router = express.Router();
const app = express();

router.get("/", AuthController.index);
router.get("/login", AuthController.login);
router.post("/auth-check", AuthController.authCheck);
router.get("/register", AuthController.register);
router.post("/post-register", AuthController.postRegister);
router.get("/logout", AuthController.logout);

//app.group('/admin', (router) => {
router.get('/dashboard', WebAuth, DashboardController.index);

router.get("/course", WebAuth, CoursesController.get);
router.get("/course/create", WebAuth, CoursesController.create);
router.post("/course/store", WebAuth, CoursesController.store);
router.get("/course/:id", WebAuth, CoursesController.edit);
router.put("/course/:id", WebAuth, CoursesController.update);
router.delete("/course/:id", WebAuth, CoursesController.delete);
//});
export default router;