import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: true,
            trim: true,
        },
        ownerId: {
            type: String,
            required: true,
            index: true,
        },
        originalName: {
            type: String,
            required: true,
        },
        storedName: {
            type: String,
            required: true,
        },
        mimeType: {
            type: String,
            required: true,
        },
        size: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
        _id: false,
    }
);

export const FileEntry = mongoose.model("FileEntry", fileSchema);
