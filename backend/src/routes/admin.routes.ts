import { Router } from 'express';
import {
  createProductCatalogEntry,
  deleteProductCatalogEntry,
  getAllUsers,
  getMerchantVerifications,
  getPlatformAnalytics,
  getProductCatalog,
  getPlatformStats,
  getSystemSettings,
  toggleUserStatus,
  updateProductCatalogEntry,
  updateMerchantVerification,
  updateSystemSettings
} from '../controllers/admin.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { UserRole } from '../types/user.types';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorize(UserRole.ADMIN));

router.get('/users', getAllUsers);
router.get('/stats', getPlatformStats);
router.get('/analytics', getPlatformAnalytics);
router.get('/product-catalog', getProductCatalog);
router.post('/product-catalog', createProductCatalogEntry);
router.patch('/product-catalog/:catalogId', updateProductCatalogEntry);
router.delete('/product-catalog/:catalogId', deleteProductCatalogEntry);
router.get('/merchant-verifications', getMerchantVerifications);
router.patch('/merchant-verifications/:shopId', updateMerchantVerification);
router.get('/settings', getSystemSettings);
router.patch('/settings', updateSystemSettings);
router.patch('/users/:userId/status', toggleUserStatus);

export default router;
