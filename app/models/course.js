import mongoose from "mongoose";

// SCHMA
const CourseSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },

        content: { type: String, required: true },
        sort_desc: { type: String, required: false },
        instrutor: { type: String, required: false },
        lessons: { type: String, required: false },
        duration: { type: String, required: false },
        language: { type: String, required: false },
        certificate: { type: String, required: false },
        course_type: { type: String, required: false },

        price: { type: Number, required: false },

        createdAt: { type: Date, default: Date.now },
    }
);
//status: { type: String },
//category: { type: String, required: true },
//image: { type: String, required: false },
// MODEL
const course = mongoose.model("courses", CourseSchema);

export default course;