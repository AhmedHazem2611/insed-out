import { initAuth, registerUser, loginUser } from '../services/authService.js';

await initAuth();

export async function registerHandler(req, res) {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
    const user = await registerUser({ name, email, password });
    return res.status(201).json({ user });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
}

export async function loginHandler(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
    const result = await loginUser({ email, password });
    return res.json(result);
  } catch (e) {
    return res.status(401).json({ error: e.message });
  }
} 