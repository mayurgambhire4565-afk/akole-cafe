import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { sendSuccess, sendError } from '../utils/response';
import { Response } from 'express';
import prisma from '../database/prisma';

const router = Router();
router.use(authenticate);

// Get user's rewards and points history
router.get('/', asyncHandler(async (req: AuthRequest, res: Response) => {
  const [user, rewards] = await Promise.all([
    prisma.user.findUnique({ where: { id: req.user!.id }, select: { loyaltyPoints: true, referralCode: true } }),
    prisma.reward.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
  ]);
  sendSuccess(res, { points: user?.loyaltyPoints || 0, referralCode: user?.referralCode, history: rewards }, 'Rewards fetched');
}));

// Redeem points
router.post('/redeem', asyncHandler(async (req: AuthRequest, res: Response) => {
  const { points } = req.body;
  if (!points || points <= 0) { sendError(res, 'Invalid points', 400); return; }

  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user) { sendError(res, 'User not found', 404); return; }
  if (user.loyaltyPoints < points) { sendError(res, 'Insufficient points', 400); return; }

  await prisma.$transaction([
    prisma.reward.create({
      data: { userId: req.user!.id, points: -points, type: 'REDEEMED', description: `Redeemed ${points} points` },
    }),
    prisma.user.update({ where: { id: req.user!.id }, data: { loyaltyPoints: { decrement: points } } }),
  ]);

  // Return discount amount (100 points = ₹10)
  const discount = points / 10;
  sendSuccess(res, { discount, pointsUsed: points }, 'Points redeemed');
}));

// Admin: get all rewards
router.get('/all', authorize('ADMIN', 'SUPER_ADMIN'), asyncHandler(async (_req, res) => {
  const rewards = await prisma.reward.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
  });
  sendSuccess(res, { rewards }, 'All rewards fetched');
}));

export default router;
