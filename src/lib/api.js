const getApiUrl = () => {
    // Use environment variable if set, otherwise fallback based on environment
    if (process.env.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL;
    }

    // Fallback for different environments
    if (process.env.NODE_ENV === 'production') {
        return 'https://capstone-week-6-day-7-backend.onrender.com';
    }

    return 'http://localhost:5000';
};

export async function api(path, method = 'GET', body) {
    const res = await fetch(`${getApiUrl()}${path}`, {
        method,
        credentials: "include",
        headers: { 'Content-Type': "application/json" },
        body: body ? JSON.stringify(body) : undefined
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "API error");
    }
    return data;
}