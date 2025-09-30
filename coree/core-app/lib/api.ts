import { Platform } from 'react-native';
import Constants from 'expo-constants';

const DEFAULT_HOST = Platform.select({
	ios: 'http://localhost:4000',
	android: 'http://10.0.2.2:4000',
	default: 'http://localhost:4000',
});

function inferExpoLanUrl(): string | null {
  try {
    // Expo Router SDK 49+/54 uses manifest2
    const expoHostUri = (Constants as any)?.expoConfig?.hostUri || (Constants as any)?.manifest2?.extra?.expoClient?.hostUri || (Constants as any)?.manifest?.hostUri;
    if (expoHostUri && typeof expoHostUri === 'string') {
      const host = expoHostUri.split(':')[0];
      if (host && host.match(/\d+\.\d+\.\d+\.\d+/)) {
        return `http://${host}:4000`;
      }
    }
  } catch {}
  return null;
}

const API_URL = (process.env.EXPO_PUBLIC_API_URL as string) || inferExpoLanUrl() || DEFAULT_HOST!;

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

export function googleLogin(id_token: string) {
	return request<AuthResponse>('/api/auth/google', { method: 'POST', body: JSON.stringify({ id_token }) });
}

export function aiReply(prompt: string): Promise<{ reply: string }> {
	return request<{ reply: string }>('/api/ai/reply', { method: 'POST', body: JSON.stringify({ prompt }) });
} 