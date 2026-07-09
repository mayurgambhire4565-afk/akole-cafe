import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { sendSuccess, sendError } from '../utils/response';
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../database/prisma';

const router = Router();

// Validate coupon (public endpoint)
router.post('/validate', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { code, orderTotal } = req.body;
  if (!code) { sendError(res, 'Coupon code required', 400); return; }

  const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });

  if (!coupon || !coupon.isActive) { sendError(res, 'Invalid coupon code', 400); return; }
  if (coupon.expiresAt && new Date() > coupon.expiresAt) { sendError(res, 'Coupon has expired', 400); return; }
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) { sendError(res, 'Coupon usage limit reached', 400); return; }
  if (coupon.minOrderValue && orderTotal < coupon.minOrderValue) {
    sendError(res, `Minimum order value of ₹${coupon.minOrderValue} required`, 400); return;
  }

  // Check if user already used this coupon
  const alreadyUsed = await prisma.couponUsage.findUnique({
    where: { couponId_userId: { couponId: coupon.id, userId: req.user!.id } },
  });
  if (alreadyUsed) { sendError(res, 'You have already used this coupon', 400); return; }

  let discount = 0;
  if (coupon.type === 'PERCENTAGE') {
    discount = (orderTotal * coupon.discount) / 100;
    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  } else if (coupon.type === 'FIXED') {
    discount = coupon.discount;
  }

  sendSuccess(res, { coupon: { code: coupon.code, type: coupon.type, discount: coupon.discount, description: coupon.description }, discountAmount: discount }, 'Coupon valid');
}));

// Admin
router.get('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), asyncHandler(async (_req, res) => {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
  sendSuccess(res, { coupons }, 'Coupons fetched');
}));

router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { code, description, type, discount, minOrderValue, maxDiscount, maxUses, startsAt, expiresAt } = req.body;
  if (!code || !discount) { sendError(res, 'Code and discount required', 400); return; }

  const coupon = await prisma.coupon.create({
    data: { code: code.toUpperCase(), description, type, discount, minOrderValue, maxDiscount, maxUses, startsAt, expiresAt },
  });
  sendSuccess(res, { coupon }, 'Coupon created', 201);
}));

router.put('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), asyncHandler(async (req, res) => {
  const coupon = await prisma.coupon.update({ where: { id: req.params.id }, data: req.body });
  sendSuccess(res, { coupon }, 'Coupon updated');
}));

router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), asyncHandler(async (req, res) => {
  await prisma.coupon.delete({ where: { id: req.params.id } });
  sendSuccess(res, null, 'Coupon deleted');
}));

export default router;
