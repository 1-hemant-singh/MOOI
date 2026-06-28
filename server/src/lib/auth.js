import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config.js";

export async function hashPassword(password) {
    return bcrypt.hash(password, 10);
}

export async function comparePassword(password, passwordHash) {
    return bcrypt.compare(password, passwordHash);
}

export function signToken(userId) {
    return jwt.sign({ userId }, config.jwtSecret, { expiresIn: "7d" });
}

export function verifyToken(token) {
    return jwt.verify(token, config.jwtSecret);
}

export function toPublicUser(user) {
    return {
        $id: String(user._id),
        name: user.name,
        email: user.email,
        $createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : user.createdAt,
        $updatedAt: user.updatedAt instanceof Date ? user.updatedAt.toISOString() : user.updatedAt,
    };
}
