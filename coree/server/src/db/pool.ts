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

export async function runQuery<T = any>(text: string, params: any[] = []): Promise<{ rows: T[] }> {
	return pool.query<T>(text, params);
}
