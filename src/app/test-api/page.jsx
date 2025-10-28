"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function TestApiPage() {
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);

    const testConnection = async () => {
        setLoading(true);
        setResult("");

        try {
            // Test basic connection
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
                credentials: 'include'
            });

            const data = await response.json();
            setResult(`Connection successful! Status: ${response.status}, Data: ${JSON.stringify(data, null, 2)}`);
        } catch (error) {
            setResult(`Connection failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const testApiFunction = async () => {
        setLoading(true);
        setResult("");

        try {
            const data = await api("/auth/me");
            setResult(`API function successful! Data: ${JSON.stringify(data, null, 2)}`);
        } catch (error) {
            setResult(`API function failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h1>API Connection Test</h1>

            <div style={{ margin: '20px 0' }}>
                <p>Backend URL: {process.env.NEXT_PUBLIC_API_URL}</p>
            </div>

            <div style={{ margin: '20px 0' }}>
                <button onClick={testConnection} disabled={loading} className="btn btn-primary" style={{ marginRight: '10px' }}>
                    Test Direct Connection
                </button>
                <button onClick={testApiFunction} disabled={loading} className="btn btn-secondary">
                    Test API Function
                </button>
            </div>

            {loading && <p>Testing...</p>}

            {result && (
                <div style={{
                    background: '#f5f5f5',
                    padding: '20px',
                    borderRadius: '10px',
                    marginTop: '20px',
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'monospace'
                }}>
                    {result}
                </div>
            )}
        </div>
    );
}