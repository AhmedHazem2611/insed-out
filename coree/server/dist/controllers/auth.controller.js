import { z } from "zod";
import bcrypt from "bcrypt";
import jwt, {} from "jsonwebtoken";
import { runQuery } from "../db/pool.js";
import { OAuth2Client } from "google-auth-library";
const jwtSecret = (process.env.JWT_SECRET || "change-me");
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "7d";
const googleClientId = process.env.GOOGLE_CLIENT_ID || "";
const googleClient = googleClientId ? new OAuth2Client(googleClientId) : undefined;
const registerSchema = z.object({
    name: z.string().min(1).max(120),
    email: z.string().email(),
    password: z.string().min(8).max(100),
});
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(100),
});
const googleSchema = z.object({ id_token: z.string().min(10) });
function signToken(payload) {
    const options = { expiresIn: jwtExpiresIn };
    return jwt.sign(payload, jwtSecret, options);
}
export async function registerHandler(req, res) {
    const parse = registerSchema.safeParse(req.body);
    if (!parse.success) {
        return res.status(400).json({ error: "Invalid input", details: parse.error.flatten() });
    }
    const { name, email, password } = parse.data;
    try {
        const existing = await runQuery("SELECT id FROM users WHERE email = $1", [email]);
        if (existing.rows.length > 0) {
            return res.status(409).json({ error: "Email already registered" });
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const inserted = await runQuery("INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, email, name", [name, email, passwordHash]);
        const user = inserted.rows[0];
        const token = signToken({ id: user.id, email: user.email });
        return res.status(201).json({ token, user });
    }
    catch (err) {
        console.error("register error", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}
export async function loginHandler(req, res) {
    const parse = loginSchema.safeParse(req.body);
    if (!parse.success) {
        return res.status(400).json({ error: "Invalid credentials" });
    }
    const { email, password } = parse.data;
    try {
        const result = await runQuery("SELECT id, email, name, password_hash FROM users WHERE email = $1", [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const user = result.rows[0];
        const ok = await bcrypt.compare(password, user.password_hash);
        if (!ok) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = signToken({ id: user.id, email: user.email });
        return res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
    }
    catch (err) {
        console.error("login error", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}
export async function meHandler(req, res) {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    try {
        const result = await runQuery("SELECT id, email, name FROM users WHERE id = $1", [req.user.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.json({ user: result.rows[0] });
    }
    catch (err) {
        console.error("me error", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}
export async function googleLoginHandler(req, res) {
    if (!googleClient || !googleClientId) {
        return res.status(500).json({ error: "Google login not configured" });
    }
    const parsed = googleSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: "Missing id_token" });
    }
    try {
        const ticket = await googleClient.verifyIdToken({ idToken: parsed.data.id_token, audience: googleClientId });
        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            return res.status(401).json({ error: "Invalid Google token" });
        }
        const email = payload.email;
        const name = payload.name || email.split("@")[0];
        // Upsert user
        const found = await runQuery("SELECT id, email, name FROM users WHERE email = $1", [email]);
        let user = found.rows[0];
        if (!user) {
            const inserted = await runQuery("INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, email, name", [name, email, "GOOGLE_LOGIN"]);
            user = inserted.rows[0];
        }
        const token = signToken({ id: user.id, email: user.email });
        return res.json({ token, user });
    }
    catch (err) {
        console.error("google login error", err);
        return res.status(401).json({ error: "Google token verification failed" });
    }
}
//# sourceMappingURL=auth.controller.js.map