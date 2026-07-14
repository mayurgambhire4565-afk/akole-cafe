import { Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { sendSuccess, sendError } from '../utils/response';
import * as orderService from '../services/order.service';

export const createOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { addressId, couponCode, notes, paymentMethod, paymentProvider, transactionId } = req.body;
  if (!addressId) { sendError(res, 'Address required', 400); return; }
  const order = await orderService.createOrder(req.user!.id, { 
    addressId, 
    couponCode, 
    notes, 
    paymentMethod, 
    paymentProvider, 
    transactionId 
  });
  sendSuccess(res, { order }, 'Order placed successfully', 201);
});

export const getMyOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page = '1', limit = '10' } = req.query as Record<string, string>;
  const result = await orderService.getUserOrders(req.user!.id, parseInt(page), parseInt(limit));
  sendSuccess(res, { orders: result.orders }, 'Orders fetched', 200, result.pagination);
});

export const getOrderById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const order = await orderService.getOrderById(req.params.id, req.user!.id);
  sendSuccess(res, { order }, 'Order fetched');
});

export const cancelOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await orderService.cancelOrder(req.params.id, req.user!.id);
  sendSuccess(res, null, result.message);
});

// Admin
export const getAllOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page = '1', limit = '20', status } = req.query as Record<string, string>;
  const result = await orderService.getAllOrders(parseInt(page), parseInt(limit), status);
  sendSuccess(res, { orders: result.orders }, 'All orders fetched', 200, result.pagination);
});

export const updateOrderStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { status, message } = req.body;
  if (!status) { sendError(res, 'Status required', 400); return; }
  const order = await orderService.updateOrderStatus(req.params.id, status, message);
  sendSuccess(res, { order }, 'Order status updated');
});
