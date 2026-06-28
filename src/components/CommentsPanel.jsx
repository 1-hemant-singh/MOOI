import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Button from "./Button";
import IconActionButton from "./IconActionButton";
import { commentService } from "../services/comments";

function CommentForm({ onSubmit, submitLabel = "Comment", placeholder = "Write a comment..." }) {
    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!content.trim()) {
            return;
        }

        setSubmitting(true);

        try {
            await onSubmit(content);
            setContent("");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4">
            <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder={placeholder}
                className="w-full min-h-[90px] rounded-lg border border-lavender-purple-700/70 bg-indigo-ink-950/70 p-3 text-sm text-lavender-purple-50 placeholder:text-lavender-purple-300/60 outline-none focus:border-mauve-magic-400 focus:ring-2 focus:ring-mauve-magic-500/30"
                maxLength={2000}
            />
            <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-lavender-purple-300">{content.length}/2000</span>
                <Button type="submit" disabled={submitting || !content.trim()}>
                    {submitting ? "Posting..." : submitLabel}
                </Button>
            </div>
        </form>
    );
}

function CommentItem({ comment, onReply, onLike, replyingTo, setReplyingTo }) {
    const isReplying = replyingTo === comment.id;

    return (
        <div className="rounded-lg border border-lavender-purple-800/60 bg-indigo-ink-950/70 p-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="font-semibold text-lavender-purple-50">{comment.authorName}</p>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-lavender-purple-100">{comment.content}</p>
                </div>
                <span className="shrink-0 text-xs text-lavender-purple-300">
                    {new Date(comment.createdAt).toLocaleDateString()}
                </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-1">
                <IconActionButton
                    variant="like"
                    active={comment.isLiked}
                    label={comment.isLiked ? "Unlike" : "Like"}
                    iconSize="w-4 h-4"
                    className="px-2 py-1"
                    onClick={() => onLike(comment.id)}
                />
                <span className="px-1 text-xs text-lavender-purple-300">
                    {comment.likesCount} {comment.likesCount === 1 ? "like" : "likes"}
                </span>
                <IconActionButton
                    variant="reply"
                    active={isReplying}
                    label={isReplying ? "Cancel" : "Reply"}
                    iconSize="w-4 h-4"
                    className="px-2 py-1"
                    onClick={() => setReplyingTo(isReplying ? null : comment.id)}
                />
            </div>

            {isReplying ? (
                <CommentForm
                    submitLabel="Reply"
                    placeholder={`Reply to ${comment.authorName}...`}
                    onSubmit={(content) => onReply(comment.id, content)}
                />
            ) : null}

            {comment.replies?.length ? (
                <div className="mt-4 space-y-3 border-l-2 border-lavender-purple-800/60 pl-4">
                    {comment.replies.map((reply) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            onReply={onReply}
                            onLike={onLike}
                            replyingTo={replyingTo}
                            setReplyingTo={setReplyingTo}
                        />
                    ))}
                </div>
            ) : null}
        </div>
    );
}

export default function CommentsPanel({ postId }) {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [replyingTo, setReplyingTo] = useState(null);
    const userData = useSelector((state) => state.auth.userData);
    const navigate = useNavigate();

    const loadComments = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await commentService.getComments(postId);
            setComments(response.comments || []);
        } catch (loadError) {
            setError(loadError.message || "Failed to load comments");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadComments();
    }, [postId]);

    const requireLogin = () => {
        if (!userData) {
            navigate("/login");
            return false;
        }

        return true;
    };

    const handleCreateComment = async (content) => {
        if (!requireLogin()) {
            return;
        }

        await commentService.createComment(postId, { content });
        await loadComments();
    };

    const handleReply = async (parentId, content) => {
        if (!requireLogin()) {
            return;
        }

        await commentService.createComment(postId, { content, parentId });
        setReplyingTo(null);
        await loadComments();
    };

    const handleLike = async (commentId) => {
        if (!requireLogin()) {
            return;
        }

        await commentService.toggleLike(commentId);
        await loadComments();
    };

    return (
        <section className="mt-8 rounded-2xl border border-lavender-purple-800/60 bg-indigo-ink-900/80 p-5 shadow-xl shadow-dark-amethyst-950/40">
            <h2 className="text-xl font-bold text-lavender-purple-50">Comments</h2>

            <CommentForm onSubmit={handleCreateComment} />

            {loading ? <p className="mt-4 text-sm text-lavender-purple-200">Loading comments...</p> : null}
            {error ? <p className="mt-4 text-sm text-mauve-300">{error}</p> : null}

            {!loading && !comments.length ? (
                <p className="mt-4 text-sm text-lavender-purple-200">No comments yet. Start the discussion.</p>
            ) : null}

            <div className="mt-5 space-y-4">
                {comments.map((comment) => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        onReply={handleReply}
                        onLike={handleLike}
                        replyingTo={replyingTo}
                        setReplyingTo={setReplyingTo}
                    />
                ))}
            </div>
        </section>
    );
}
