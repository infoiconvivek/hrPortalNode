
import mongoose from "mongoose";

// SCHMA
const HolidaySchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        date: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
    }
);

// MODEL
const holiday = mongoose.model("holidays", HolidaySchema);

export default holiday;