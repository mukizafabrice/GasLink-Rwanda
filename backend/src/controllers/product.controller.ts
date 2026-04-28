import { Response } from 'express';
import { NotificationModel } from '../models/Notification';
import { ProductCatalogModel } from '../models/ProductCatalog';
import { MerchantShopModel } from '../models/MerchantShop';
import { ProductDocument, ProductModel } from '../models/Product';
import { AuthRequest } from '../middlewares/auth.middleware';
import { NotificationType, ProductCategory, StockMovementType } from '../types';
import { UserRole } from '../types/user.types';
import { sendError, sendSuccess } from '../utils/apiResponse';

const parseStockQuantity = (value: unknown) => {
  const stockQuantity = Number(value ?? 0);

  if (!Number.isInteger(stockQuantity) || stockQuantity < 0) {
    return null;
  }

  return stockQuantity;
};

const parseMovementQuantity = (value: unknown) => {
  const quantity = Number(value);

  if (!Number.isInteger(quantity) || quantity < 1) {
    return null;
  }

  return quantity;
};

const syncAvailability = (product: ProductDocument, explicitAvailability?: boolean) => {
  if (explicitAvailability !== undefined) {
    product.isAvailable = explicitAvailability;
    return;
  }

  if (product.currentStock <= 0) {
    product.isAvailable = false;
    return;
  }

  product.isAvailable = true;
};

const createStockAlertIfNeeded = async (
  merchantId: string,
  product: ProductDocument
) => {
  if (product.currentStock === 0) {
    await NotificationModel.create({
      user: merchantId,
      title: 'Product out of stock',
      message: `${product.productName} ${product.sizeKg} kg is now out of stock in your shop.`,
      type: NotificationType.SYSTEM,
      metadata: {
        productId: product.id,
        stock: product.currentStock,
        stockStatus: 'OUT_OF_STOCK'
      }
    });
    return;
  }

  if (product.minStockLevel > 0 && product.currentStock <= product.minStockLevel) {
    await NotificationModel.create({
      user: merchantId,
      title: 'Low stock alert',
      message: `${product.productName} ${product.sizeKg} kg is running low with ${product.currentStock} cylinders left.`,
      type: NotificationType.SYSTEM,
      metadata: {
        productId: product.id,
        stock: product.currentStock,
        minStockLevel: product.minStockLevel,
        stockStatus: 'LOW_STOCK'
      }
    });
  }
};

const buildProductFilters = (req: AuthRequest) => {
  const filters: Record<string, unknown> = {
    category: ProductCategory.GAS_CYLINDER,
    catalogItem: { $exists: true }
  };

  if (req.query.search) {
    filters.$text = { $search: String(req.query.search) };
  }

  if (req.query.shopId) {
    filters.shop = String(req.query.shopId);
  }

  if (req.query.merchantId) {
    filters.merchant = String(req.query.merchantId);
  }

  if (req.query.available === 'true') {
    filters.isAvailable = true;
  }

  return filters;
};

export const listProductCatalog = async (req: AuthRequest, res: Response) => {
  try {
    const filters: Record<string, unknown> = {};

    if (req.query.activeOnly !== 'false') {
      filters.isActive = true;
    }

    const catalog = await ProductCatalogModel.find(filters).sort({
      productName: 1,
      sizeKg: 1
    });

    return sendSuccess(res, 200, 'Gas product catalog fetched successfully', catalog);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Failed to fetch gas product catalog', 'Server error');
  }
};

export const listProducts = async (req: AuthRequest, res: Response) => {
  try {
    const filters = buildProductFilters(req);
    const products = await ProductModel.find(filters)
      .populate('catalogItem')
      .populate('shop', 'shopName slug')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 200, 'Products fetched successfully', products);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Failed to fetch products', 'Server error');
  }
};

export const getProductById = async (req: AuthRequest, res: Response) => {
  try {
    const product = await ProductModel.findById(req.params.productId)
      .populate('catalogItem')
      .populate('shop', 'shopName slug');

    if (!product) {
      return sendError(res, 404, 'Product not found');
    }

    return sendSuccess(res, 200, 'Product fetched successfully', product);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Failed to fetch product', 'Server error');
  }
};

export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId || !userRole) {
      return sendError(res, 401, 'Unauthorized');
    }

    const merchantId = userRole === UserRole.ADMIN && req.body.merchantId ? req.body.merchantId : userId;
    const shop = await MerchantShopModel.findOne({ owner: merchantId });

    if (!shop) {
      return sendError(res, 404, 'Merchant shop not found');
    }

    const { catalogItemId, pricePerKg } = req.body;
    if (!catalogItemId || pricePerKg === undefined) {
      return sendError(res, 400, 'catalogItemId and pricePerKg are required');
    }

    const catalogItem = await ProductCatalogModel.findById(catalogItemId);
    if (!catalogItem || !catalogItem.isActive) {
      return sendError(res, 400, 'Selected gas product option is unavailable');
    }

    const stockQuantity = parseStockQuantity(req.body.stockQuantity);
    if (stockQuantity === null) {
      return sendError(res, 400, 'stockQuantity must be a whole number of cylinders');
    }

    const existingProduct = await ProductModel.findOne({
      merchant: merchantId,
      catalogItem: catalogItem.id
    });

    if (existingProduct) {
      existingProduct.pricePerKg = Number(pricePerKg);
      existingProduct.currentStock += stockQuantity;
      syncAvailability(
        existingProduct,
        req.body.isAvailable !== undefined ? Boolean(req.body.isAvailable) : undefined
      );

      await existingProduct.save();

      const populatedProduct = await ProductModel.findById(existingProduct.id).populate('catalogItem');

      return sendSuccess(
        res,
        200,
        stockQuantity > 0
          ? 'Gas inventory restocked successfully'
          : 'Gas product price updated successfully',
        populatedProduct
      );
    }

    if (stockQuantity < 1) {
      return sendError(res, 400, 'stockQuantity must be at least 1 cylinder for a new inventory item');
    }

    const product = await ProductModel.create({
      merchant: merchantId,
      shop: shop.id,
      catalogItem: catalogItem.id,
      productName: catalogItem.productName,
      cylinderType: catalogItem.cylinderType,
      sizeKg: catalogItem.sizeKg,
      category: catalogItem.category,
      unit: 'cylinder',
      pricePerKg,
      currentStock: userRole === UserRole.ADMIN
        ? Number(req.body.currentStock ?? stockQuantity)
        : stockQuantity,
      minStockLevel: userRole === UserRole.ADMIN ? Number(req.body.minStockLevel ?? 0) : 0,
      isAvailable: req.body.isAvailable ?? true,
      isFeatured: req.body.isFeatured ?? false
    });

    const populatedProduct = await ProductModel.findById(product.id).populate('catalogItem');

    return sendSuccess(res, 201, 'Gas product created successfully', populatedProduct);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Failed to create product', 'Server error');
  }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await ProductModel.findById(req.params.productId);
    if (!product) {
      return sendError(res, 404, 'Product not found');
    }

    if (req.user?.role !== UserRole.ADMIN && product.merchant.toString() !== req.user?.id) {
      return sendError(res, 403, 'Forbidden');
    }

    if (req.body.catalogItemId) {
      const catalogItem = await ProductCatalogModel.findById(req.body.catalogItemId);

      if (!catalogItem || !catalogItem.isActive) {
        return sendError(res, 400, 'Selected gas product option is unavailable');
      }

      const duplicateProduct = await ProductModel.findOne({
        merchant: product.merchant,
        catalogItem: catalogItem.id,
        _id: { $ne: product.id }
      });

      if (duplicateProduct) {
        return sendError(res, 400, 'This gas cylinder option already exists in your inventory');
      }

      product.catalogItem = catalogItem._id;
      product.productName = catalogItem.productName;
      product.cylinderType = catalogItem.cylinderType;
      product.sizeKg = catalogItem.sizeKg;
      product.category = catalogItem.category;
    }

    if (req.body.pricePerKg !== undefined) {
      product.pricePerKg = Number(req.body.pricePerKg);
    }

    if (req.body.stockQuantity !== undefined) {
      const stockQuantity = parseStockQuantity(req.body.stockQuantity);

      if (stockQuantity === null) {
        return sendError(res, 400, 'stockQuantity must be a whole number of cylinders');
      }

      product.currentStock += stockQuantity;
    }

    if (req.body.isAvailable !== undefined) {
      product.isAvailable = Boolean(req.body.isAvailable);
    } else {
      syncAvailability(product);
    }

    if (req.user?.role === UserRole.ADMIN) {
      if (req.body.currentStock !== undefined) {
        product.currentStock = Number(req.body.currentStock);
      }

      if (req.body.minStockLevel !== undefined) {
        product.minStockLevel = Number(req.body.minStockLevel);
      }
    }

    await product.save();

    const populatedProduct = await ProductModel.findById(product.id).populate('catalogItem');

    return sendSuccess(res, 200, 'Gas product updated successfully', populatedProduct);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Failed to update product', 'Server error');
  }
};

export const adjustProductStock = async (req: AuthRequest, res: Response) => {
  try {
    const product = await ProductModel.findById(req.params.productId);
    if (!product) {
      return sendError(res, 404, 'Product not found');
    }

    if (req.user?.role !== UserRole.ADMIN && product.merchant.toString() !== req.user?.id) {
      return sendError(res, 403, 'Forbidden');
    }

    const movementType = req.body.movementType as StockMovementType;
    if (!Object.values(StockMovementType).includes(movementType)) {
      return sendError(res, 400, 'movementType must be STOCK_IN or STOCK_OUT');
    }

    const quantity = parseMovementQuantity(req.body.quantity);
    if (quantity === null) {
      return sendError(res, 400, 'quantity must be a whole number of cylinders greater than 0');
    }

    if (req.body.pricePerKg !== undefined) {
      product.pricePerKg = Number(req.body.pricePerKg);
    }

    if (movementType === StockMovementType.STOCK_OUT) {
      if (product.currentStock < quantity) {
        return sendError(res, 400, `Only ${product.currentStock} cylinders are currently in stock`);
      }

      product.currentStock -= quantity;
    } else {
      product.currentStock += quantity;
    }

    syncAvailability(
      product,
      req.body.isAvailable !== undefined ? Boolean(req.body.isAvailable) : undefined
    );

    await product.save();

    if (req.user?.id) {
      await createStockAlertIfNeeded(req.user.id, product);
    }

    const populatedProduct = await ProductModel.findById(product.id).populate('catalogItem');

    return sendSuccess(
      res,
      200,
      movementType === StockMovementType.STOCK_OUT
        ? 'Gas stock-out recorded successfully'
        : 'Gas inventory restocked successfully',
      populatedProduct
    );
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Failed to adjust product stock', 'Server error');
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await ProductModel.findById(req.params.productId);
    if (!product) {
      return sendError(res, 404, 'Product not found');
    }

    if (req.user?.role !== UserRole.ADMIN && product.merchant.toString() !== req.user?.id) {
      return sendError(res, 403, 'Forbidden');
    }

    await product.deleteOne();

    return sendSuccess(res, 200, 'Product deleted successfully');
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Failed to delete product', 'Server error');
  }
};
