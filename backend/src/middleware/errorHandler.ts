import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const createError = (message: string, statusCode: number): AppError => {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};

// Global error handler
export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const isDatabaseError = err.stack?.includes('PrismaClient') || err.name.startsWith('Prisma') || err.message.includes('prisma');
  
  const statusCode = err.statusCode || (isDatabaseError ? 500 : 400);
  const message = err.isOperational || !isDatabaseError ? err.message : 'Internal server error';

  console.error(`[ERROR] ${err.stack}`);

  sendError(res, message, statusCode);
};

// 404 handler
export const notFound = (_req: Request, res: Response): void => {
  sendError(res, 'Route not found', 404);
};

// Async handler wrapper
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
