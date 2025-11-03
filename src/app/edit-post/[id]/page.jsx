"use client";

import ProtectedRoute from "../../../utils/ProtectedRoute";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { api } from "@/lib/api";

export default function EditPostPage() {
    return (
        <ProtectedRoute>
            <EditPostForm />
        </ProtectedRoute>
    );
}

function EditPostForm() {
    const router = useRouter();
    const params = useParams();
    const { user } = useAuth();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetchingPost, setFetchingPost] = useState(true);
    const [post, setPost] = useState(null);

    // Enhanced validation states
    const [titleError, setTitleError] = useState("");
    const [bodyError, setBodyError] = useState("");

    // Fetch the post to edit
    useEffect(() => {
        const fetchPost = async () => {
            try {
                setFetchingPost(true);
                const data = await api(`/posts?page=1&limit=100`); // Get all posts to find the one we need
                const foundPost = data.posts.find(p => p.id === parseInt(params.id));

                if (!foundPost) {
                    setError("Post not found");
                    return;
                }

                // Check if user owns this post
                if (foundPost.user_id !== user?.id) {
                    setError("You don't have permission to edit this post");
                    return;
                }

                setPost(foundPost);
                setTitle(foundPost.title);
                setBody(foundPost.body);
            } catch (err) {
                setError("Failed to load post");
            } finally {
                setFetchingPost(false);
            }
        };

        if (params.id && user) {
            fetchPost();
        }
    }, [params.id, user]);

    // Title validation
    const handleTitleChange = (e) => {
        const value = e.target.value;
        setTitle(value);

        if (value.length > 100) {
            setTitleError("Title should be less than 100 characters");
        } else if (value.length > 0 && value.length < 5) {
            setTitleError("Title should be at least 5 characters");
        } else {
            setTitleError("");
        }
    };

    // Body validation
    const handleBodyChange = (e) => {
        const value = e.target.value;
        setBody(value);

        if (value.length > 5000) {
            setBodyError("Post content should be less than 5000 characters");
        } else if (value.length > 0 && value.length < 20) {
            setBodyError("Post content should be at least 20 characters");
        } else {
            setBodyError("");
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Client-side validation
        if (!title.trim()) {
            setError("Please enter a title for your post");
            return;
        }

        if (!body.trim()) {
            setError("Please enter content for your post");
            return;
        }

        if (titleError || bodyError) {
            setError("Please fix the validation errors before submitting");
            return;
        }

        setLoading(true);

        try {
            await api(`/posts/${params.id}`, "PUT", {
                title: title.trim(),
                body: body.trim()
            });

            // Redirect to posts page with success message
            router.push("/posts?updated=true");
        } catch (err) {
            setError(err.message || "Failed to update post. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Loading state while fetching post
    if (fetchingPost) {
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
    if (error && !post) {
        return (
            <div className="container">
                <div className="error">
                    {error}
                </div>
                <div className="text-center" style={{ marginTop: '20px' }}>
                    <button onClick={() => router.push("/posts")} className="btn btn-outline">
                        ← Back to Posts
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            {/* Enhanced header */}
            <div className="text-center mb-20">
                <h1 className="hero-title" style={{ fontSize: '3rem', marginBottom: '15px' }}>
                    ✏️ Edit Your Post
                </h1>
                <p className="hero-subtitle" style={{ fontSize: '1.1rem', marginBottom: '0' }}>
                    Update your story and share your latest thoughts
                </p>
            </div>

            {/* Enhanced form container */}
            <div className="form-container">
                {/* Error display */}
                {error && (
                    <div className="error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Title input */}
                    <div className="form-group">
                        <label htmlFor="title" className="form-label">
                            📝 Post Title *
                        </label>
                        <input
                            id="title"
                            type="text"
                            placeholder="Enter an engaging title for your post..."
                            value={title}
                            onChange={handleTitleChange}
                            required
                            className={`form-input ${titleError ? 'error-border' : ''}`}
                            maxLength={100}
                        />
                        {/* Character counter and validation feedback */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginTop: '5px',
                            fontSize: '0.9rem'
                        }}>
                            <span style={{ color: titleError ? '#ff6b6b' : '#999' }}>
                                {titleError || ''}
                            </span>
                            <span style={{ color: title.length > 80 ? '#ff6b6b' : '#999' }}>
                                {title.length}/100
                            </span>
                        </div>
                    </div>

                    {/* Body textarea */}
                    <div className="form-group">
                        <label htmlFor="body" className="form-label">
                            📖 Post Content *
                        </label>
                        <textarea
                            id="body"
                            placeholder="Share your story, thoughts, or insights here..."
                            value={body}
                            onChange={handleBodyChange}
                            required
                            className={`form-textarea ${bodyError ? 'error-border' : ''}`}
                            rows={12}
                            maxLength={5000}
                        />
                        {/* Character counter and validation feedback */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginTop: '5px',
                            fontSize: '0.9rem'
                        }}>
                            <span style={{ color: bodyError ? '#ff6b6b' : '#999' }}>
                                {bodyError || 'Update your thoughts and make them count!'}
                            </span>
                            <span style={{ color: body.length > 4500 ? '#ff6b6b' : '#999' }}>
                                {body.length}/5000
                            </span>
                        </div>
                    </div>

                    {/* Submit section */}
                    <div className="form-group">
                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                            <button
                                type="submit"
                                disabled={loading || !!titleError || !!bodyError}
                                className="btn btn-primary"
                                style={{ minWidth: '150px' }}
                            >
                                {loading ? (
                                    <>⏳ Updating...</>
                                ) : (
                                    <>💾 Update Post</>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => router.push("/posts")}
                                className="btn btn-outline"
                                disabled={loading}
                            >
                                ❌ Cancel
                            </button>
                        </div>
                    </div>
                </form>

                {/* Post info */}
                {post && (
                    <div style={{
                        marginTop: '40px',
                        padding: '20px',
                        background: 'rgba(102, 126, 234, 0.1)',
                        borderRadius: '15px',
                        border: '1px solid rgba(102, 126, 234, 0.2)'
                    }}>
                        <h3 style={{
                            fontSize: '1.2rem',
                            marginBottom: '15px',
                            color: '#667eea',
                            fontWeight: '600'
                        }}>
                            📄 Post Information
                        </h3>
                        <div style={{ color: '#666', lineHeight: '1.6' }}>
                            <p><strong>Created:</strong> {new Date(post.created_at).toLocaleDateString()}</p>
                            <p><strong>Author:</strong> {user?.name}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}