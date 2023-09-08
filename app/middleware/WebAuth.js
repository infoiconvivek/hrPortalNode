//const jwt = require("jsonwebtoken");
import jwt from "jsonwebtoken";
const config = process.env;

const verifyToken = (req, res, next) => {


    //console.log(req.session.user);
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"] || req.session.user ? req.session.user.token : '';

    if (!token) {
        return res.status(403).send("A token is required for authentication.");
    }
    try {
        const decoded = jwt.verify(token, config.TOKEN_KEY);
        //req.user = decoded;
        decoded.token = token;
        req.session.user = decoded;



    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
};

//module.exports = verifyToken;
export default verifyToken;