import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { sendSuccess, sendError } from '../utils/response';
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../database/prisma';
import bcrypt from 'bcrypt';
import { uploadSingle } from '../middleware/upload';
import { getPagination, paginationMeta } from '../utils/response';

const router = Router();
router.use(authenticate);

// User profile routes
router.get('/profile', asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      id: true, name: true, email: true, phone: true, avatar: true,
      role: true, isVerified: true, loyaltyPoints: true,
      referralCode: true, totalOrders: true, totalSpent: true, createdAt: true,
    },
  });
  sendSuccess(res, { user }, 'Profile fetched');
}));

router.put('/profile', asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, phone, removeAvatar, avatar } = req.body;
  const dbPhone = phone && phone.trim() !== '' ? phone.trim() : null;

  if (dbPhone) {
    const existing = await prisma.user.findFirst({
      where: {
        phone: dbPhone,
        NOT: { id: req.user!.id },
      },
    });
    if (existing) {
      sendError(res, 'Phone number already registered by another user', 400);
      return;
    }
  }

  const updateData: any = { name, phone: dbPhone };
  if (removeAvatar || avatar === null) {
    updateData.avatar = null;
  }

  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: updateData,
    select: { id: true, name: true, email: true, phone: true, avatar: true },
  });
  sendSuccess(res, { user }, 'Profile updated');
}));

router.put('/avatar', uploadSingle, asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.file) { sendError(res, 'Image required', 400); return; }
  const avatar = `/uploads/${req.file.filename}`;
  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: { avatar },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      role: true,
      isVerified: true,
      loyaltyPoints: true,
      referralCode: true,
      totalOrders: true,
      totalSpent: true,
      createdAt: true,
    },
  });
  sendSuccess(res, { user, avatar }, 'Avatar updated');
}));

router.put('/change-password', asyncHandler(async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) { sendError(res, 'Both passwords required', 400); return; }

  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user) { sendError(res, 'User not found', 404); return; }

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) { sendError(res, 'Current password incorrect', 400); return; }

  const hashed = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id: req.user!.id }, data: { password: hashed } });
  sendSuccess(res, null, 'Password changed successfully');
}));

// Admin: User management
router.get('/', authorize('ADMIN', 'SUPER_ADMIN'), asyncHandler(async (req, res) => {
  const { page = '1', limit = '20', search, role } = req.query as Record<string, string>;
  const { skip, take } = getPagination(parseInt(page), parseInt(limit));
  const where: Record<string, unknown> = {};
  if (search) where.OR = [{ name: { contains: search } }, { email: { contains: search } }];
  if (role) where.role = role;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where, skip, take,
      select: { id: true, name: true, email: true, phone: true, role: true, isActive: true, loyaltyPoints: true, totalOrders: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ]);
  sendSuccess(res, { users }, 'Users fetched', 200, paginationMeta(total, parseInt(page), parseInt(limit)));
}));

router.put('/:id/status', authorize('ADMIN', 'SUPER_ADMIN'), asyncHandler(async (req, res) => {
  const { isActive } = req.body;
  const user = await prisma.user.update({ where: { id: req.params.id }, data: { isActive } });
  sendSuccess(res, { user }, 'User status updated');
}));

router.put('/:id/role', authorize('SUPER_ADMIN'), asyncHandler(async (req, res) => {
  const { role } = req.body;
  const user = await prisma.user.update({ where: { id: req.params.id }, data: { role } });
  sendSuccess(res, { user }, 'User role updated');
}));

export default router;
