import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        postId: {
            type: String,
            required: true,
            index: true,
        },
        parentId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
            index: true,
        },
        authorId: {
            type: String,
            required: true,
            index: true,
        },
        authorName: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000,
        },
        likedBy: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

export const Comment = mongoose.model("Comment", commentSchema);
