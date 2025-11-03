"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function AuthCallback() {
    const router = useRouter();
    const { user, loading, refreshUser } = useAuth();
    const [hasRefreshed, setHasRefreshed] = useState(false);

    useEffect(() => {
        // Force refresh user data when component mounts
        if (!hasRefreshed) {
            refreshUser();
            setHasRefreshed(true);
        }
    }, [refreshUser, hasRefreshed]);

    useEffect(() => {
        // Wait for auth context to load after refresh
        if (!loading && hasRefreshed) {
            if (user) {
                // User is authenticated, redirect to posts
                router.replace("/posts");
            } else {
                // Authentication failed, redirect to login
                router.replace("/login?error=auth_failed");
            }
        }
    }, [user, loading, router, hasRefreshed]);

    return (
        <div className="loading">
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🔄</div>
            Completing authentication...
        </div>
    );
}