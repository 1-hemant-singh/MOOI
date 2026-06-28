import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import { config } from "./config.js";
import { comparePassword, hashPassword, signToken, toPublicUser, verifyToken } from "./lib/auth.js";
import { connectToDatabase } from "./lib/mongoose.js";
import { Comment } from "./models/comment.model.js";
import { FileEntry } from "./models/file.model.js";
import { Post } from "./models/post.model.js";
import { User } from "./models/user.model.js";

const app = express();
let server;

const storage = multer.diskStorage({
    destination: async (_req, _file, cb) => {
        try {
            await fs.mkdir(config.uploadDir, { recursive: true });
            cb(null, config.uploadDir);
        } catch (error) {
            cb(error);
        }
    },
    filename: (_req, file, cb) => {
        const fileId = crypto.randomUUID();
        const ext = path.extname(file.originalname);
        cb(null, `${fileId}${ext}`);
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

app.use(
    cors({
        origin: config.clientOrigin,
        credentials: true,
    })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

function setAuthCookie(res, token) {
    res.cookie(config.cookieName, token, {
        httpOnly: true,
        sameSite: config.cookieSameSite,
        secure: config.cookieSecure,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
}

function clearAuthCookie(res) {
    res.clearCookie(config.cookieName, {
        httpOnly: true,
        sameSite: config.cookieSameSite,
        secure: config.cookieSecure,
    });
}

function toPostResponse(post) {
    const likedBy = Array.isArray(post.likedBy) ? post.likedBy : [];

    return {
        $id: post._id,
        title: post.title,
        content: post.content,
        featuredImage: post.featuredImage,
        status: post.status,
        userid: post.userid,
        authorName: post.authorName,
        likesCount: likedBy.length,
        $createdAt: post.createdAt instanceof Date ? post.createdAt.toISOString() : post.createdAt,
        $updatedAt: post.updatedAt instanceof Date ? post.updatedAt.toISOString() : post.updatedAt,
    };
}

function toFileResponse(file) {
    return {
        $id: file._id,
        ownerId: file.ownerId,
        originalName: file.originalName,
        storedName: file.storedName,
        mimeType: file.mimeType,
        size: file.size,
        $createdAt: file.createdAt instanceof Date ? file.createdAt.toISOString() : file.createdAt,
        $updatedAt: file.updatedAt instanceof Date ? file.updatedAt.toISOString() : file.updatedAt,
    };
}

function toCommentResponse(comment, user) {
    const likedBy = Array.isArray(comment.likedBy) ? comment.likedBy : [];

    return {
        id: String(comment._id),
        postId: comment.postId,
        parentId: comment.parentId ? String(comment.parentId) : null,
        authorId: comment.authorId,
        authorName: comment.authorName,
        content: comment.content,
        likesCount: likedBy.length,
        isLiked: user ? likedBy.includes(String(user._id)) : false,
        createdAt: comment.createdAt instanceof Date ? comment.createdAt.toISOString() : comment.createdAt,
        updatedAt: comment.updatedAt instanceof Date ? comment.updatedAt.toISOString() : comment.updatedAt,
    };
}

function buildCommentTree(comments, user) {
    const commentMap = new Map();
    const rootComments = [];

    comments.forEach((comment) => {
        commentMap.set(String(comment._id), {
            ...toCommentResponse(comment, user),
            replies: [],
        });
    });

    commentMap.forEach((comment) => {
        if (comment.parentId && commentMap.has(comment.parentId)) {
            commentMap.get(comment.parentId).replies.push(comment);
            return;
        }

        rootComments.push(comment);
    });

    return rootComments;
}

async function getCurrentUser(req) {
    const token = req.cookies[config.cookieName];

    if (!token) {
        return null;
    }

    try {
        const payload = verifyToken(token);
        return await User.findById(payload.userId);
    } catch {
        return null;
    }
}

async function requireAuth(req, res, next) {
    const user = await getCurrentUser(req);

    if (!user) {
        return res.status(401).json({ message: "Authentication required" });
    }

    req.user = user;
    return next();
}

async function removePhysicalFile(storedName) {
    if (!storedName) {
        return;
    }

    const filePath = path.join(config.uploadDir, storedName);
    await fs.rm(filePath, { force: true });
}

app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
});

app.post("/api/auth/register", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Name, email and password are required" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
        return res.status(409).json({ message: "Email already registered" });
    }

    const user = await User.create({
        name: String(name).trim(),
        email: normalizedEmail,
        passwordHash: await hashPassword(String(password)),
    });

    const token = signToken(String(user._id));
    setAuthCookie(res, token);

    return res.status(201).json({
        user: toPublicUser(user),
        session: { active: true },
    });
});

app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const isValid = await comparePassword(String(password || ""), user.passwordHash);

    if (!isValid) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken(String(user._id));
    setAuthCookie(res, token);

    return res.json({
        user: toPublicUser(user),
        session: { active: true },
    });
});

app.get("/api/auth/me", async (req, res) => {
    const user = await getCurrentUser(req);
    return res.json({ user: user ? toPublicUser(user) : null });
});

app.post("/api/auth/logout", (_req, res) => {
    clearAuthCookie(res);
    return res.json({ success: true });
});

app.get("/api/posts", async (req, res) => {
    const { status, scope } = req.query;
    const user = await getCurrentUser(req);
    let query = {};

    if (scope === "all") {
        if (!user) {
            return res.status(401).json({ message: "Authentication required" });
        }

        query = { userid: String(user._id) };
    } else {
        query = { status: status || "active" };
    }

    const posts = await Post.find(query).sort({ createdAt: -1 });

    return res.json({
        total: posts.length,
        documents: posts.map((post) => ({
            ...toPostResponse(post),
            isLiked: user ? (Array.isArray(post.likedBy) ? post.likedBy : []).includes(String(user._id)) : false,
        })),
    });
});

app.get("/api/posts/:id", async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }

    const user = await getCurrentUser(req);
    const canRead = post.status === "active" || (user && String(user._id) === post.userid);

    if (!canRead) {
        return res.status(404).json({ message: "Post not found" });
    }

    return res.json({
        ...toPostResponse(post),
        isLiked: user ? (Array.isArray(post.likedBy) ? post.likedBy : []).includes(String(user._id)) : false,
    });
});

app.get("/api/posts/:id/comments", async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }

    const user = await getCurrentUser(req);
    const canRead = post.status === "active" || (user && String(user._id) === post.userid);

    if (!canRead) {
        return res.status(404).json({ message: "Post not found" });
    }

    const comments = await Comment.find({ postId: post._id }).sort({ createdAt: 1 });

    return res.json({
        total: comments.length,
        comments: buildCommentTree(comments, user),
    });
});

app.post("/api/posts/:id/comments", requireAuth, async (req, res) => {
    const { content, parentId } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post || post.status !== "active") {
        return res.status(404).json({ message: "Post not found" });
    }

    const normalizedContent = String(content || "").trim();

    if (!normalizedContent) {
        return res.status(400).json({ message: "Comment cannot be empty" });
    }

    if (normalizedContent.length > 2000) {
        return res.status(400).json({ message: "Comment cannot be longer than 2000 characters" });
    }

    let normalizedParentId = null;

    if (parentId) {
        if (!mongoose.isValidObjectId(parentId)) {
            return res.status(400).json({ message: "Parent comment is invalid" });
        }

        const parentComment = await Comment.findOne({ _id: parentId, postId: post._id });

        if (!parentComment) {
            return res.status(400).json({ message: "Parent comment is invalid" });
        }

        normalizedParentId = parentComment._id;
    }

    const comment = await Comment.create({
        postId: post._id,
        parentId: normalizedParentId,
        authorId: String(req.user._id),
        authorName: req.user.name,
        content: normalizedContent,
    });

    return res.status(201).json(toCommentResponse(comment, req.user));
});

app.post("/api/posts", requireAuth, async (req, res) => {
    const { title, slug, content, featuredImage, status } = req.body;

    if (!title || !slug || !content || !featuredImage) {
        return res.status(400).json({ message: "Title, slug, content and featured image are required" });
    }

    const existingPost = await Post.findById(slug);
    if (existingPost) {
        return res.status(409).json({ message: "Slug already exists" });
    }

    const file = await FileEntry.findById(featuredImage);
    if (!file || file.ownerId !== String(req.user._id)) {
        return res.status(400).json({ message: "Featured image is invalid" });
    }

    const post = await Post.create({
        _id: slug,
        title: String(title).trim(),
        content,
        featuredImage,
        status: status === "inactive" ? "inactive" : "active",
        userid: String(req.user._id),
        authorName: req.user.name,
    });

    return res.status(201).json(toPostResponse(post));
});

app.patch("/api/posts/:id", requireAuth, async (req, res) => {
    const { title, content, featuredImage, status } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }

    if (post.userid !== String(req.user._id)) {
        return res.status(403).json({ message: "You can only edit your own posts" });
    }

    if (featuredImage) {
        const file = await FileEntry.findById(featuredImage);
        if (!file || file.ownerId !== String(req.user._id)) {
            return res.status(400).json({ message: "Featured image is invalid" });
        }
    }

    post.title = title ? String(title).trim() : post.title;
    post.content = content ?? post.content;
    post.featuredImage = featuredImage || post.featuredImage;
    post.status = status === "inactive" ? "inactive" : "active";
    await post.save();

    return res.json(toPostResponse(post));
});

app.delete("/api/posts/:id", requireAuth, async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }

    if (post.userid !== String(req.user._id)) {
        return res.status(403).json({ message: "You can only delete your own posts" });
    }

    const file = await FileEntry.findById(post.featuredImage);
    if (file) {
        await removePhysicalFile(file.storedName);
        await file.deleteOne();
    }

    await Comment.deleteMany({ postId: post._id });
    await post.deleteOne();

    return res.json({ success: true });
});

app.post("/api/posts/:id/like", requireAuth, async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }

    const userId = String(req.user._id);
    const likedBy = Array.isArray(post.likedBy) ? post.likedBy : [];
    const alreadyLiked = likedBy.includes(userId);

    post.likedBy = alreadyLiked
        ? likedBy.filter((id) => id !== userId)
        : [...likedBy, userId];

    await post.save();

    return res.json({
        ...toPostResponse(post),
        isLiked: !alreadyLiked,
    });
});

app.post("/api/comments/:id/like", requireAuth, async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(404).json({ message: "Comment not found" });
    }

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
    }

    const post = await Post.findById(comment.postId);

    if (!post || post.status !== "active") {
        return res.status(404).json({ message: "Comment not found" });
    }

    const userId = String(req.user._id);
    const likedBy = Array.isArray(comment.likedBy) ? comment.likedBy : [];
    const alreadyLiked = likedBy.includes(userId);

    comment.likedBy = alreadyLiked
        ? likedBy.filter((id) => id !== userId)
        : [...likedBy, userId];

    await comment.save();

    return res.json(toCommentResponse(comment, req.user));
});

app.post("/api/files", requireAuth, upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "File upload is required" });
    }

    const fileId = path.parse(req.file.filename).name;
    const fileRecord = await FileEntry.create({
        _id: fileId,
        ownerId: String(req.user._id),
        originalName: req.file.originalname,
        storedName: req.file.filename,
        mimeType: req.file.mimetype,
        size: req.file.size,
    });

    return res.status(201).json(toFileResponse(fileRecord));
});

app.get("/api/files/:id", async (req, res) => {
    const file = await FileEntry.findById(req.params.id);

    if (!file) {
        return res.status(404).json({ message: "File not found" });
    }

    const user = await getCurrentUser(req);
    const linkedPost = await Post.findOne({ featuredImage: file._id });
    const canRead =
        !linkedPost ||
        linkedPost.status === "active" ||
        (user && linkedPost.userid === String(user._id)) ||
        file.ownerId === String(user?._id || "");

    if (!canRead) {
        return res.status(404).json({ message: "File not found" });
    }

    return res.sendFile(path.join(config.uploadDir, file.storedName));
});

app.delete("/api/files/:id", requireAuth, async (req, res) => {
    const file = await FileEntry.findById(req.params.id);

    if (!file) {
        return res.status(404).json({ message: "File not found" });
    }

    if (file.ownerId !== String(req.user._id)) {
        return res.status(403).json({ message: "You can only delete your own files" });
    }

    const referencedByOtherUser = await Post.exists({
        featuredImage: file._id,
        userid: { $ne: String(req.user._id) },
    });

    if (referencedByOtherUser) {
        return res.status(403).json({ message: "File is in use by another user" });
    }

    await removePhysicalFile(file.storedName);
    await file.deleteOne();

    return res.json({ success: true });
});

app.use((error, _req, res, _next) => {
    if (error instanceof multer.MulterError) {
        return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: error.message || "Internal server error" });
});

async function startServer() {
    await fs.mkdir(config.uploadDir, { recursive: true });
    server = app.listen(config.port, config.host, () => {
        console.log(`MOOI backend listening on http://${config.host}:${config.port}`);
        console.log(`CORS allowed origin: ${config.clientOrigin}`);
        console.log(`Cookie settings: secure=${config.cookieSecure}, sameSite=${config.cookieSameSite}`);
    });

    server.on("error", (error) => {
        console.error("Backend server error:", error.message);
    });

    console.log("Connecting to MongoDB...");
    connectToDatabase().catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });
}

startServer().catch((error) => {
    console.error("Failed to start backend:", error.message);
    process.exit(1);
});
