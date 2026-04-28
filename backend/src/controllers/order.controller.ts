import { Response } from 'express';
import { OrderModel } from '../models/Order';
import { AuthRequest } from '../middlewares/auth.middleware';
import { createOrderRecord, transitionOrderStatus } from '../services/order.service';
import { OrderStatus } from '../types';
import { UserRole } from '../types/user.types';
import { sendError, sendSuccess } from '../utils/apiResponse';

export const listOrders = async (req: AuthRequest, res: Response) => {
  try {
    const filters: Record<string, unknown> = {};
    if (!req.user) {
      return sendError(res, 401, 'Unauthorized');
    }

    if (req.user.role === UserRole.CLIENT) {
      filters.client = req.user.id;
    } else if (req.user.role === UserRole.MERCHANT) {
      filters.merchant = req.user.id;
    }

    if (req.query.status) {
      filters.status = String(req.query.status);
    }

    const orders = await OrderModel.find(filters)
      .populate('client', 'firstName lastName email phone')
      .populate('merchant', 'firstName lastName email phone')
      .populate('shop', 'shopName slug')
      .populate({
        path: 'items',
        model: 'OrderItem',
        populate: {
          path: 'product',
          model: 'Product',
          select: 'name category imageUrl'
        }
      })
      .sort({ createdAt: -1 });

    return sendSuccess(res, 200, 'Orders fetched successfully', orders);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Failed to fetch orders', 'Server error');
  }
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const order = await OrderModel.findById(req.params.orderId)
      .populate('client', 'firstName lastName email phone')
      .populate('merchant', 'firstName lastName email phone')
      .populate('shop', 'shopName slug address')
      .populate({
        path: 'items',
        model: 'OrderItem',
        populate: {
          path: 'product',
          model: 'Product',
          select: 'name category imageUrl'
        }
      });

    if (!order) {
      return sendError(res, 404, 'Order not found');
    }

    const orderClientId = (order.client as any)?._id?.toString?.() ?? order.client.toString();
    const orderMerchantId = (order.merchant as any)?._id?.toString?.() ?? order.merchant.toString();

    if (
      req.user?.role !== UserRole.ADMIN &&
      orderClientId !== req.user?.id &&
      orderMerchantId !== req.user?.id
    ) {
      return sendError(res, 403, 'Forbidden');
    }

    return sendSuccess(res, 200, 'Order fetched successfully', order);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Failed to fetch order', 'Server error');
  }
};

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const clientId = req.user?.id;
    if (!clientId) {
      return sendError(res, 401, 'Unauthorized');
    }

    const { merchantId, items, deliveryAddress, deliveryFee, clientNote, paymentMethod } = req.body;
    const order = await createOrderRecord({
      clientId,
      merchantId,
      items,
      deliveryAddress,
      deliveryFee,
      clientNote,
      paymentMethod
    });

    return sendSuccess(res, 201, 'Order created successfully', order);
  } catch (error) {
    console.error(error);
    return sendError(res, 400, error instanceof Error ? error.message : 'Failed to create order');
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const actorId = req.user?.id;
    if (!actorId) {
      return sendError(res, 401, 'Unauthorized');
    }

    const status = req.body.status as OrderStatus;
    if (!Object.values(OrderStatus).includes(status)) {
      return sendError(res, 400, 'Invalid order status');
    }

    const updatedOrder = await transitionOrderStatus({
      orderId: req.params.orderId,
      actorId,
      status,
      note: req.body.note
    });

    return sendSuccess(res, 200, 'Order status updated successfully', updatedOrder);
  } catch (error) {
    console.error(error);
    return sendError(res, 400, error instanceof Error ? error.message : 'Failed to update order status');
  }
};
