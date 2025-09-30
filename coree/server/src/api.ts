const API_URL = 'http://localhost:4000';

export type AuthResponse = {
  token: string;
  user: { id: string; email: string; name: string };
};

async function request<T>(path: string, options: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try { const body = await res.json(); msg = body.error || msg; } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export function register(data: { name: string; email: string; password: string }) {
  return request<AuthResponse>('/api/auth/register', { method: 'POST', body: JSON.stringify(data) });
}

export function login(data: { email: string; password: string }) {
  return request<AuthResponse>('/api/auth/login', { method: 'POST', body: JSON.stringify(data) });
} 