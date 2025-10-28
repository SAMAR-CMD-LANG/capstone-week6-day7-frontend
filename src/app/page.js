"use client";

import Link from "next/link";
import { useAuth } from "./context/AuthContext";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="container">
     
      <section className="hero">
        <h1 className="hero-title">
          Welcome to Samar Blogs
        </h1>
        <p className="hero-subtitle">
          A modern platform where thoughts become stories, ideas turn into conversations, 
          and every voice matters. Join our community of passionate writers and readers.
        </p>
        
       
        <div className="hero-actions">
          {user ? (
            <>
              <Link href="/create-post" className="btn btn-primary">
                ✍️ Start Writing
              </Link>
              <Link href="/posts" className="btn btn-outline">
                📚 Browse Posts
              </Link>
            </>
          ) : (
            <>
              <Link href="/register" className="btn btn-primary">
                🚀 Join Our Community
              </Link>
              <Link href="/login" className="btn btn-outline">
                🔑 Sign In
              </Link>
            </>
          )}
        </div>
      </section>

   
      <section className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">✍️</div>
          <h3 className="feature-title">Easy Writing</h3>
          <p className="feature-description">
            Create beautiful blog posts with our intuitive editor. 
            Focus on your content while we handle the formatting.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🔍</div>
          <h3 className="feature-title">Smart Search</h3>
          <p className="feature-description">
            Find exactly what you're looking for with our powerful search functionality. 
            Discover posts by title, content, or author.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">👥</div>
          <h3 className="feature-title">Community Driven</h3>
          <p className="feature-description">
            Connect with like-minded writers and readers. 
            Share your thoughts and engage with diverse perspectives.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🔒</div>
          <h3 className="feature-title">Secure & Private</h3>
          <p className="feature-description">
            Your data is protected with industry-standard security. 
            Write with confidence knowing your content is safe.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📱</div>
          <h3 className="feature-title">Mobile Friendly</h3>
          <p className="feature-description">
            Access your blog anywhere, anytime. 
            Our responsive design works perfectly on all devices.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3 className="feature-title">Lightning Fast</h3>
          <p className="feature-description">
            Built with modern technology for optimal performance. 
            Experience blazing-fast loading times and smooth interactions.
          </p>
        </div>
      </section>

    
      <section className="hero" style={{ background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(238, 90, 36, 0.1))' }}>
        <h2 className="hero-title" style={{ fontSize: '2.5rem' }}>
          Join Thousands of Writers
        </h2>
        <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '30px' }}>
          <div className="text-center">
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#667eea' }}>1000+</div>
            <div style={{ color: '#666', fontWeight: '600' }}>Active Writers</div>
          </div>
          <div className="text-center">
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#ff6b6b' }}>5000+</div>
            <div style={{ color: '#666', fontWeight: '600' }}>Published Posts</div>
          </div>
          <div className="text-center">
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#4ecdc4' }}>10000+</div>
            <div style={{ color: '#666', fontWeight: '600' }}>Monthly Readers</div>
          </div>
        </div>
      </section>

    
      <section>
        <h2 className="text-center" style={{ fontSize: '2.5rem', marginBottom: '40px', color: '#333' }}>
          How It Works
        </h2>
        <div className="features-grid">
          <div className="card">
            <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '20px' }}>1️⃣</div>
            <h3 className="card-title">Create Your Account</h3>
            <p className="card-content">
              Sign up in seconds with just your email and password. 
              No complicated verification process - start writing immediately.
            </p>
          </div>

          <div className="card">
            <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '20px' }}>2️⃣</div>
            <h3 className="card-title">Write Your First Post</h3>
            <p className="card-content">
              Use our clean, distraction-free editor to craft your story. 
              Add a compelling title and let your creativity flow.
            </p>
          </div>

          <div className="card">
            <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '20px' }}>3️⃣</div>
            <h3 className="card-title">Share & Connect</h3>
            <p className="card-content">
              Publish your post and watch it reach readers worldwide. 
              Engage with the community and build your following.
            </p>
          </div>
        </div>
      </section>


      {!user && (
        <section className="text-center" style={{ padding: '60px 0' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: '#333' }}>
            Ready to Start Your Blogging Journey?
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '30px', maxWidth: '500px', margin: '0 auto 30px' }}>
            Join our community today and start sharing your unique perspective with the world.
          </p>
          <Link href="/register" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '15px 30px' }}>
            🚀 Get Started Now - It's Free!
          </Link>
        </section>
      )}
    </div>
  );
}