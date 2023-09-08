import mongoose from "mongoose";


const roleSchema = new mongoose.Schema({
    name: String,
    permissions: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
})

export default mongoose.model("roles", roleSchema);

