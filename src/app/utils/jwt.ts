import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export function verifyToken(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  if (!token) return null;

  try {
    return jwt.verify(token, 'your_jwt_secret');
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}
