import mongoose from "mongoose";
const adminSchema = new mongoose.Schema({
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    email: { type: String, unique: true },
    password: { type: String },
    token: { type: String },
});

const admin = mongoose.model("admins", adminSchema);
export default admin;