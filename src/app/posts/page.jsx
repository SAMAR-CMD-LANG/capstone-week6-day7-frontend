"use client";

import ProtectedRoute from "@/utils/ProtectedRoute";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export default function PostsPage() {
  return (
    <ProtectedRoute>
      <PostsContent />
    </ProtectedRoute>
  );
}

function PostsContent() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Enhanced fetch function with better error handling and user feedback
  async function fetchPosts() {
    setLoading(true);
    setError("");
    try {
      const data = await api(`/posts?page=${page}&limit=5&search=${search}`);
      console.log("Posts API response:", data); // Debug log
      setPosts(data.posts || []); // Ensure posts is always an array
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Posts fetch error:", err); // Debug log
      setError(err.message || "Failed to fetch posts. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, [page, search]);

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

      {/* Loading state with better visual feedback */}
      {loading && (
        <div className="loading">
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⏳</div>
          Loading amazing posts...
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>
                    👤 Author: {post.user_id || "Anonymous"}
                  </span>
                  <span style={{
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    color: 'white',
                    padding: '5px 12px',
                    borderRadius: '15px',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                  }}>
                    📖 Read More
                  </span>
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
