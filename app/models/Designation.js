import mongoose from "mongoose";

// SCHMA
const DesignationSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
    }
);

// MODEL
const designation = mongoose.model("designations", DesignationSchema);

export default designation;