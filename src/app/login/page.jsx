"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Enhanced form validation
  const [emailError, setEmailError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Check for OAuth errors in URL parameters
  useEffect(() => {
    const urlError = searchParams.get('error');
    const details = searchParams.get('details');

    if (urlError) {
      let errorMessage = "Authentication failed. Please try again.";

      switch (urlError) {
        case 'oauth_failed':
          errorMessage = "Google sign-in was cancelled or failed. Please try again.";
          break;
        case 'no_user_data':
          errorMessage = "Unable to retrieve your Google account information. Please try again.";
          break;
        case 'oauth_callback_failed':
          errorMessage = details
            ? `Authentication failed: ${decodeURIComponent(details)}`
            : "There was an issue completing your Google sign-in. Please try again.";
          break;
        case 'migration_required':
          errorMessage = "Your account needs to be updated. Please contact support.";
          break;
        case 'account_exists':
          errorMessage = "An account with this email already exists. Please try signing in with your password.";
          break;
        default:
          errorMessage = `Authentication error: ${urlError}`;
      }

      setError(errorMessage);

      // Clear the error from URL after showing it
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [searchParams]);

  // Email validation with real-time feedback
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  // Enhanced form submission with better error handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }

    if (emailError) {
      setError("Please fix the validation errors before submitting");
      return;
    }

    setLoading(true);

    try {
      await login(email.trim(), password);
      // Success - redirect to posts page
      router.push("/posts");
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth login handler
  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth endpoint
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <div className="container">
      {/* Enhanced header with welcoming message */}
      <div className="text-center mb-20">
        <h1 className="hero-title" style={{ fontSize: '3rem', marginBottom: '15px' }}>
          🔑 Welcome Back
        </h1>
        <p className="hero-subtitle" style={{ fontSize: '1.1rem', marginBottom: '0' }}>
          Sign in to continue your blogging journey and connect with the community
        </p>
      </div>

      {/* Enhanced form container */}
      <div className="form-container">
        {/* Error display with better styling */}
        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email input with enhanced styling and validation */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              📧 Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={handleEmailChange}
              required
              className={`form-input ${emailError ? 'error-border' : ''}`}
              autoComplete="email"
            />
            {emailError && (
              <div style={{ color: '#ff6b6b', fontSize: '0.9rem', marginTop: '5px' }}>
                {emailError}
              </div>
            )}
          </div>

          {/* Password input with show/hide functionality */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              🔒 Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
                autoComplete="current-password"
                style={{ paddingRight: '50px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.2rem'
                }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Enhanced submit button */}
          <div className="form-group">
            <button
              type="submit"
              disabled={loading || !!emailError}
              className="btn btn-primary"
              style={{ width: '100%', fontSize: '1.1rem' }}
            >
              {loading ? (
                <>⏳ Signing In...</>
              ) : (
                <>🚀 Sign In</>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="divider-with-text">
            <span>or continue with</span>
          </div>

          {/* Google OAuth Button */}
          <div className="form-group">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="btn btn-outline"
              style={{
                width: '100%',
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                background: 'white',
                border: '2px solid #db4437',
                color: '#db4437'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
          </div>
        </form>

        {/* Registration link with better styling */}
        <div style={{
          textAlign: 'center',
          marginTop: '30px',
          padding: '20px',
          background: 'rgba(102, 126, 234, 0.1)',
          borderRadius: '15px',
          border: '1px solid rgba(102, 126, 234, 0.2)'
        }}>
          <p style={{ color: '#666', marginBottom: '15px' }}>
            Don't have an account yet?
          </p>
          <Link href="/register" className="btn btn-outline">
            📝 Create New Account
          </Link>
        </div>

        {/* Additional help section */}
        <div style={{
          textAlign: 'center',
          marginTop: '20px',
          color: '#999',
          fontSize: '0.9rem'
        }}>
          <p>
            Having trouble signing in? Make sure you're using the correct email and password.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="container">
        <div className="loading">
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⏳</div>
          Loading login page...
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
