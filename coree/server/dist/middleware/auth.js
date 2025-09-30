import jwt from "jsonwebtoken";
const jwtSecret = process.env.JWT_SECRET || "change-me";
export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) {
        return res.status(401).json({ error: "Missing authorization token" });
    }
    try {
        const payload = jwt.verify(token, jwtSecret);
        req.user = { id: payload.id, email: payload.email };
        return next();
    }
    catch (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}
//# sourceMappingURL=auth.js.map