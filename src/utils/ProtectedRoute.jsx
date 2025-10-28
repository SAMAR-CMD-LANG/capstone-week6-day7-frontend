"use client"
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [shouldRedirect, setShouldRedirect] = useState(false);


    useEffect(() => {
        if (!loading && !user) {
            setShouldRedirect(true);
            router.replace("/login");
        }
    }, [user, loading, router]);


    if (loading) {
        return (
            <div className="loading">
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⏳</div>
                Checking authentication...
            </div>
        );
    }


    if (!user || shouldRedirect) {
        return (
            <div className="loading">
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🔄</div>
                Redirecting to login...
            </div>
        );
    }


    return children;
}