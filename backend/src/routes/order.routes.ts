import { Router } from 'express';
import {
  createOrder,
  getOrderById,
  listOrders,
  updateOrderStatus
} from '../controllers/order.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { UserRole } from '../types/user.types';

const router = Router();

router.use(authenticate);

router.get('/', listOrders);
router.get('/:orderId', getOrderById);
router.post('/', authorize(UserRole.CLIENT, UserRole.ADMIN), createOrder);
router.patch('/:orderId/status', authorize(UserRole.MERCHANT, UserRole.ADMIN), updateOrderStatus);

export default router;
