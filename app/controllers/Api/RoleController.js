import Role from "../../models/Role.js";

class RoleController {
    static get = async (req, res) => {
        try {
            const data = await Role.find();
            if (data.length > 0) {
                res.status(200).send(data);
            } else {
                res.status(404).send("Data not found...!");
            }
        } catch (error) {
            res.status(404).send(error);
        }
    };
    static create = async (req, res) => {

        try {
            // Get user input
            const { name, date } = req.body;
            const id = req.body.id;
            // Validate user input
            if (!(name && date)) {
                return res.status(400).send("All input is required");
            }
            if (id) {
                await Role.findByIdAndUpdate(id, { name: name, date: date });
                return res.status(200).send("created");
            } else {
                // Create user in our database
                const role = await Role.create({ name, date });
                return res.status(200).send("created");
            }
        } catch (err) {
            return res.status(400).json(err);
        }
    }
    static remove = async (req, res) => {
        try {

            const data = await Role.deleteOne({ _id: req.params.id });

            if (data) {
                return res.status(200).send('success');
            } else {
                return res.status(404).send('failed');
            }
        } catch (error) {
            return res.status(404).send(error);
        }
    }

}
export default RoleController;