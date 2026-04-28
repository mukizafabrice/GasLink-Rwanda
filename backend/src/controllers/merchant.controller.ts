import { Response } from 'express';
import { Types } from 'mongoose';
import { MerchantShopModel } from '../models/MerchantShop';
import { OrderModel } from '../models/Order';
import { ProductModel } from '../models/Product';
import { ReviewModel } from '../models/Review';
import { AuthRequest } from '../middlewares/auth.middleware';
import { OrderStatus, ProductCategory } from '../types';
import { sendError, sendSuccess } from '../utils/apiResponse';
import { transitionOrderStatus } from '../services/order.service';

const getMerchantShop = async (merchantId: string) =>
  MerchantShopModel.findOne({ owner: merchantId });

export const getMerchantDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const merchantId = req.user?.id;
    if (!merchantId) {
      return sendError(res, 401, 'Unauthorized');
    }

    const [shop, products, orders, reviews] = await Promise.all([
      getMerchantShop(merchantId),
      ProductModel.find({
        merchant: merchantId,
        category: ProductCategory.GAS_CYLINDER,
        catalogItem: { $exists: true }
      }).sort({ createdAt: -1 }),
      OrderModel.find({ merchant: merchantId })
        .populate('client', 'firstName lastName email phone')
        .sort({ createdAt: -1 })
        .limit(5)
        .populate({
          path: 'items',
          model: 'OrderItem'
        }),
      ReviewModel.find({ merchant: merchantId }).sort({ createdAt: -1 }).limit(5)
    ]);

    const totalRevenue = orders
      .filter((order) => order.status === OrderStatus.DELIVERED)
      .reduce((sum, order) => sum + order.totalAmount, 0);

    const pendingOrders = orders.filter((order) => order.status === OrderStatus.PENDING).length;

    return sendSuccess(res, 200, 'Merchant dashboard fetched successfully', {
      shop,
      stats: {
        totalProducts: products.length,
        lowStockProducts: products.filter((product) => product.currentStock <= product.minStockLevel).length,
        totalOrders: await OrderModel.countDocuments({ merchant: merchantId }),
        pendingOrders,
        totalRevenue,
        averageRating: shop?.averageRating ?? 0,
        totalReviews: shop?.totalReviews ?? 0
      },
      recentOrders: orders,
      products: products.slice(0, 6),
      recentReviews: reviews
    });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Failed to fetch merchant dashboard', 'Server error');
  }
};

export const getMerchantInventory = async (req: AuthRequest, res: Response) => {
  try {
    const merchantId = req.user?.id;
    if (!merchantId) {
      return sendError(res, 401, 'Unauthorized');
    }

    const filters: Record<string, unknown> = {
      merchant: merchantId,
      category: ProductCategory.GAS_CYLINDER,
      catalogItem: { $exists: true }
    };

    if (req.query.search) {
      filters.$text = { $search: String(req.query.search) };
    }

    if (req.query.lowStock === 'true') {
      filters.$expr = { $lte: ['$currentStock', '$minStockLevel'] };
    }

    const inventory = await ProductModel.find(filters).sort({ createdAt: -1 });

    return sendSuccess(res, 200, 'Merchant inventory fetched successfully', inventory);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Failed to fetch inventory', 'Server error');
  }
};

export const getMerchantOrders = async (req: AuthRequest, res: Response) => {
  try {
    const merchantId = req.user?.id;
    if (!merchantId) {
      return sendError(res, 401, 'Unauthorized');
    }

    const filters: Record<string, unknown> = { merchant: merchantId };
    if (req.query.status) {
      filters.status = String(req.query.status);
    }

    const orders = await OrderModel.find(filters)
      .populate('client', 'firstName lastName email phone')
      .populate('shop', 'shopName')
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

    return sendSuccess(res, 200, 'Merchant orders fetched successfully', orders);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Failed to fetch merchant orders', 'Server error');
  }
};

export const updateMerchantOrder = async (req: AuthRequest, res: Response) => {
  try {
    const merchantId = req.user?.id;
    if (!merchantId) {
      return sendError(res, 401, 'Unauthorized');
    }

    const status = req.body.status as OrderStatus;
    if (!Object.values(OrderStatus).includes(status)) {
      return sendError(res, 400, 'Invalid order status');
    }

    const order = await OrderModel.findById(req.params.orderId);
    if (!order || order.merchant.toString() !== merchantId) {
      return sendError(res, 404, 'Order not found');
    }

    const updatedOrder = await transitionOrderStatus({
      orderId: order.id,
      actorId: merchantId,
      status,
      note: req.body.note
    });

    return sendSuccess(res, 200, 'Order updated successfully', updatedOrder);
  } catch (error) {
    console.error(error);
    return sendError(res, 400, error instanceof Error ? error.message : 'Failed to update order');
  }
};

export const getMerchantAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const merchantId = req.user?.id;
    if (!merchantId) {
      return sendError(res, 401, 'Unauthorized');
    }

    const [salesByStatus, monthlySales, productMix] = await Promise.all([
      OrderModel.aggregate([
        { $match: { merchant: new Types.ObjectId(merchantId) } },
        { $group: { _id: '$status', count: { $sum: 1 }, total: { $sum: '$totalAmount' } } }
      ]),
      OrderModel.aggregate([
        { $match: { merchant: new Types.ObjectId(merchantId) } },
        {
          $group: {
            _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
            orders: { $sum: 1 },
            revenue: { $sum: '$totalAmount' }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]),
      ProductModel.aggregate([
        {
          $match: {
            merchant: new Types.ObjectId(merchantId),
            category: ProductCategory.GAS_CYLINDER,
            catalogItem: { $exists: true }
          }
        },
        { $group: { _id: '$category', count: { $sum: 1 }, stock: { $sum: '$currentStock' } } }
      ])
    ]);

    return sendSuccess(res, 200, 'Merchant analytics fetched successfully', {
      salesByStatus,
      monthlySales,
      productMix
    });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Failed to fetch analytics', 'Server error');
  }
};

export const getShopSettings = async (req: AuthRequest, res: Response) => {
  try {
    const merchantId = req.user?.id;
    if (!merchantId) {
      return sendError(res, 401, 'Unauthorized');
    }

    const shop = await getMerchantShop(merchantId);
    if (!shop) {
      return sendError(res, 404, 'Shop not found');
    }

    return sendSuccess(res, 200, 'Shop settings fetched successfully', shop);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Failed to fetch shop settings', 'Server error');
  }
};

export const updateShopSettings = async (req: AuthRequest, res: Response) => {
  try {
    const merchantId = req.user?.id;
    if (!merchantId) {
      return sendError(res, 401, 'Unauthorized');
    }

    const shop = await getMerchantShop(merchantId);
    if (!shop) {
      return sendError(res, 404, 'Shop not found');
    }

    const allowedFields = [
      'shopName',
      'description',
      'businessEmail',
      'businessPhone',
      'businessLicense',
      'address',
      'deliveryFee',
      'minimumOrderAmount',
      'isOpen',
      'coordinates'
    ] as const;

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        (shop as any)[field] = req.body[field];
      }
    }

    await shop.save();

    return sendSuccess(res, 200, 'Shop settings updated successfully', shop);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Failed to update shop settings', 'Server error');
  }
};
