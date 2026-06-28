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
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {}),
            },
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

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new ApiError(data?.message || "Request failed", response.status);
    }

    return data;
}

export const commentService = {
    getComments(postId) {
        return request(`/api/posts/${postId}/comments`);
    },

    createComment(postId, { content, parentId = null }) {
        return request(`/api/posts/${postId}/comments`, {
            method: "POST",
            body: JSON.stringify({ content, parentId }),
        });
    },

    toggleLike(commentId) {
        return request(`/api/comments/${commentId}/like`, {
            method: "POST",
        });
    },
};
