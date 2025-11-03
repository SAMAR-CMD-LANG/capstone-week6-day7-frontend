export async function api(path, method = 'GET', body) {
    try {
        console.log(`API call: ${method} ${process.env.NEXT_PUBLIC_API_URL}${path}`);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
            method,
            credentials: "include",
            headers: {
                'Content-Type': "application/json",
                'Accept': 'application/json'
            },
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
            const error = new Error(data.message || `HTTP ${res.status}: ${res.statusText}`);
            error.status = res.status;
            error.response = data;
            throw error;
        }

        return data;
    } catch (error) {
        console.error(`API error for ${method} ${path}:`, error);

        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error("Network error - please check your connection");
        }

        throw error;
    }
}