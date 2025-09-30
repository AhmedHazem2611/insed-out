const API_URL = 'http://localhost:4000';
async function request(path, options) {
    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    });
    if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try {
            const body = await res.json();
            msg = body.error || msg;
        }
        catch { }
        throw new Error(msg);
    }
    return res.json();
}
export function register(data) {
    return request('/api/auth/register', { method: 'POST', body: JSON.stringify(data) });
}
export function login(data) {
    return request('/api/auth/login', { method: 'POST', body: JSON.stringify(data) });
}
//# sourceMappingURL=api.js.map