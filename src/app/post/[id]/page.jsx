"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { api } from "@/lib/api";
import Link from "next/link";

export default function PostDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Fetch the specific post
    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const data = await api(`/posts?page=1&limit=100`);
                const foundPost = data.posts.find(p => p.id === parseInt(params.id));

                if (!foundPost) {
                    setError("Post not found");
                    return;
                }

                setPost(foundPost);
            } catch (err) {
                setError("Failed to load post");
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchPost();
        }
    }, [params.id]);

    // Delete post function
    const handleDeletePost = async () => {
        if (!window.confirm(`Are you sure you want to delete "${post.title}"? This action cannot be undone.`)) {
            return;
        }

        setDeleteLoading(true);
        try {
            await api(`/posts/${post.id}`, "DELETE");
            router.push("/posts?deleted=true");
        } catch (err) {
            setError(err.message || "Failed to delete post. Please try again.");
        } finally {
            setDeleteLoading(false);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="container">
                <div className="loading">
                    <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⏳</div>
                    Loading post...
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="container">
                <div className="error">
                    ❌ {error}
                </div>
                <div className="text-center" style={{ marginTop: '20px' }}>
                    <Link href="/posts" className="btn btn-outline">
                        ← Back to Posts
                    </Link>
                </div>
            </div>
        );
    }

    // Post not found
    if (!post) {
        return (
            <div className="container">
                <div className="text-center" style={{ padding: '60px 20px' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📄</div>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '15px', color: '#333' }}>
                        Post Not Found
                    </h2>
                    <p style={{ color: '#666', marginBottom: '30px' }}>
                        The post you're looking for doesn't exist or has been removed.
                    </p>
                    <Link href="/posts" className="btn btn-primary">
                        ← Back to Posts
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            {/* Back button */}
            <div style={{ marginBottom: '30px' }}>
                <Link href="/posts" className="btn btn-outline">
                    ← Back to Posts
                </Link>
            </div>

            {/* Post content */}
            <article className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                {/* Post header */}
                <header style={{ marginBottom: '30px' }}>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: '800',
                        marginBottom: '20px',
                        background: 'linear-gradient(45deg, #667eea, #764ba2)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        lineHeight: '1.2'
                    }}>
                        {post.title}
                    </h1>

                    {/* Post metadata */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '15px 0',
                        borderBottom: '2px solid #f0f0f0',
                        marginBottom: '30px'
                    }}>
                        <div>
                            <div style={{ marginBottom: '5px' }}>
                                <span style={{ fontWeight: '600', color: '#333' }}>
                                    👤 {post.Users?.name || "Anonymous"}
                                </span>
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#666' }}>
                                📅 {new Date(post.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                        </div>

                        {/* Action buttons for post owner */}
                        {user && post.user_id === user.id && (
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <Link
                                    href={`/edit-post/${post.id}`}
                                    className="btn btn-outline"
                                    style={{ fontSize: '0.9rem' }}
                                >
                                    ✏️ Edit Post
                                </Link>
                                <button
                                    onClick={handleDeletePost}
                                    disabled={deleteLoading}
                                    className="btn btn-secondary"
                                    style={{ fontSize: '0.9rem' }}
                                >
                                    {deleteLoading ? '⏳ Deleting...' : '🗑️ Delete Post'}
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                {/* Post body */}
                <div style={{
                    fontSize: '1.1rem',
                    lineHeight: '1.8',
                    color: '#333',
                    whiteSpace: 'pre-wrap'
                }}>
                    {post.body}
                </div>

                {/* Post footer */}
                <footer style={{
                    marginTop: '40px',
                    paddingTop: '20px',
                    borderTop: '1px solid #eee',
                    textAlign: 'center'
                }}>
                    <div style={{
                        background: 'rgba(102, 126, 234, 0.1)',
                        padding: '20px',
                        borderRadius: '15px',
                        marginBottom: '20px'
                    }}>
                        <p style={{ color: '#666', marginBottom: '15px' }}>
                            Enjoyed this post? Check out more amazing stories from our community!
                        </p>
                        <Link href="/posts" className="btn btn-primary">
                            📚 Browse More Posts
                        </Link>
                    </div>
                </footer>
            </article>
        </div>
    );
}