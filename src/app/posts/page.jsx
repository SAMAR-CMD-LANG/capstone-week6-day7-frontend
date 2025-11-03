"use client";

import ProtectedRoute from "@/utils/ProtectedRoute";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { api } from "@/lib/api";
import Link from "next/link";

export default function PostsPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={
        <div className="container">
          <div className="loading">
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⏳</div>
            Loading posts...
          </div>
        </div>
      }>
        <PostsContent />
      </Suspense>
    </ProtectedRoute>
  );
}

function PostsContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showMyPosts, setShowMyPosts] = useState(false);

  // Enhanced fetch function with better error handling and user feedback
  async function fetchPosts() {
    setLoading(true);
    setError("");
    try {
      const data = await api(`/posts?page=${page}&limit=5&search=${search}`);
      console.log("Posts API response:", data); // Debug log
      let filteredPosts = data.posts || [];

      // Filter to show only user's posts if showMyPosts is true
      if (showMyPosts && user) {
        filteredPosts = filteredPosts.filter(post => post.user_id === user.id);
      }

      setPosts(filteredPosts);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Posts fetch error:", err); // Debug log
      setError(err.message || "Failed to fetch posts. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Delete post function
  const handleDeletePost = async (postId, postTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${postTitle}"? This action cannot be undone.`)) {
      return;
    }

    setDeleteLoading(postId);
    try {
      await api(`/posts/${postId}`, "DELETE");
      setSuccessMessage("Post deleted successfully!");
      // Refresh posts
      await fetchPosts();
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to delete post. Please try again.");
    } finally {
      setDeleteLoading(null);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page, search, showMyPosts]);

  // Check for success messages from URL params
  useEffect(() => {
    const created = searchParams.get('created');
    const updated = searchParams.get('updated');
    const deleted = searchParams.get('deleted');

    if (created) {
      setSuccessMessage("Post created successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } else if (updated) {
      setSuccessMessage("Post updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } else if (deleted) {
      setSuccessMessage("Post deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  }, [searchParams]);

  // Enhanced search handler with immediate feedback
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
    fetchPosts();
  };

  // Pagination handlers with smooth transitions
  const handlePrev = () => setPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setPage((p) => Math.min(p + 1, totalPages));

  return (
    <div className="container">
      {/* Enhanced header section with better typography */}
      <div className="text-center mb-20">
        <h1 className="hero-title" style={{ fontSize: '3rem', marginBottom: '15px' }}>
          📚 Discover Amazing Stories
        </h1>
        <p className="hero-subtitle" style={{ fontSize: '1.1rem', marginBottom: '0' }}>
          Explore our collection of thoughtful articles and engaging stories from our community
        </p>
      </div>

      {/* Enhanced search section with modern styling */}
      <div style={{ marginBottom: '30px' }}>
        <form onSubmit={handleSearch} className="search-container">
          <input
            type="text"
            placeholder="🔍 Search posts by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>

        {/* Filter controls */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '15px',
          marginTop: '20px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setShowMyPosts(false)}
            className={`btn ${!showMyPosts ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontSize: '0.9rem' }}
          >
            🌍 All Posts
          </button>
          <button
            onClick={() => setShowMyPosts(true)}
            className={`btn ${showMyPosts ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontSize: '0.9rem' }}
          >
            📝 My Posts
          </button>
          <Link href="/create-post" className="btn btn-secondary" style={{ fontSize: '0.9rem' }}>
            ✍️ Write New Post
          </Link>
        </div>
      </div>

      {/* Loading state with better visual feedback */}
      {loading && (
        <div className="loading">
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⏳</div>
          Loading amazing posts...
        </div>
      )}

      {/* Success message */}
      {successMessage && (
        <div className="success">
          ✅ {successMessage}
        </div>
      )}

      {/* Error state with actionable messaging */}
      {error && (
        <div className="error">
          ❌ {error}
        </div>
      )}

      {/* Enhanced posts grid with card-based design */}
      {!loading && posts.length > 0 && (
        <div className="posts-grid">
          {posts.map((post, index) => (
            <article key={post.id} className="card" style={{ animationDelay: `${index * 0.1}s` }}>
              {/* Post header with enhanced typography */}
              <header>
                <h2 className="card-title">
                  {post.title || "Untitled Post"}
                </h2>
              </header>

              {/* Post content with better formatting */}
              <div className="card-content">
                <p>
                  {post.body
                    ? post.body.length > 200
                      ? `${post.body.substring(0, 200)}...`
                      : post.body
                    : "No content available"
                  }
                </p>
              </div>

              {/* Post metadata with enhanced styling */}
              <footer className="card-meta">
                <div style={{ marginBottom: '15px' }}>
                  <span>
                    👤 Author: {post.Users?.name || "Anonymous"}
                  </span>
                  <br />
                  <span style={{ fontSize: '0.8rem', color: '#999' }}>
                    📅 {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {/* Show edit/delete buttons only for post owner */}
                    {user && post.user_id === user.id && (
                      <>
                        <Link
                          href={`/edit-post/${post.id}`}
                          className="btn btn-outline"
                          style={{
                            fontSize: '0.8rem',
                            padding: '6px 12px',
                            textDecoration: 'none',
                            display: 'inline-block'
                          }}
                        >
                          ✏️ Edit
                        </Link>
                        <button
                          onClick={() => handleDeletePost(post.id, post.title)}
                          disabled={deleteLoading === post.id}
                          className="btn btn-secondary"
                          style={{
                            fontSize: '0.8rem',
                            padding: '6px 12px',
                            background: deleteLoading === post.id ? '#ccc' : 'linear-gradient(45deg, #ff6b6b, #ee5a24)'
                          }}
                        >
                          {deleteLoading === post.id ? '⏳' : '🗑️'} Delete
                        </button>
                      </>
                    )}
                  </div>

                  <Link
                    href={`/post/${post.id}`}
                    style={{
                      background: 'linear-gradient(45deg, #667eea, #764ba2)',
                      color: 'white',
                      padding: '5px 12px',
                      borderRadius: '15px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      textDecoration: 'none',
                      display: 'inline-block'
                    }}
                  >
                    📖 Read More
                  </Link>
                </div>
              </footer>
            </article>
          ))}
        </div>
      )}

      {/* Empty state with helpful messaging */}
      {!loading && posts.length === 0 && !error && (
        <div className="text-center" style={{ padding: '60px 20px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📝</div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#333' }}>
            {search ? "No posts found" : "No posts yet"}
          </h3>
          <p style={{ color: '#666', marginBottom: '30px' }}>
            {search
              ? `No posts match "${search}". Try a different search term.`
              : "Be the first to share your story with the community!"
            }
          </p>
          {search && (
            <button
              onClick={() => { setSearch(""); setPage(1); }}
              className="btn btn-outline"
            >
              Clear Search
            </button>
          )}
        </div>
      )}

      {/* Enhanced pagination with better UX */}
      {!loading && posts.length > 0 && totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className="btn btn-outline"
          >
            ← Previous
          </button>

          <div className="pagination-info">
            Page {page} of {totalPages}
          </div>

          <button
            onClick={handleNext}
            disabled={page === totalPages}
            className="btn btn-outline"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
