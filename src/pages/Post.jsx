import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Container } from "../components";
import IconActionButton from "../components/IconActionButton";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import CommentsPanel from "../components/CommentsPanel";

export default function Post() {
    const [post, setPost] = useState(null);
    const [showComments, setShowComments] = useState(false);
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);

    const isAuthor = post && userData ? post.userid === userData.$id : false;

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) {
                    setPost(post);
                } else navigate("/");
            });
        } else navigate("/");
    }, [slug, navigate]);

    const deletePost = () => {
        appwriteService.deletePost(post.$id).then((status) => {
            if (status) {
                appwriteService.deleteFile(post.featuredImage);
                navigate("/");
            }
        });
    };

    const handleLikeToggle = async () => {
        if (!userData) {
            navigate("/login");
            return;
        }

        try {
            const updatedPost = await appwriteService.toggleLikePost(post.$id);
            setPost(updatedPost);
        } catch (error) {
            console.log("Failed to toggle like", error);
        }
    };

    return post ? (
        <div className="py-8">
            <Container>
                <div className="w-full overflow-hidden rounded-2xl border border-lavender-purple-800/60 bg-indigo-ink-900/60 p-2 shadow-xl shadow-dark-amethyst-950/40">
                    <img
                        src={appwriteService.getFilePreview(post.featuredImage)}
                        alt={post.title}
                        className="w-full rounded-xl object-cover"
                    />
                </div>

                <div className="mt-6 w-full">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                            <h1 className="text-3xl font-bold text-lavender-purple-50">{post.title}</h1>
                            <p className="mt-2 text-sm text-lavender-purple-200">
                                By {post.authorName || "Unknown author"}
                            </p>
                        </div>

                        {isAuthor ? (
                            <div className="flex shrink-0 items-center gap-1">
                                <IconActionButton
                                    variant="edit"
                                    label="Edit"
                                    onClick={() => navigate(`/edit-post/${slug}`)}
                                />
                                <IconActionButton variant="delete" label="Delete" onClick={deletePost} />
                            </div>
                        ) : null}
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-1 border-t border-lavender-purple-800/40 pt-4">
                        <IconActionButton
                            variant="like"
                            active={post.isLiked}
                            label={post.isLiked ? "Unlike" : "Like"}
                            onClick={handleLikeToggle}
                        />
                        <span className="px-2 text-sm text-lavender-purple-300">
                            {post.likesCount || 0} {post.likesCount === 1 ? "like" : "likes"}
                        </span>
                        <IconActionButton
                            variant="comment"
                            active={showComments}
                            label={showComments ? "Hide comments" : "Comments"}
                            onClick={() => setShowComments((current) => !current)}
                        />
                    </div>
                </div>

                <div className="browser-css mt-6 rounded-2xl border border-lavender-purple-800/60 bg-lavender-purple-50 p-6 text-indigo-ink-950">
                    {parse(post.content)}
                </div>

                {showComments ? <CommentsPanel postId={post.$id} /> : null}
            </Container>
        </div>
    ) : null;
}
