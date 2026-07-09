import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { sendSuccess, sendError } from '../utils/response';
import { Response } from 'express';
import prisma from '../database/prisma';

const router = Router();
router.use(authenticate);

// User subscriptions
router.get('/', asyncHandler(async (req: AuthRequest, res: Response) => {
  const subscriptions = await prisma.subscription.findMany({
    where: { userId: req.user!.id },
    include: { product: { select: { name: true, images: true, price: true } } },
    orderBy: { createdAt: 'desc' },
  });
  sendSuccess(res, { subscriptions }, 'Subscriptions fetched');
}));

router.post('/', asyncHandler(async (req: AuthRequest, res: Response) => {
  const { productId, plan, quantity = 1 } = req.body;
  if (!productId || !plan) { sendError(res, 'Product and plan required', 400); return; }

  const product = await prisma.product.findUnique({ where: { id: productId, isActive: true } });
  if (!product) { sendError(res, 'Product not found', 404); return; }

  const nextDelivery = new Date();
  if (plan === 'WEEKLY') nextDelivery.setDate(nextDelivery.getDate() + 7);
  else if (plan === 'MONTHLY') nextDelivery.setMonth(nextDelivery.getMonth() + 1);

  const price = (product.salePrice || product.price) * quantity;
  const subscription = await prisma.subscription.create({
    data: { userId: req.user!.id, productId, plan, quantity, price, nextDelivery },
    include: { product: { select: { name: true, images: true } } },
  });
  sendSuccess(res, { subscription }, 'Subscription created', 201);
}));

router.put('/:id/pause', asyncHandler(async (req: AuthRequest, res: Response) => {
  const { pauseUntil } = req.body;
  const sub = await prisma.subscription.findFirst({ where: { id: req.params.id, userId: req.user!.id } });
  if (!sub) { sendError(res, 'Subscription not found', 404); return; }

  const subscription = await prisma.subscription.update({
    where: { id: req.params.id },
    data: { status: 'PAUSED', pausedUntil: pauseUntil ? new Date(pauseUntil) : null },
  });
  sendSuccess(res, { subscription }, 'Subscription paused');
}));

router.put('/:id/resume', asyncHandler(async (req: AuthRequest, res: Response) => {
  const sub = await prisma.subscription.findFirst({ where: { id: req.params.id, userId: req.user!.id } });
  if (!sub) { sendError(res, 'Subscription not found', 404); return; }

  const subscription = await prisma.subscription.update({
    where: { id: req.params.id },
    data: { status: 'ACTIVE', pausedUntil: null },
  });
  sendSuccess(res, { subscription }, 'Subscription resumed');
}));

router.put('/:id/cancel', asyncHandler(async (req: AuthRequest, res: Response) => {
  const sub = await prisma.subscription.findFirst({ where: { id: req.params.id, userId: req.user!.id } });
  if (!sub) { sendError(res, 'Subscription not found', 404); return; }

  const subscription = await prisma.subscription.update({
    where: { id: req.params.id },
    data: { status: 'CANCELLED', cancelledAt: new Date() },
  });
  sendSuccess(res, { subscription }, 'Subscription cancelled');
}));

// Admin
router.get('/all', authorize('ADMIN', 'SUPER_ADMIN'), asyncHandler(async (_req, res) => {
  const subscriptions = await prisma.subscription.findMany({
    include: {
      user: { select: { name: true, email: true } },
      product: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  sendSuccess(res, { subscriptions }, 'All subscriptions fetched');
}));

export default router;
