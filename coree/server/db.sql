-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	name text NOT NULL,
	email text UNIQUE NOT NULL,
	password_hash text NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now()
); 