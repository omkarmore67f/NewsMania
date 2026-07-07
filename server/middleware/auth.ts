import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../types';
import { UserModel } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-newsmania-ai';

export async function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Authorization token missing or malformed' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };

    const user = await UserModel.findById(decoded.id);
    if (!user) {
      res.status(401).json({ error: 'User associated with this token no longer exists' });
      return;
    }

    // Convert mongoose document to plain object
    const userObj = user.toObject();
    const { passwordHash, ...userWithoutPassword } = userObj;
    req.user = userWithoutPassword;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired authorization token' });
  }
}

export async function optionalAuthMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };

      const user = await UserModel.findById(decoded.id);
      if (user) {
        const userObj = user.toObject();
        const { passwordHash, ...userWithoutPassword } = userObj;
        req.user = userWithoutPassword;
      }
    }
  } catch (error) {
    // Fail silently since auth is optional for these routes
  }
  next();
}

export async function adminMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  await authMiddleware(req, res, () => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
    }
  });
}
