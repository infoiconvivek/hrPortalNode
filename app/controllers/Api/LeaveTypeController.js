import LeaveType from "../../models/LeaveType.js";
//import fs from "fs"

class LeaveTypeController {
    // READ ALL DATA   
    static get = async (req, res) => {
        try {
            const data = await LeaveType.find();

            if (data.length > 0) {
                res.status(200).send(data);
            } else {
                res.status(404).send("Data not found...!");
            }
        } catch (error) {
            res.status(404).send(error);
        }
    };

    // CREAT
    static create = async (req, res) => {
        try {
            const { name } = req.body;
            const id = req.body.id;
            if (id) {
                const data = await LeaveType.findByIdAndUpdate(id, { name: name });
                return res.status(200).send(data);
            } else {
                // Create user in our database
                //const holiday = await Holiday.create({ name, date });
                const data = await LeaveType(req.body);
                const result = data.save();
                return res.status(200).send(result);
            }

        } catch (error) {
            res.status(404).send(error);
        }
    };

    // READ SINGLE DATA
    static view = async (req, res) => {
        try {
            const data = await LeaveType.findById(req.params.id, req.body);
            if (data) {
                res.status(200).send(data);
            } else {
                res.status(404).send("Data not found...!");
            }
        } catch (error) {
            res.status(404).send(error);
        }
    };

    // UPDATE
    static update = async (req, res) => {
        try {
            res.status(200).send(req.params.id);
            const data = await LeaveType.findByIdAndUpdate(req.params.id, req.body);
            if (data) {
                res.status(200).send(data);
            } else {
                res.status(404).send("Data not Update...!");
            }
        } catch (error) {
            res.status(404).send(error);
        }
    };

    // DELETE
    static delete = async (req, res) => {
        try {
            const data = await LeaveType.findByIdAndDelete(req.params.id, req.body);
            if (data) {
                res.status(200).send(data);
            } else {
                res.status(404).send("Data not Delete...!");
            }
        } catch (error) {
            res.status(404).send(error);
        }
    };
}

export default LeaveTypeController;