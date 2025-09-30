import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUsersTableIfNotExists, findUserByEmail, createUser } from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set');
}

export async function initAuth() {
  await createUsersTableIfNotExists();
}

export async function registerUser({ name, email, password }) {
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new Error('Email already registered');
  }
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await createUser({ name, email, passwordHash });
  return user;
}

export async function loginUser({ email, password }) {
  const user = await findUserByEmail(email);
  if (!user) throw new Error('Invalid credentials');
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) throw new Error('Invalid credentials');

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  return {
    token,
    user: { id: user.id, email: user.email, name: user.name },
  };
} 