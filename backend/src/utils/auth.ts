import jwt from 'jsonwebtoken';
import { UserDocument, toPublicUser } from '../models/User';

export const JWT_SECRET = process.env.JWT_SECRET || 'gaslink-secret-key';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const signAuthToken = (user: UserDocument) =>
  jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']
  });

export const buildAuthPayload = (user: UserDocument) => ({
  token: signAuthToken(user),
  user: toPublicUser(user)
});
