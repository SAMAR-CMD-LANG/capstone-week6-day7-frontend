export async function api(path, method = 'GET', body) {
    try {
        console.log(`API call: ${method} ${process.env.NEXT_PUBLIC_API_URL}${path}`);

        // Prepare headers
        const headers = {
            'Content-Type': "application/json",
            'Accept': 'application/json'
        };

        // Add fallback token from localStorage if available (for OAuth fallback)
        const fallbackToken = localStorage.getItem('auth_token_fallback');
        if (fallbackToken) {
            headers['Authorization'] = `Bearer ${fallbackToken}`;
            console.log("Using fallback token from localStorage");
            console.log("Fallback token length:", fallbackToken.length);
            console.log("Fallback token preview:", fallbackToken.substring(0, 50) + "...");
        } else {
            console.log("No fallback token found in localStorage");
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
            method,
            credentials: "include", // Still try cookies first
            headers,
            body: body ? JSON.stringify(body) : undefined
        });

        console.log(`API response status: ${res.status}`);
        console.log(`API response headers:`, Object.fromEntries(res.headers.entries()));

        let data;
        try {
            data = await res.json();
        } catch (parseError) {
            console.error("Failed to parse JSON response:", parseError);
            throw new Error("Invalid response from server");
        }

        console.log(`API response data:`, data);

        if (!res.ok) {
            // If we get 401 and we used fallback token, clear it as it might be expired
            if (res.status === 401 && fallbackToken) {
                console.log("Fallback token appears to be invalid, clearing it");
                localStorage.removeItem('auth_token_fallback');
            }

            const error = new Error(data.message || `HTTP ${res.status}: ${res.statusText}`);
            error.status = res.status;
            error.response = data;
            throw error;
        }

        // Don't clear the fallback token immediately - keep it until we're sure cookies work
        // if (fallbackToken && res.ok && path === '/auth/me') {
        //     console.log("Fallback token worked, clearing it as cookies should be set now");
        //     localStorage.removeItem('auth_token_fallback');
        // }

        return data;
    } catch (error) {
        console.error(`API error for ${method} ${path}:`, error);

        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error("Network error - please check your connection");
        }

        throw error;
    }
}