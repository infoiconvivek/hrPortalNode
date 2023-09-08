import Admin from "../models/Admin.js";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
//import res from "express/lib/response";
//import fs from "fs"
var __dirname = path.resolve();
class AuthController {
    static index = async (req, res) => {
        res.redirect('/login');
    }
    static login = async (req, res) => {
        console.log('user', req.session.user)
        if (req.session.user) {
            res.redirect('/dashboard');
        } else {
            res.render('login');
        }

    }
    static authCheck = async (req, res) => {
        try {
            // Get user input
            //res.send(req.body);
            const { email, password } = req.body;

            // Validate user input
            if (!(email && password)) {
                res.status(400).send("All input is required");
            }
            // Validate if user exist in our database
            const user = await Admin.findOne({ email });
            //res.send(user);
            if (user && (await bcrypt.compare(password, user.password))) {
                // Create token
                const token = jwt.sign(
                    { user_id: user._id, email, fname: user.first_name, role: 'admin' },
                    process.env.TOKEN_KEY,
                    {
                        expiresIn: "6h",
                    }
                );
                const authuser = {
                    token: token
                };
                // save user token

                //res.cookie("access_token", token, { httpOnly: true, secure: true, maxAge: 3600000 });
                /*return res.cookie('access_token', token,
                    {
                        secure: process.env.ENVIRONMENT !== "local",
                        httpOnly: true,
                        maxAge: 300000,
                        sameSite: "none", path: "/",
                    });*/
                //user.token = token;
                req.session.user = authuser;

                return res.redirect('/dashboard');

                // user
                //res.status(200).json(user);
            }
            res.status(400).send("Invalid Credentials");
        } catch (err) {
            console.log(err);
        }
    }
    static register = async (req, res) => {
        res.render('register');
    }
    static postRegister = async (req, res) => {

        let encryptedPassword;
        let err_msg;
        // Our register logic starts here
        try {
            // Get user input
            const { first_name, last_name, email, password, cpassword } = req.body;

            // Validate user input
            if (!(email && password && first_name && last_name)) {
                res.status(400).send("All input is required");
                err_msg = "All input is required";
            }

            if (password !== cpassword) {
                res.status(400).send("password not match");
                err_msg = "password not match";
            }
            // check if user already exist
            // Validate if user exist in our database
            const oldUser = await Admin.findOne({ email });

            if (oldUser) {
                //return res.status(409).send("User Already Exist. Please Login");
                err_msg = "Some error occured , plz register again.";

            }

            //Encrypt user password
            encryptedPassword = await bcrypt.hash(password, 10);

            // Create user in our database
            const user = await Admin.create({
                first_name,
                last_name,
                email: email.toLowerCase(), // sanitize: convert email to lowercase
                password: encryptedPassword,
            });

            // Create token
            const token = jwt.sign(
                { user_id: user._id, email, fname: user.first_name, role: 'admin' },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "6h",
                }
            );
            const authuser = {
                token: token
            };
            // save user token
            //user.token = token;
            req.session.user = authuser;

            // save user token
            //user.token = token;
            res.redirect('/dashboard');
            // return new user
            //res.status(201).json(user);
            //return res.render('register', { err_msg: err_msg });

        } catch (err) {
            return res.render('register', { err_msg: err.message });
        }
        // Our register logic ends here
    }

    static logout = async (req, res) => {
        req.session.user = '';
        res.redirect('/login');
    }
}
export default AuthController;