export async function api(path, method = 'GET', body) {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + path, {
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