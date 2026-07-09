import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { sendError } from '../utils/response';
import prisma from '../database/prisma';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      sendError(res, 'Access token required', 401);
      return;
    }

    const payload = verifyAccessToken(token);

    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, email: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      sendError(res, 'User not found or deactivated', 401);
      return;
    }

    req.user = { id: user.id, email: user.email, role: user.role };
    next();
  } catch {
    sendError(res, 'Invalid or expired token', 401);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'Authentication required', 401);
      return;
    }
    if (!roles.includes(req.user.role)) {
      sendError(res, 'Insufficient permissions', 403);
      return;
    }
    next();
  };
};

export const optionalAuth = async (req: AuthRequest, _res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (token) {
      const payload = verifyAccessToken(token);
      req.user = { id: payload.id, email: payload.email, role: payload.role };
    }
  } catch {
    // Not authenticated — continue
  }
  next();
};
