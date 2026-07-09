import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { sendSuccess, sendError } from '../utils/response';
import { Response } from 'express';
import prisma from '../database/prisma';

const router = Router();
router.use(authenticate);

// User notifications
router.get('/', asyncHandler(async (req: AuthRequest, res: Response) => {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  const unreadCount = await prisma.notification.count({ where: { userId: req.user!.id, isRead: false } });
  sendSuccess(res, { notifications, unreadCount }, 'Notifications fetched');
}));

router.put('/read-all', asyncHandler(async (req: AuthRequest, res: Response) => {
  await prisma.notification.updateMany({ where: { userId: req.user!.id, isRead: false }, data: { isRead: true } });
  sendSuccess(res, null, 'All notifications marked as read');
}));

router.put('/:id/read', asyncHandler(async (req: AuthRequest, res: Response) => {
  await prisma.notification.updateMany({
    where: { id: req.params.id, userId: req.user!.id },
    data: { isRead: true },
  });
  sendSuccess(res, null, 'Notification marked as read');
}));

router.delete('/:id', asyncHandler(async (req: AuthRequest, res: Response) => {
  await prisma.notification.deleteMany({ where: { id: req.params.id, userId: req.user!.id } });
  sendSuccess(res, null, 'Notification deleted');
}));

// Admin: send notification to user(s)
router.post('/send', authorize('ADMIN', 'SUPER_ADMIN'), asyncHandler(async (req, res) => {
  const { userIds, title, message, type = 'SYSTEM' } = req.body;
  if (!title || !message) { sendError(res, 'Title and message required', 400); return; }

  const data = (userIds as string[]).map((userId: string) => ({
    userId, title, message, type: type as never,
  }));
  await prisma.notification.createMany({ data });
  sendSuccess(res, null, 'Notifications sent');
}));

export default router;
