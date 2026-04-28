import { Request, Response } from 'express';
import { MerchantShopModel } from '../models/MerchantShop';
import { OrderModel } from '../models/Order';
import { ProductCatalogModel } from '../models/ProductCatalog';
import { ProductModel } from '../models/Product';
import { UserModel, toPublicUser } from '../models/User';
import { CylinderType, ProductCategory, VerificationStatus } from '../types';
import { UserRole } from '../types/user.types';
import { sendError, sendSuccess } from '../utils/apiResponse';

let systemSettings = {
  maintenanceMode: false,
  registrationOpen: true,
  supportEmail: 'support@gaslink.rw',
  maxFeaturedMerchants: 12
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const filters: Record<string, unknown> = {};
    const { role, isActive, search } = req.query;

    if (role) {
      filters.role = String(role);
    }

    if (isActive === 'true') {
      filters.isActive = true;
    }

    if (isActive === 'false') {
      filters.isActive = false;
    }

    if (search) {
      filters.$or = [
        { firstName: { $regex: String(search), $options: 'i' } },
        { lastName: { $regex: String(search), $options: 'i' } },
        { email: { $regex: String(search), $options: 'i' } }
      ];
    }

    const users = await UserModel.find(filters).sort({ createdAt: -1 });

    return sendSuccess(res, 200, 'Users fetched successfully', users.map((user) => toPublicUser(user)));
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Failed to fetch users', 'Server error');
  }
};

export const toggleUserStatus = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return sendError(res, 400, 'isActive must be boolean');
    }

    const user = await UserModel.findByIdAndUpdate(userId, { isActive }, {
      new: true,
      runValidators: true
    });

    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    return sendSuccess(res, 200, `User ${isActive ? 'activated' : 'deactivated'}`, {
      id: user.id,
      email: user.email,
      isActive: user.isActive
    });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Failed to update user status', 'Server error');
  }
};

export const getMerchantVerifications = async (req: Request, res: Response) => {
  try {
    const shops = await MerchantShopModel.find()
      .populate('owner', 'firstName lastName email phone isActive')
      .populate('verifiedBy', 'firstName lastName email')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 200, 'Merchant verifications fetched successfully', shops);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Failed to fetch merchant verifications', 'Server error');
  }
};

export const getProductCatalog = async (req: Request, res: Response) => {
  try {
    const catalog = await ProductCatalogModel.find().sort({
      productName: 1,
      sizeKg: 1
    });

    return sendSuccess(res, 200, 'Gas product catalog fetched successfully', {
      entries: catalog
    });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Failed to fetch gas product catalog', 'Server error');
  }
};

export const createProductCatalogEntry = async (req: Request, res: Response) => {
  try {
    const { productName, cylinderType, sizeKg, isActive } = req.body;

    if (!productName || !sizeKg) {
      return sendError(res, 400, 'productName and sizeKg are required');
    }

    if (!Number.isInteger(Number(sizeKg)) || Number(sizeKg) < 1) {
      return sendError(res, 400, 'Gas cylinder size must be a positive whole number in kilograms');
    }

    const entry = await ProductCatalogModel.create({
      productName: String(productName).trim(),
      cylinderType: cylinderType || CylinderType.STANDARD,
      sizeKg: Number(sizeKg),
      category: ProductCategory.GAS_CYLINDER,
      isActive: isActive ?? true,
      createdBy: (req as any).user?.id,
      updatedBy: (req as any).user?.id
    });

    return sendSuccess(res, 201, 'Gas product catalog entry created successfully', entry);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Failed to create gas product catalog entry', 'Server error');
  }
};

export const updateProductCatalogEntry = async (req: Request, res: Response) => {
  try {
    const entry = await ProductCatalogModel.findById(req.params.catalogId);

    if (!entry) {
      return sendError(res, 404, 'Gas product catalog entry not found');
    }

    if (req.body.productName !== undefined) {
      entry.productName = String(req.body.productName).trim();
    }

    if (req.body.cylinderType !== undefined) {
      entry.cylinderType = req.body.cylinderType;
    }

    if (req.body.sizeKg !== undefined) {
      if (!Number.isInteger(Number(req.body.sizeKg)) || Number(req.body.sizeKg) < 1) {
        return sendError(res, 400, 'Gas cylinder size must be a positive whole number in kilograms');
      }

      entry.sizeKg = Number(req.body.sizeKg);
    }

    if (req.body.isActive !== undefined) {
      entry.isActive = Boolean(req.body.isActive);
    }

    entry.category = ProductCategory.GAS_CYLINDER;
    entry.updatedBy = (req as any).user?.id;

    await entry.save();

    return sendSuccess(res, 200, 'Gas product catalog entry updated successfully', entry);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Failed to update gas product catalog entry', 'Server error');
  }
};

export const deleteProductCatalogEntry = async (req: Request, res: Response) => {
  try {
    const entry = await ProductCatalogModel.findById(req.params.catalogId);

    if (!entry) {
      return sendError(res, 404, 'Gas product catalog entry not found');
    }

    const linkedProducts = await ProductModel.countDocuments({ catalogItem: entry.id });
    if (linkedProducts > 0) {
      entry.isActive = false;
      entry.updatedBy = (req as any).user?.id;
      await entry.save();

      return sendSuccess(
        res,
        200,
        'Gas product catalog entry is in use and was deactivated instead',
        entry
      );
    }

    await entry.deleteOne();

    return sendSuccess(res, 200, 'Gas product catalog entry deleted successfully');
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Failed to delete gas product catalog entry', 'Server error');
  }
};

export const updateMerchantVerification = async (req: Request, res: Response) => {
  try {
    const { shopId } = req.params;
    const { verificationStatus, verificationNotes } = req.body;
    if (!Object.values(VerificationStatus).includes(verificationStatus)) {
      return sendError(res, 400, 'Invalid verification status');
    }

    const shop = await MerchantShopModel.findById(shopId);
    if (!shop) {
      return sendError(res, 404, 'Merchant shop not found');
    }

    shop.verificationStatus = verificationStatus;
    shop.verificationNotes = verificationNotes;
    shop.verifiedAt = new Date();
    shop.verifiedBy = (req as any).user?.id;
    await shop.save();

    return sendSuccess(res, 200, 'Merchant verification updated successfully', shop);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Failed to update merchant verification', 'Server error');
  }
};

export const getPlatformAnalytics = async (req: Request, res: Response) => {
  try {
    const [ordersByStatus, revenueByMonth, productsByCategory] = await Promise.all([
      OrderModel.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 }, total: { $sum: '$totalAmount' } } }
      ]),
      OrderModel.aggregate([
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
        { $group: { _id: '$category', count: { $sum: 1 }, stock: { $sum: '$currentStock' } } }
      ])
    ]);

    return sendSuccess(res, 200, 'Platform analytics fetched successfully', {
      ordersByStatus,
      revenueByMonth,
      productsByCategory
    });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Failed to fetch platform analytics', 'Server error');
  }
};

export const getSystemSettings = async (req: Request, res: Response) => {
  try {
    return sendSuccess(res, 200, 'System settings fetched successfully', systemSettings);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Failed to fetch system settings', 'Server error');
  }
};

export const updateSystemSettings = async (req: Request, res: Response) => {
  try {
    systemSettings = {
      ...systemSettings,
      ...req.body
    };

    return sendSuccess(res, 200, 'System settings updated successfully', systemSettings);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Failed to update system settings', 'Server error');
  }
};

export const getPlatformStats = async (req: Request, res: Response) => {
  try {
    const [totalUsers, totalMerchants, totalClients, totalAdmins, activeMerchants, activeClients, totalOrders, totalProducts, pendingVerifications] = await Promise.all([
      UserModel.countDocuments(),
      UserModel.countDocuments({ role: UserRole.MERCHANT }),
      UserModel.countDocuments({ role: UserRole.CLIENT }),
      UserModel.countDocuments({ role: UserRole.ADMIN }),
      UserModel.countDocuments({ role: UserRole.MERCHANT, isActive: true }),
      UserModel.countDocuments({ role: UserRole.CLIENT, isActive: true }),
      OrderModel.countDocuments(),
      ProductModel.countDocuments(),
      MerchantShopModel.countDocuments({ verificationStatus: VerificationStatus.PENDING })
    ]);

    const stats = {
      totalUsers,
      totalMerchants,
      totalClients,
      totalAdmins,
      activeMerchants,
      activeClients,
      totalOrders,
      totalProducts,
      pendingVerifications
    };

    return sendSuccess(res, 200, 'Platform stats fetched successfully', stats);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Failed to fetch platform stats', 'Server error');
  }
};
