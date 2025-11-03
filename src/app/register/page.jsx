"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);

    if (value.length > 0 && value.length < 2) {
      setNameError("Name should be at least 2 characters");
    } else if (value.length > 50) {
      setNameError("Name should be less than 50 characters");
    } else {
      setNameError("");
    }
  };


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


  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (value.length > 0 && value.length < 6) {
      setPasswordError("Password should be at least 6 characters");
    } else if (value.length > 100) {
      setPasswordError("Password should be less than 100 characters");
    } else {
      setPasswordError("");
    }

    if (confirmPassword && value !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
    } else if (confirmPassword && value === confirmPassword) {
      setConfirmPasswordError("");
    }
  };


  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (value && value !== password) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");


    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!password.trim()) {
      setError("Please enter a password");
      return;
    }

    if (!confirmPassword.trim()) {
      setError("Please confirm your password");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (nameError || emailError || passwordError || confirmPasswordError) {
      setError("Please fix the validation errors before submitting");
      return;
    }

    setLoading(true);

    try {
      await register(name.trim(), email.trim(), password);

      router.push("/posts");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const handleGoogleSignup = () => {

    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <div className="container">
      {/* Enhanced header with welcoming message */}
      <div className="text-center mb-20">
        <h1 className="hero-title" style={{ fontSize: '3rem', marginBottom: '15px' }}>
          🚀 Join Our Community
        </h1>
        <p className="hero-subtitle" style={{ fontSize: '1.1rem', marginBottom: '0' }}>
          Create your account and start sharing your stories with the world
        </p>
      </div>


      <div className="form-container">

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="name" className="form-label">
              👤 Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={handleNameChange}
              required
              className={`form-input ${nameError ? 'error-border' : ''}`}
              maxLength={50}
              autoComplete="name"
            />
            {nameError && (
              <div style={{ color: '#ff6b6b', fontSize: '0.9rem', marginTop: '5px' }}>
                {nameError}
              </div>
            )}
          </div>


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


          <div className="form-group">
            <label htmlFor="password" className="form-label">
              🔒 Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a secure password"
                value={password}
                onChange={handlePasswordChange}
                required
                className={`form-input ${passwordError ? 'error-border' : ''}`}
                autoComplete="new-password"
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
            {passwordError && (
              <div style={{ color: '#ff6b6b', fontSize: '0.9rem', marginTop: '5px' }}>
                {passwordError}
              </div>
            )}

            {password && !passwordError && (
              <div style={{ fontSize: '0.9rem', marginTop: '5px', color: '#4ecdc4' }}>
                ✅ Password looks good!
              </div>
            )}
          </div>


          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              🔒 Confirm Password
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
              className={`form-input ${confirmPasswordError ? 'error-border' : ''}`}
              autoComplete="new-password"
            />
            {confirmPasswordError && (
              <div style={{ color: '#ff6b6b', fontSize: '0.9rem', marginTop: '5px' }}>
                {confirmPasswordError}
              </div>
            )}
            {confirmPassword && !confirmPasswordError && password === confirmPassword && (
              <div style={{ fontSize: '0.9rem', marginTop: '5px', color: '#4ecdc4' }}>
                ✅ Passwords match!
              </div>
            )}
          </div>


          <div className="form-group">
            <button
              type="submit"
              disabled={loading || !!nameError || !!emailError || !!passwordError || !!confirmPasswordError}
              className="btn btn-primary"
              style={{ width: '100%', fontSize: '1.1rem' }}
            >
              {loading ? (
                <>⏳ Creating Account...</>
              ) : (
                <>🎉 Create Account</>
              )}
            </button>
          </div>
        </form>


        <div className="divider-with-text">
          <span>or continue with</span>
        </div>


        <button
          type="button"
          onClick={handleGoogleSignup}
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
            color: '#db4437',
            marginBottom: '30px'
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


        <div style={{
          textAlign: 'center',
          marginTop: '30px',
          padding: '20px',
          background: 'rgba(102, 126, 234, 0.1)',
          borderRadius: '15px',
          border: '1px solid rgba(102, 126, 234, 0.2)'
        }}>
          <p style={{ color: '#666', marginBottom: '15px' }}>
            Already have an account?
          </p>
          <Link href="/login" className="btn btn-outline">
            🔑 Sign In Instead
          </Link>
        </div>


        <div style={{
          textAlign: 'center',
          marginTop: '20px',
          color: '#999',
          fontSize: '0.9rem',
          lineHeight: '1.5'
        }}>
          <p>
            By creating an account, you agree to our community guidelines
            and commit to respectful, authentic blogging.
          </p>
        </div>
      </div>
    </div>
  );
}
