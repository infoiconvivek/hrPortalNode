import mongoose from "mongoose";

// SCHMA
const LeaveTypeSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
    }
);

// MODEL
const leaveType = mongoose.model("leave_type", LeaveTypeSchema);

export default leaveType;