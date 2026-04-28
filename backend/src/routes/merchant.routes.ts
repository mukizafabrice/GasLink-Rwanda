import { Router } from 'express';
import {
  getMerchantAnalytics,
  getMerchantDashboard,
  getMerchantInventory,
  getMerchantOrders,
  getShopSettings,
  updateMerchantOrder,
  updateShopSettings
} from '../controllers/merchant.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { UserRole } from '../types/user.types';

const router = Router();

router.use(authenticate);
router.use(authorize(UserRole.MERCHANT, UserRole.ADMIN));

router.get('/dashboard', getMerchantDashboard);
router.get('/inventory', getMerchantInventory);
router.get('/orders', getMerchantOrders);
router.patch('/orders/:orderId/status', updateMerchantOrder);
router.get('/analytics', getMerchantAnalytics);
router.get('/shop', getShopSettings);
router.patch('/shop', updateShopSettings);

export default router;
