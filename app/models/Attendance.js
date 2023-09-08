import mongoose from "mongoose";

// SCHMA
const AttendanceSchema = new mongoose.Schema(
    {
        in_time: { type: Date, default: Date.now },
        out_time: { type: Date, required: false },
        user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
        ip: { type: String, required: false },
    }
);

// MODEL
const attendance = mongoose.model("attendances", AttendanceSchema);

export default attendance;