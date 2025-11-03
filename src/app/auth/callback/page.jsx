"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function AuthCallbackPage() {
    const { refreshUser } = useAuth();
    const router = useRouter();
    const [status, setStatus] = useState("processing");

    useEffect(() => {
        const handleCallback = async () => {
            try {
                setStatus("processing");
                console.log("Auth callback page - starting authentication check");

                // Check URL parameters for immediate errors and token fallback
                const urlParams = new URLSearchParams(window.location.search);
                const error = urlParams.get('error');
                const success = urlParams.get('success');
                const tokenFromUrl = urlParams.get('token');

                if (error) {
                    console.error("OAuth error from URL:", error);
                    setStatus("error");
                    setTimeout(() => {
                        router.push(`/login?error=${error}`);
                    }, 3000);
                    return;
                }

                // If we have a token in the URL, store it in localStorage as a fallback
                if (tokenFromUrl) {
                    console.log("Token received from URL, storing as fallback");
                    localStorage.setItem('auth_token_fallback', tokenFromUrl);
                    // Clear the token from URL for security
                    const newUrl = window.location.pathname;
                    window.history.replaceState({}, '', newUrl);
                }

                // Wait longer for cookie to be properly set across domains
                console.log("Waiting for cookie to be set...");
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Try multiple times to refresh user data
                let attempts = 0;
                const maxAttempts = 3;
                let authSuccess = false;

                while (attempts < maxAttempts && !authSuccess) {
                    try {
                        console.log(`Authentication attempt ${attempts + 1}/${maxAttempts}`);
                        await refreshUser();
                        authSuccess = true;
                        console.log("Authentication successful");
                    } catch (refreshError) {
                        console.warn(`Authentication attempt ${attempts + 1} failed:`, refreshError);
                        attempts++;
                        if (attempts < maxAttempts) {
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                    }
                }

                if (authSuccess) {
                    setStatus("success");
                    // Redirect to posts page after successful authentication
                    setTimeout(() => {
                        router.push("/posts");
                    }, 2000);
                } else {
                    throw new Error("Failed to authenticate after multiple attempts");
                }

            } catch (error) {
                console.error("Auth callback error:", error);
                setStatus("error");

                // Redirect to login page after error
                setTimeout(() => {
                    router.push("/login?error=oauth_callback_failed");
                }, 3000);
            }
        };

        handleCallback();
    }, [refreshUser, router]);

    return (
        <div className="container">
            <div className="text-center" style={{ padding: '60px 20px' }}>
                {status === "processing" && (
                    <>
                        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>⏳</div>
                        <h2 style={{ fontSize: '1.8rem', marginBottom: '15px', color: '#333' }}>
                            Completing Sign In...
                        </h2>
                        <p style={{ color: '#666', marginBottom: '30px' }}>
                            Please wait while we finish setting up your account.
                        </p>
                        <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✅</div>
                        <h2 style={{ fontSize: '1.8rem', marginBottom: '15px', color: '#4ecdc4' }}>
                            Welcome to Samar Blogs!
                        </h2>
                        <p style={{ color: '#666', marginBottom: '30px' }}>
                            You've been successfully signed in. Redirecting you to your posts...
                        </p>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>❌</div>
                        <h2 style={{ fontSize: '1.8rem', marginBottom: '15px', color: '#ff6b6b' }}>
                            Sign In Failed
                        </h2>
                        <p style={{ color: '#666', marginBottom: '30px' }}>
                            There was an issue completing your sign in. Redirecting you back to login...
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}