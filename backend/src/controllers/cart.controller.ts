import { Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { sendSuccess, sendError } from '../utils/response';
import * as cartService from '../services/cart.service';

export const getCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  const cart = await cartService.getCart(req.user!.id);
  sendSuccess(res, { cart }, 'Cart fetched');
});

export const addToCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { productId, quantity = 1 } = req.body;
  if (!productId) { sendError(res, 'Product ID required', 400); return; }
  const cart = await cartService.addToCart(req.user!.id, productId, quantity);
  sendSuccess(res, { cart }, 'Item added to cart');
});

export const updateCartItem = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { itemId } = req.params;
  const { quantity } = req.body;
  if (quantity === undefined) { sendError(res, 'Quantity required', 400); return; }
  const cart = await cartService.updateCartItem(req.user!.id, itemId, quantity);
  sendSuccess(res, { cart }, 'Cart updated');
});

export const removeFromCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  const cart = await cartService.removeFromCart(req.user!.id, req.params.itemId);
  sendSuccess(res, { cart }, 'Item removed from cart');
});

export const clearCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  await cartService.clearCart(req.user!.id);
  sendSuccess(res, null, 'Cart cleared');
});
