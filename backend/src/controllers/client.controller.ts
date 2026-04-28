import { Response } from 'express';
import { MerchantShopModel } from '../models/MerchantShop';
import { NotificationModel } from '../models/Notification';
import { OrderModel } from '../models/Order';
import { ProductModel } from '../models/Product';
import { ReviewModel } from '../models/Review';
import { UserModel } from '../models/User';
import { AuthRequest } from '../middlewares/auth.middleware';
import { ProductCategory, VerificationStatus } from '../types';
import { createOrderRecord } from '../services/order.service';
import { sendError, sendSuccess } from '../utils/apiResponse';

export const browseMerchants = async (req: AuthRequest, res: Response) => {
  try {
    const filters: Record<string, unknown> = {
      verificationStatus: VerificationStatus.APPROVED
    };

    if (req.query.search) {
      filters.$text = { $search: String(req.query.search) };
    }

    if (req.query.province) {
      filters['address.province'] = String(req.query.province);
    }

    if (req.query.district) {
      filters['address.district'] = String(req.query.district);
    }

    if (req.query.sector) {
      filters['address.sector'] = String(req.query.sector);
    }

    const shops = await MerchantShopModel.find(filters)
      .populate('owner', 'firstName lastName email phone isActive')
      .sort({ isFeatured: -1, averageRating: -1, createdAt: -1 });

    const currentUser = req.user?.id ? await UserModel.findById(req.user.id) : null;
    const savedSet = new Set(currentUser?.savedMerchants?.map((value) => value.toString()) ?? []);

    const payload = shops.map((shop) => ({
      ...shop.toObject(),
      isSaved: savedSet.has(shop.id)
    }));

    return sendSuccess(res, 200, 'Merchants fetched successfully', payload);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Failed to fetch merchants', 'Server error');
  }
};

export const getMerchantStorefront = async (req: AuthRequest, res: Response) => {
  try {
    const merchantId = req.params.merchantId;
    const [shop, products, reviews] = await Promise.all([
      MerchantShopModel.findOne({ owner: merchantId }).populate('owner', 'firstName lastName email phone'),
      ProductModel.find({
        merchant: merchantId,
        isAvailable: true,
        category: ProductCategory.GAS_CYLINDER,
        catalogItem: { $exists: true }
      }).sort({ isFeatured: -1, createdAt: -1 }),
      ReviewModel.find({ merchant: merchantId })
        .populate('client', 'firstName lastName')
        .sort({ createdAt: -1 })
        .limit(10)
    ]);

    if (!shop) {
      return sendError(res, 404, 'Merchant shop not found');
    }

    return sendSuccess(res, 200, 'Merchant storefront fetched successfully', {
      shop,
      products,
      reviews
    });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Failed to fetch merchant storefront', 'Server error');
  }
};

export const getMerchantProducts = async (req: AuthRequest, res: Response) => {
  try {
    const merchantId = req.params.merchantId;
    const filters: Record<string, unknown> = {
      merchant: merchantId,
      isAvailable: true,
      category: ProductCategory.GAS_CYLINDER,
      catalogItem: { $exists: true }
    };

    if (req.query.search) {
      filters.$text = { $search: String(req.query.search) };
    }

    const products = await ProductModel.find(filters).sort({ isFeatured: -1, createdAt: -1 });
    return sendSuccess(res, 200, 'Merchant products fetched successfully', products);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Failed to fetch merchant products', 'Server error');
  }
};

export const placeOrder = async (req: AuthRequest, res: Response) => {
  try {
    const clientId = req.user?.id;
    if (!clientId) {
      return sendError(res, 401, 'Unauthorized');
    }

    const { merchantId, items, deliveryAddress, deliveryFee, clientNote, paymentMethod } = req.body;
    if (!merchantId || !items || !deliveryAddress) {
      return sendError(res, 400, 'merchantId, items, and deliveryAddress are required');
    }

    const order = await createOrderRecord({
      clientId,
      merchantId,
      items,
      deliveryAddress,
      deliveryFee,
      clientNote,
      paymentMethod
    });

    return sendSuccess(res, 201, 'Order placed successfully', order);
  } catch (error) {
    console.error(error);
    return sendError(res, 400, error instanceof Error ? error.message : 'Failed to place order');
  }
};

export const getClientOrderHistory = async (req: AuthRequest, res: Response) => {
  try {
    const clientId = req.user?.id;
    if (!clientId) {
      return sendError(res, 401, 'Unauthorized');
    }

    const orders = await OrderModel.find({ client: clientId })
      .populate('merchant', 'firstName lastName email phone')
      .populate('shop', 'shopName slug address businessPhone')
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

    return sendSuccess(res, 200, 'Order history fetched successfully', orders);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Failed to fetch order history', 'Server error');
  }
};

export const getSavedMerchants = async (req: AuthRequest, res: Response) => {
  try {
    const clientId = req.user?.id;
    if (!clientId) {
      return sendError(res, 401, 'Unauthorized');
    }

    const user = await UserModel.findById(clientId).populate({
      path: 'savedMerchants',
      model: 'MerchantShop',
      populate: {
        path: 'owner',
        model: 'User',
        select: 'firstName lastName email phone'
      }
    });

    return sendSuccess(res, 200, 'Saved merchants fetched successfully', user?.savedMerchants ?? []);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Failed to fetch saved merchants', 'Server error');
  }
};

export const saveMerchant = async (req: AuthRequest, res: Response) => {
  try {
    const clientId = req.user?.id;
    if (!clientId) {
      return sendError(res, 401, 'Unauthorized');
    }

    const shop = await MerchantShopModel.findOne({ owner: req.params.merchantId });
    if (!shop) {
      return sendError(res, 404, 'Merchant shop not found');
    }

    const user = await UserModel.findByIdAndUpdate(
      clientId,
      { $addToSet: { savedMerchants: shop.id } },
      { new: true }
    );

    return sendSuccess(res, 200, 'Merchant saved successfully', user?.savedMerchants ?? []);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Failed to save merchant', 'Server error');
  }
};

export const removeSavedMerchant = async (req: AuthRequest, res: Response) => {
  try {
    const clientId = req.user?.id;
    if (!clientId) {
      return sendError(res, 401, 'Unauthorized');
    }

    const shop = await MerchantShopModel.findOne({ owner: req.params.merchantId });
    if (!shop) {
      return sendError(res, 404, 'Merchant shop not found');
    }

    const user = await UserModel.findByIdAndUpdate(
      clientId,
      { $pull: { savedMerchants: shop.id } },
      { new: true }
    );

    return sendSuccess(res, 200, 'Merchant removed from saved list', user?.savedMerchants ?? []);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Failed to remove saved merchant', 'Server error');
  }
};

export const getClientNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const clientId = req.user?.id;
    if (!clientId) {
      return sendError(res, 401, 'Unauthorized');
    }

    const notifications = await NotificationModel.find({ user: clientId }).sort({ createdAt: -1 }).limit(30);
    return sendSuccess(res, 200, 'Notifications fetched successfully', notifications);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Failed to fetch notifications', 'Server error');
  }
};
