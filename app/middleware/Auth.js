//const jwt = require("jsonwebtoken");
import jwt from "jsonwebtoken";
const config = process.env;

const verifyToken = (req, res, next) => {
    //const acc_token = req.cookies['access_token'];

    const token = req.body.token || req.query.token || req.headers["x-access-token"] || req.query.access_token;


    if (!token) {
        return res.status(403).send("A token is required for authentication");
        //return res.status(200).json({ "message": "A token is required for authentication", "status": false });
    }
    try {
        const decoded = jwt.verify(token, config.TOKEN_KEY);
        //req.user = decoded;
        decoded.token = token;
        req.session.user = decoded;

        //send role and permissions
        //req["user"] = decoded.roles[0]
        //req["permissions"] = decodeUser.roles[0].permissions

        req.user = decoded;
        //req.permissions = decodeUser.roles[0].permissions;
        //return res.status(401).send(req["user"]);
    } catch (err) {
        return res.status(401).send("Invalid Token");
        //return res.status(200).json({ "message": "Invalid Token", "status": false });
    }
    return next();
};

//module.exports = verifyToken;
export default verifyToken;