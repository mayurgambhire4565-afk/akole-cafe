import { Response } from 'express';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  errors?: unknown;
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200,
  pagination?: ApiResponse['pagination']
): Response => {
  const response: ApiResponse<T> = { success: true, message, data };
  if (pagination) response.pagination = pagination;
  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message = 'Something went wrong',
  statusCode = 500,
  errors?: unknown
): Response => {
  const response: ApiResponse = { success: false, message };
  if (errors) response.errors = errors;
  return res.status(statusCode).json(response);
};

export const getPagination = (page: number, limit: number) => {
  const skip = (page - 1) * limit;
  return { skip, take: limit };
};

export const paginationMeta = (total: number, page: number, limit: number) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
});
