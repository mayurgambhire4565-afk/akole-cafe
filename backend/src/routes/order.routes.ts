import { Router } from 'express';
import * as orderController from '../controllers/order.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);

// Customer routes
router.post('/', orderController.createOrder);
router.get('/my', orderController.getMyOrders);
router.get('/my/:id', orderController.getOrderById);
router.put('/my/:id/cancel', orderController.cancelOrder);

// Admin routes
router.get('/', authorize('ADMIN', 'SUPER_ADMIN'), orderController.getAllOrders);
router.put('/:id/status', authorize('ADMIN', 'SUPER_ADMIN', 'EMPLOYEE'), orderController.updateOrderStatus);

export default router;
