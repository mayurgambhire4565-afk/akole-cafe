import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { authenticate, authorize } from '../middleware/auth';
import { uploadMultiple, uploadSingle } from '../middleware/upload';

const router = Router();

// Public routes
router.get('/', productController.getProducts);
router.get('/categories', productController.getCategories);
router.get('/:slug', productController.getProductBySlug);

// Admin only
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), uploadMultiple, productController.createProduct);
router.put('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), productController.updateProduct);
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), productController.deleteProduct);

// Categories
router.post('/categories', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), uploadSingle, productController.createCategory);
router.put('/categories/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), productController.updateCategory);
router.delete('/categories/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), productController.deleteCategory);

export default router;
