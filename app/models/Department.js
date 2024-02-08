import mongoose from "mongoose";

// SCHMA
const DepartmentSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        dept_head: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'users' },
        emp_under: { type: String, required: false },
        createdAt: { type: Date, default: Date.now },
    }
);

// MODEL
const department = mongoose.model("departments", DepartmentSchema);

export default department;