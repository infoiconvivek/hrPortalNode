import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    email: { type: String, unique: true },
    password: { type: String },
    token: { type: String },
    company: { type: String, default: null },
    emp_id: { type: String, unique: true },
    join_data: { type: String, default: null },
    phone: { type: String },
    department: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'departments' },
    designation: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'designations' },
    description: { type: String, default: null },
    profile_img: { type: String, default: null },
    leaves: { type: Number, double: true, default: 0 },
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'roles' }],
    status: { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now },
});

const user = mongoose.model("users", userSchema);
export default user;