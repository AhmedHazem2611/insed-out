import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

const jwtSecret = process.env.JWT_SECRET || "change-me";

export interface AuthenticatedRequest extends Request {
	user?: { id: string; email: string };
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
	const authHeader = req.headers.authorization || "";
	const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
	if (!token) {
		return res.status(401).json({ error: "Missing authorization token" });
	}
	try {
		const payload = jwt.verify(token, jwtSecret) as { id: string; email: string };
		req.user = { id: payload.id, email: payload.email };
		return next();
	} catch (err) {
		return res.status(401).json({ error: "Invalid or expired token" });
	}
}
