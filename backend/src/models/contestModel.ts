import mongoose, { Types } from "mongoose";
import { ContestType, Platform } from "../types/contest";


const Schema = mongoose.Schema;
const contestSchema = new Schema<ContestType>({
    title: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    youtubeUrl: { type: String },
    platform: {
        type: String,
        enum: Object.values(Platform),
        default: Platform.CODEFORCES
    },
    startsAt: { type: Number, required: true },
    duration: { type: Number, required: true },
    hasEnded: { type: Boolean, default: false },
})


export const Contest = mongoose.model('Contest', contestSchema);