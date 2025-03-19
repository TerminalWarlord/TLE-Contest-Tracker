import mongoose from "mongoose";

const Schema = mongoose.Schema;

const videoSchema = new Schema({
    fullUrl: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    platform: {
        type: String,
        enum: ['CODEFORCES', 'CODECHEF', 'LEETCODE'],
        default: 'CODEFORCES'
    }
});


export const Video = mongoose.model("Video", videoSchema);