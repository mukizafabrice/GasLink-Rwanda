import { Router } from 'express';
import {
  browseMerchants,
  getClientNotifications,
  getClientOrderHistory,
  getMerchantProducts,
  getMerchantStorefront,
  getSavedMerchants,
  placeOrder,
  removeSavedMerchant,
  saveMerchant
} from '../controllers/client.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { UserRole } from '../types/user.types';

const router = Router();

router.get('/saved-merchants', authenticate, authorize(UserRole.CLIENT, UserRole.ADMIN), getSavedMerchants);
router.post('/saved-merchants/:merchantId', authenticate, authorize(UserRole.CLIENT, UserRole.ADMIN), saveMerchant);
router.delete('/saved-merchants/:merchantId', authenticate, authorize(UserRole.CLIENT, UserRole.ADMIN), removeSavedMerchant);
router.get('/notifications', authenticate, authorize(UserRole.CLIENT, UserRole.ADMIN), getClientNotifications);
router.get('/orders/history', authenticate, authorize(UserRole.CLIENT, UserRole.ADMIN), getClientOrderHistory);
router.post('/orders', authenticate, authorize(UserRole.CLIENT, UserRole.ADMIN), placeOrder);

router.get('/merchants', browseMerchants);
router.get('/merchants/:merchantId/products', getMerchantProducts);
router.get('/merchants/:merchantId', getMerchantStorefront);

export default router;
