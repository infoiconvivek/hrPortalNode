import course from "../models/course.js";
import cookieParser from "cookie-parser";
//import fs from "fs"

class CourseController {
    // READ ALL DATA

    static get = async (req, res) => {
        try {
            const data = await course.find();
            return res.render('course/list', { data: data });
        } catch (error) {
            return res.render('course/list', { err_msg: err.message });
        }
    };

    // CREAT
    static create = async (req, res) => {
        const data = '';
        return res.render('course/add');
    }
    static store = async (req, res) => {
        try {


            const data = await course(req.body);

            const result = data.save();

            if (req.body) {
                res.redirect('/course');
                res.status(201).send({
                    status: "success",
                    message: "Create New Data successful!!!",
                    result: result,
                });
            } else {
                res.status(404).send({
                    status: "failed",
                    message: "Data not Created...!",
                });
            }
        } catch (error) {
            console.log("Create Data - ", error);
        }
    };

    // READ SINGLE DATA
    static edit = async (req, res) => {
        try {
            const data = await course.findById(req.params.id, req.body);
            console.log(data);
            return res.render('course/add');
        } catch (error) {
            res.redirect('course/create')
        }
    };

    // UPDATE
    static update = async (req, res) => {
        try {
            const data = await course.findByIdAndUpdate(req.params.id, req.body);
            if (data) {
                res.status(200).send({
                    status: "success",
                    message: "Data Update Successful!!!",
                    data: data,
                });
            } else {
                res.status(404).send({
                    status: "failed",
                    message: "Data not Update...!",
                });
            }
        } catch (error) {
            console.log("Update Data - ", error);
        }
    };

    // DELETE
    static delete = async (req, res) => {
        try {
            const data = await course.findByIdAndDelete(req.params.id, req.body);
            if (data) {
                res.status(200).send({
                    status: "success",
                    message: "Delete data Successful!!!",
                    data: data,
                });
            } else {
                res.status(404).send({
                    status: "failed",
                    message: "Data not Delete...!",
                });
            }
        } catch (error) {
            console.log("Delete Data - ", error);
        }
    };
}

export default CourseController;