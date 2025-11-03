"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function TestTokenPage() {
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);

    const testToken = async () => {
        setLoading(true);
        setResult("");

        try {
            // Check if we have a fallback token
            const fallbackToken = localStorage.getItem('auth_token_fallback');
            console.log("Fallback token exists:", !!fallbackToken);

            if (fallbackToken) {
                console.log("Token length:", fallbackToken.length);
                console.log("Token preview:", fallbackToken.substring(0, 50) + "...");
            }

            // Try to call the auth/me endpoint
            const response = await api("/auth/me");
            setResult(`Success! User: ${JSON.stringify(response.user, null, 2)}`);
        } catch (error) {
            console.error("Test failed:", error);
            setResult(`Error: ${error.message}\nResponse: ${JSON.stringify(error.response, null, 2)}`);
        } finally {
            setLoading(false);
        }
    };

    const clearToken = () => {
        localStorage.removeItem('auth_token_fallback');
        setResult("Fallback token cleared");
    };

    const checkToken = () => {
        const fallbackToken = localStorage.getItem('auth_token_fallback');
        if (fallbackToken) {
            setResult(`Token exists: ${fallbackToken.length} characters\nPreview: ${fallbackToken.substring(0, 100)}...`);
        } else {
            setResult("No fallback token found");
        }
    };

    return (
        <div className="container" style={{ padding: '40px' }}>
            <h1>Token Test Page</h1>

            <div style={{ marginBottom: '20px' }}>
                <button onClick={testToken} disabled={loading} className="btn btn-primary" style={{ marginRight: '10px' }}>
                    {loading ? "Testing..." : "Test Auth Token"}
                </button>

                <button onClick={checkToken} className="btn btn-outline" style={{ marginRight: '10px' }}>
                    Check Token
                </button>

                <button onClick={clearToken} className="btn btn-secondary">
                    Clear Token
                </button>
            </div>

            {result && (
                <div style={{
                    background: '#f5f5f5',
                    padding: '20px',
                    borderRadius: '8px',
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'monospace',
                    fontSize: '14px'
                }}>
                    {result}
                </div>
            )}
        </div>
    );
}