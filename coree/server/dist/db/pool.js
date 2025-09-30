import dotenv from "dotenv";
import { Pool } from "pg";
dotenv.config();
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set in environment variables");
}
export const pool = new Pool({
    connectionString: databaseUrl,
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
});
export async function runQuery(text, params = []) {
    return pool.query(text, params);
}
//# sourceMappingURL=pool.js.map