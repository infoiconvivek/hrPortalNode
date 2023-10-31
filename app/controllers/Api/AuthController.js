import User from "../../models/User.js";
import Role from "../../models/Role.js";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
//import res from "express/lib/response";
//import fs from "fs"
var __dirname = path.resolve();
class AuthController {
    static authCheck = async (req, res) => {
        try {
            // Get user input

            //return res.status(200).send('ji');
            const { email, password } = req.body;

            // Validate user input
            if (!(email && password)) {
                //res.status(400).send("All input is required");
                return res.status(400).json({ "message": "All input is required", "status": false });
            }
            // Validate if user exist in our database
            const user = await User.findOne({ email, status: 1 });

            if (user && (await bcrypt.compare(password, user.password))) {
                // Create token
                const token = jwt.sign(
                    { user_id: user._id, email, fname: user.first_name, roles: user.roles[0] },
                    process.env.TOKEN_KEY,
                    {
                        expiresIn: "9h",
                    }
                );

                const id = user.roles[0];
                const roles = await Role.findOne({ _id: id });
                if (roles) {
                    const authuser = {
                        token: token,
                        user_id: user._id,
                        email: email,
                        fname: user.first_name,
                        lname: user.last_name,
                        profile_img: user.profile_img,
                        roles: roles
                    };
                    // save user token
                    //res.cookie("access_token", token, { httpOnly: true, secure: true, maxAge: 3600000 });
                    /*res.cookie('access_token', token,
                        {
                            secure: process.env.ENVIRONMENT !== "local",
                            httpOnly: true,
                            maxAge: 300000,
                            sameSite: "none", path: "/",
                        });*/
                    user.token = token;
                    //req.session.user = authuser;
                    // user
                    return res.status(200).json({ "data": authuser, "status": true });
                } else {
                    res.status(400).json({ "message": "Role is not Assign", "status": false });
                }
            } else {
                res.status(400).json({ "message": "Invalid Credentials", "status": false });
            }


        } catch (err) {
            res.status(400).json({ "message": err, "status": false });
        }
    }

    static postRegister = async (req, res) => {

        let encryptedPassword;
        let err_msg;
        const type = req.body.type || 'Employee';
        const roleData = await Role.findOne({ role: type })
        console.log(roleData, "13")
        const roles = [roleData._id]

        // Our register logic starts here
        try {
            // Get user input
            const { first_name, last_name, email, password } = req.body;

            // Validate user input
            if (!(email && password && first_name && last_name)) {
                res.status(400).send("All input is required");
            }

            // check if user already exist
            // Validate if user exist in our database
            const oldUser = await User.findOne({ email });

            if (oldUser) {
                return res.status(409).send("User Already Exist. Please Login");
            }

            //Encrypt user password
            encryptedPassword = await bcrypt.hash(password, 10);

            // Create user in our database
            const user = await User.create({
                first_name,
                last_name,
                email: email.toLowerCase(), // sanitize: convert email to lowercase
                password: encryptedPassword,
                roles,
            });

            // Create token
            const token = jwt.sign(
                { user_id: user._id, email, fname: user.first_name, roles: roles },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "6h",
                }
            );
            res.cookie('access_token', token,
                {
                    secure: process.env.ENVIRONMENT !== "local",
                    httpOnly: true,
                    maxAge: 300000,
                    sameSite: "none", path: "/",
                });
            const authuser = {
                token: token,
                first_name,
                last_name,
                email: email.toLowerCase(),
            };

            user.token = token;

            // return new user
            res.status(200).json(user);

        } catch (err) {
            res.status(400).json(err);
        }
        // Our register logic ends here
    }
    static logout = async (req, res) => {
        try {
            req.session.user = '';
            res.status(200).send('success');
        } catch (err) {
            res.status(400).send(err);
        }
    }

}
export default AuthController;