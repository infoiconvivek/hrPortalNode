import course from "../../models/course.js";
//import fs from "fs"

class CourseController {
    // READ ALL DATA
    static index = async (req, res) => {
        res.send('Hello Sir');
    };
    static get = async (req, res) => {
        try {
            const data = await course.find();

            if (data.length > 0) {
                res.status(200).send({
                    status: "success",
                    message: "All Data Show!!!",
                    data: data,
                });
            } else {
                res.status(404).send({
                    status: "failed",
                    message: "Data not found...!",
                });
            }
        } catch (error) {
            console.log("Get All Data - ", error);
        }
    };

    // CREAT
    static create = async (req, res) => {
        try {
            const data = await course(req.body);
            const result = data.save();

            if (req.body) {
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
    static view = async (req, res) => {
        try {
            const data = await course.findById(req.params.id, req.body);
            if (data) {
                res.status(200).send({
                    status: "success",
                    message: "Single Data Show!!!",
                    data: data,
                });
            } else {
                res.status(404).send({
                    status: "failed",
                    message: "Data not found...!",
                });
            }
        } catch (error) {
            console.log("Single Data - ", error);
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