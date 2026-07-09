import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { sendSuccess, sendError } from '../utils/response';
import { Response } from 'express';
import prisma from '../database/prisma';

const router = Router();
router.use(authenticate);

router.get('/', asyncHandler(async (req: AuthRequest, res: Response) => {
  const addresses = await prisma.address.findMany({
    where: { userId: req.user!.id },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
  });
  sendSuccess(res, { addresses }, 'Addresses fetched');
}));

router.post('/', asyncHandler(async (req: AuthRequest, res: Response) => {
  const { label, name, phone, street, city, state, pincode, country, isDefault } = req.body;
  if (!name || !phone || !street || !city || !state || !pincode) {
    sendError(res, 'All address fields are required', 400); return;
  }

  if (isDefault) {
    await prisma.address.updateMany({ where: { userId: req.user!.id }, data: { isDefault: false } });
  }

  const address = await prisma.address.create({
    data: { userId: req.user!.id, label, name, phone, street, city, state, pincode, country: country || 'India', isDefault: isDefault || false },
  });
  sendSuccess(res, { address }, 'Address added', 201);
}));

router.put('/:id', asyncHandler(async (req: AuthRequest, res: Response) => {
  const address = await prisma.address.findFirst({ where: { id: req.params.id, userId: req.user!.id } });
  if (!address) { sendError(res, 'Address not found', 404); return; }

  if (req.body.isDefault) {
    await prisma.address.updateMany({ where: { userId: req.user!.id }, data: { isDefault: false } });
  }

  const updated = await prisma.address.update({ where: { id: req.params.id }, data: req.body });
  sendSuccess(res, { address: updated }, 'Address updated');
}));

router.delete('/:id', asyncHandler(async (req: AuthRequest, res: Response) => {
  const address = await prisma.address.findFirst({ where: { id: req.params.id, userId: req.user!.id } });
  if (!address) { sendError(res, 'Address not found', 404); return; }
  await prisma.address.delete({ where: { id: req.params.id } });
  sendSuccess(res, null, 'Address deleted');
}));

export default router;
