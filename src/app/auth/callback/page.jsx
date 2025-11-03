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

                // Wait a moment for cookie to be set
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Refresh user data to check if authentication was successful
                await refreshUser();

                setStatus("success");

                // Redirect to posts page after successful authentication
                setTimeout(() => {
                    router.push("/posts");
                }, 2000);

            } catch (error) {
                console.error("Auth callback error:", error);
                setStatus("error");

                // Redirect to login page after error
                setTimeout(() => {
                    router.push("/login?error=oauth_failed");
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