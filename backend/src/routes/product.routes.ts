import { Router } from 'express';
import {
  adjustProductStock,
  createProduct,
  deleteProduct,
  getProductById,
  listProductCatalog,
  listProducts,
  updateProduct
} from '../controllers/product.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { UserRole } from '../types/user.types';

const router = Router();

router.get('/catalog', listProductCatalog);
router.get('/', listProducts);
router.get('/:productId', getProductById);
router.post('/', authenticate, authorize(UserRole.ADMIN, UserRole.MERCHANT), createProduct);
router.patch('/:productId/stock', authenticate, authorize(UserRole.ADMIN, UserRole.MERCHANT), adjustProductStock);
router.patch('/:productId', authenticate, authorize(UserRole.ADMIN, UserRole.MERCHANT), updateProduct);
router.delete('/:productId', authenticate, authorize(UserRole.ADMIN, UserRole.MERCHANT), deleteProduct);

export default router;
