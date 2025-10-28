"use client"

import { AuthProvider, useAuth } from "./context/AuthContext";
import Link from "next/link";
import "./globals.css"; 

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
     
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Samar Blogs - A modern blogging platform for sharing your thoughts and stories" />
        <title>Samar Blogs - Share Your Stories</title>

        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AuthProvider>
          <Nav />
          <main className="main-content fade-in-up">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}

function Nav() {
  const { user, logout } = useAuth();


  if (user) {
    console.log("Navigation - user object:", user);
    console.log("Navigation - user.name type:", typeof user.name);
    console.log("Navigation - user.name value:", user.name);
  }

  return (
    <nav className="navbar">
      <div className="nav-content">
    
        <Link href="/" className="nav-brand">
          📝 Samar Blogs
        </Link>

        <div className="nav-links">
          <Link href="/" className="nav-link">🏠 Home</Link>
          <Link href="/posts" className="nav-link">📚 Posts</Link>

          {user ? (
            <>
        
              <Link href="/create-post" className="nav-link">✍️ Write</Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}>
                  {typeof user.name === 'string' ? user.name.charAt(0)?.toUpperCase() : '?'}
                </div>
                <span className="nav-user">Hi, {typeof user.name === 'string' ? user.name : 'User'}!</span>
              </div>
              <button onClick={logout} className="btn btn-secondary">
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-outline">🔑 Login</Link>
              <Link href="/register" className="btn btn-primary">🚀 Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
