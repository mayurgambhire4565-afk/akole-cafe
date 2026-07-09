import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { sendSuccess, sendError } from '../utils/response';
import { Response } from 'express';
import prisma from '../database/prisma';

const router = Router();
router.use(authenticate);

// Wishlist
router.get('/', asyncHandler(async (req: AuthRequest, res: Response) => {
  const wishlist = await prisma.wishlist.findMany({
    where: { userId: req.user!.id },
    include: { product: { include: { category: { select: { name: true, slug: true } } } } },
    orderBy: { createdAt: 'desc' },
  });
  sendSuccess(res, { wishlist }, 'Wishlist fetched');
}));

router.post('/toggle', asyncHandler(async (req: AuthRequest, res: Response) => {
  const { productId } = req.body;
  if (!productId) { sendError(res, 'Product ID required', 400); return; }

  const existing = await prisma.wishlist.findUnique({
    where: { userId_productId: { userId: req.user!.id, productId } },
  });

  if (existing) {
    await prisma.wishlist.delete({ where: { id: existing.id } });
    sendSuccess(res, { wishlisted: false }, 'Removed from wishlist');
  } else {
    await prisma.wishlist.create({ data: { userId: req.user!.id, productId } });
    sendSuccess(res, { wishlisted: true }, 'Added to wishlist');
  }
}));

router.delete('/:productId', asyncHandler(async (req: AuthRequest, res: Response) => {
  await prisma.wishlist.deleteMany({ where: { userId: req.user!.id, productId: req.params.productId } });
  sendSuccess(res, null, 'Removed from wishlist');
}));

export default router;
