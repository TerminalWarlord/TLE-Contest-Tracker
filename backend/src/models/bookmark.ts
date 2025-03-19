import mongoose, { Types } from "mongoose";
const Schema = mongoose.Schema;

const bookmarkSchema = new Schema({
    contestId: {
        type: Types.ObjectId,
        ref: 'Contest',
        required: true
    },
    userId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    }
});

bookmarkSchema.index({ contestId: 1, userId: 1 }, { unique: true });
export const Bookmark = mongoose.model("Bookmark", bookmarkSchema);
