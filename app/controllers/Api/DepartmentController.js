import Department from "../../models/Department.js";
//import fs from "fs"

class DepartmentController {
    // READ ALL DATA   
    static get = async (req, res) => {
        try {
            const data = await Department.find().populate("dept_head");

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
            res.status(404).send(error);
        }
    };

    // CREAT
    static create = async (req, res) => {
        try {

            const { name, dept_head, emp_under } = req.body;
            const id = req.body.id;

            if (!(name && dept_head)) {
                //return res.status(400).send("All input is required");
                return res.status(404).send({
                    status: "failed",
                    message: "All input is required",
                });
            }
            if (id) {
                const result = await Department.findByIdAndUpdate(id, { name, dept_head, emp_under });
                return res.status(200).send({
                    status: "success",
                    message: "Create New Data successful!!!",
                    result: result,
                });
            } else {
                // Create user in our database
                const result = await Department.create({ name, dept_head, emp_under });
                return res.status(200).send({
                    status: "success",
                    message: "Create New Data successful!!!",
                    result: result,
                });
            }
            // const data = await Department(req.body);
            // const result = data.save();

        } catch (error) {
            res.status(404).send({
                status: "failed",
                message: error,
            });

        }
    };

    // READ SINGLE DATA
    static view = async (req, res) => {
        try {
            const data = await Department.findById(req.params.id, req.body);
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
            res.status(404).send(error);
        }
    };

    // UPDATE
    static update = async (req, res) => {
        try {
            const data = await Department.findByIdAndUpdate(req.params.id, req.body);
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
            res.status(404).send(error);
        }
    };

    // DELETE
    static delete = async (req, res) => {
        try {
            const data = await Department.findByIdAndDelete(req.params.id, req.body);
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
            res.status(404).send(error);
        }
    };
}

export default DepartmentController;