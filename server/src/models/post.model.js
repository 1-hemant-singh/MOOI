import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: true,
            trim: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
        },
        featuredImage: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
        userid: {
            type: String,
            required: true,
            index: true,
        },
        authorName: {
            type: String,
            required: true,
            trim: true,
        },
        likedBy: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
        _id: false,
    }
);

export const Post = mongoose.model("Post", postSchema);
