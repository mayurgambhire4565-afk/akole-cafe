import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { sendSuccess, sendError } from '../utils/response';
import { Response } from 'express';
import prisma from '../database/prisma';

const router = Router();

// Get reviews for a product (public)
router.get('/product/:productId', asyncHandler(async (req, res) => {
  const reviews = await prisma.review.findMany({
    where: { productId: req.params.productId, isApproved: true },
    include: { user: { select: { name: true, avatar: true } } },
    orderBy: { createdAt: 'desc' },
  });
  sendSuccess(res, { reviews }, 'Reviews fetched');
}));

// Create review (authenticated)
router.post('/', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { productId, rating, title, comment } = req.body;
  if (!productId || !rating || !comment) { sendError(res, 'Product, rating and comment required', 400); return; }

  // Check if ordered this product
  const ordered = await prisma.orderItem.findFirst({
    where: { productId, order: { userId: req.user!.id, status: 'DELIVERED' } },
  });

  const review = await prisma.review.upsert({
    where: { userId_productId: { userId: req.user!.id, productId } },
    update: { rating, title, comment, isApproved: false },
    create: { userId: req.user!.id, productId, rating, title, comment, isVerifiedPurchase: !!ordered },
  });

  // Update product rating
  const { _avg, _count } = await prisma.review.aggregate({
    where: { productId, isApproved: true },
    _avg: { rating: true },
    _count: true,
  });
  await prisma.product.update({
    where: { id: productId },
    data: { rating: _avg.rating || 0, reviewCount: _count },
  });

  sendSuccess(res, { review }, 'Review submitted (pending approval)', 201);
}));

// Admin: get all reviews
router.get('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), asyncHandler(async (_req, res) => {
  const reviews = await prisma.review.findMany({
    include: {
      user: { select: { name: true, email: true } },
      product: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  sendSuccess(res, { reviews }, 'All reviews fetched');
}));

// Admin: approve/reject review
router.put('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), asyncHandler(async (req, res) => {
  const { isApproved } = req.body;
  const review = await prisma.review.update({ where: { id: req.params.id }, data: { isApproved } });

  // Recalculate product rating
  const { _avg, _count } = await prisma.review.aggregate({
    where: { productId: review.productId, isApproved: true },
    _avg: { rating: true }, _count: true,
  });
  await prisma.product.update({
    where: { id: review.productId },
    data: { rating: _avg.rating || 0, reviewCount: _count },
  });

  sendSuccess(res, { review }, 'Review updated');
}));

export default router;
