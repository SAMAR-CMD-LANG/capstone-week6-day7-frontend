"use client";

import ProtectedRoute from "../../utils/ProtectedRoute";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function CreatePostPage() {
  return (
    <ProtectedRoute>
      <CreatePostForm />
    </ProtectedRoute>
  );
}

function CreatePostForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const [titleError, setTitleError] = useState("");
  const [bodyError, setBodyError] = useState("");

 
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


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
  
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
      await api("/posts", "POST", { 
        title: title.trim(), 
        body: body.trim() 
      });
      
   
      router.push("/posts?created=true");
    } catch (err) {
      setError(err.message || "Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {/* Enhanced header with motivational messaging */}
      <div className="text-center mb-20">
        <h1 className="hero-title" style={{ fontSize: '3rem', marginBottom: '15px' }}>
          ✍️ Create Your Story
        </h1>
        <p className="hero-subtitle" style={{ fontSize: '1.1rem', marginBottom: '0' }}>
          Share your thoughts, experiences, and insights with our community
        </p>
      </div>

      {/* Enhanced form container with better styling */}
      <div className="form-container">
        {/* Error display with better styling */}
        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Title input with enhanced styling and validation */}
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

          {/* Body textarea with enhanced styling and validation */}
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
                {bodyError || 'Share your thoughts and make them count!'}
              </span>
              <span style={{ color: body.length > 4500 ? '#ff6b6b' : '#999' }}>
                {body.length}/5000
              </span>
            </div>
          </div>

          {/* Enhanced submit section with preview option */}
          <div className="form-group">
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button 
                type="submit" 
                disabled={loading || !!titleError || !!bodyError}
                className="btn btn-primary"
                style={{ minWidth: '150px' }}
              >
                {loading ? (
                  <>⏳ Publishing...</>
                ) : (
                  <>🚀 Publish Post</>
                )}
              </button>
              
              <button 
                type="button"
                onClick={() => router.push("/posts")}
                className="btn btn-outline"
                disabled={loading}
              >
                📚 Back to Posts
              </button>
            </div>
          </div>
        </form>

        {/* Writing tips section for better user experience */}
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
            💡 Writing Tips
          </h3>
          <ul style={{ 
            color: '#666', 
            lineHeight: '1.6',
            paddingLeft: '20px'
          }}>
            <li>Start with a compelling title that captures attention</li>
            <li>Write in a conversational tone to engage readers</li>
            <li>Break up long paragraphs for better readability</li>
            <li>Share personal experiences or insights</li>
            <li>End with a thought-provoking conclusion</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
