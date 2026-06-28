import mongoose from "mongoose";
import { config } from "../config.js";

export async function connectToDatabase() {
    if (!config.mongoUri) {
        throw new Error("MONGODB_URI is missing in the environment");
    }

    mongoose.connection.on("connected", () => {
        console.log("MongoDB connected");
    });

    mongoose.connection.on("error", (error) => {
        console.error("MongoDB connection error:", error.message);
    });

    await mongoose.connect(config.mongoUri, {
        dbName: config.mongoDbName || undefined,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 10000,
    });
}
