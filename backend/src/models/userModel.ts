import mongoose, { ObjectId, Types } from "mongoose";
import { UserRole } from "../types/user";
const Schema = mongoose.Schema;


const userSchema = new Schema({
    email: { type: String, unique: true, required: true },
    name: { type: String },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    },
    password: { type: String, required: true },
    bookmark: [{ type: Types.ObjectId, ref: "Bookmark" }]
});


export const User = mongoose.model('User', userSchema); 