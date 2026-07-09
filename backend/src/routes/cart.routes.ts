import { Router } from 'express';
import * as cartController from '../controllers/cart.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate); // All cart routes require auth

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.put('/item/:itemId', cartController.updateCartItem);
router.delete('/item/:itemId', cartController.removeFromCart);
router.delete('/clear', cartController.clearCart);

export default router;
