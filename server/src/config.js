import "dotenv/config";
import path from "path";

const rootDir = process.cwd();

const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const isHttpsClient = clientOrigin.startsWith("https://");

export const config = {
    port: Number(process.env.PORT || 4000),
    host: process.env.HOST || "0.0.0.0",
    clientOrigin,
    jwtSecret: process.env.JWT_SECRET || "replace-this-dev-secret",
    cookieName: "mooi_token",
    cookieSecure: process.env.COOKIE_SECURE === "true" || isHttpsClient,
    cookieSameSite: process.env.COOKIE_SAME_SITE || (isHttpsClient ? "none" : "lax"),
    mongoUri: process.env.MONGODB_URI || "",
    mongoDbName: process.env.MONGODB_DB_NAME || "",
    uploadDir: path.join(rootDir, "server", "uploads"),
};
