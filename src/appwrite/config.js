import conf from "../conf/conf.js";

class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

const REQUEST_TIMEOUT_MS = 8000;

async function request(path, options = {}) {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    let response;

    try {
        response = await fetch(`${conf.apiBaseUrl}${path}`, {
            credentials: "include",
            signal: controller.signal,
            ...options,
        });
    } catch (error) {
        if (error.name === "AbortError") {
            throw new ApiError("Request timed out", 408);
        }

        throw error;
    } finally {
        window.clearTimeout(timeoutId);
    }

    const isJson = response.headers.get("content-type")?.includes("application/json");
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
        throw new ApiError(data?.message || "Request failed", response.status);
    }

    return data;
}

export class Service {
    async createPost({ title, slug, content, featuredImage, status, userId }) {
        return request("/api/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title,
                slug,
                content,
                featuredImage,
                status,
                userId,
            }),
        });
    }

    async updatePost(slug, { title, content, featuredImage, status }) {
        return request(`/api/posts/${slug}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title,
                content,
                featuredImage,
                status,
            }),
        });
    }

    async deletePost(slug) {
        try {
            await request(`/api/posts/${slug}`, {
                method: "DELETE",
            });
            return true;
        } catch {
            return false;
        }
    }

    async getPost(slug) {
        try {
            return await request(`/api/posts/${slug}`);
        } catch {
            return false;
        }
    }

    async getPosts(queries = [{ type: "equal", field: "status", value: "active" }]) {
        const searchParams = new URLSearchParams();

        if (queries.length === 0) {
            searchParams.set("scope", "all");
        } else {
            searchParams.set("status", "active");
        }

        try {
            return await request(`/api/posts?${searchParams.toString()}`);
        } catch {
            return false;
        }
    }

    async uploadFile(file) {
        const formData = new FormData();
        formData.append("file", file);

        try {
            return await request("/api/files", {
                method: "POST",
                body: formData,
            });
        } catch {
            return false;
        }
    }

    async deleteFile(fileId) {
        try {
            await request(`/api/files/${fileId}`, {
                method: "DELETE",
            });
            return true;
        } catch {
            return false;
        }
    }

    getFilePreview(fileId) {
        return `${conf.apiBaseUrl}/api/files/${fileId}`;
    }

    async toggleLikePost(slug) {
        return request(`/api/posts/${slug}/like`, {
            method: "POST",
        });
    }
}

const service = new Service();
export default service;
