import mongoose, { Schema, Types } from 'mongoose';
import { CylinderType, ProductCategory } from '../types';

export interface ProductDocument extends mongoose.Document {
  merchant: Types.ObjectId;
  shop: Types.ObjectId;
  catalogItem: Types.ObjectId;
  productName: string;
  cylinderType: CylinderType;
  sizeKg: number;
  name: string;
  category: ProductCategory;
  unit: string;
  pricePerKg: number;
  price: number;
  currentStock: number;
  minStockLevel: number;
  isAvailable: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<ProductDocument>(
  {
    merchant: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    shop: {
      type: Schema.Types.ObjectId,
      ref: 'MerchantShop',
      required: true
    },
    catalogItem: {
      type: Schema.Types.ObjectId,
      ref: 'ProductCatalog',
      required: true
    },
    productName: {
      type: String,
      required: true,
      trim: true
    },
    cylinderType: {
      type: String,
      enum: Object.values(CylinderType),
      required: true
    },
    sizeKg: {
      type: Number,
      required: true,
      min: 1
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      enum: Object.values(ProductCategory),
      default: ProductCategory.GAS_CYLINDER,
      required: true
    },
    unit: {
      type: String,
      required: true,
      default: 'cylinder',
      trim: true
    },
    pricePerKg: {
      type: Number,
      required: true,
      min: 0
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    currentStock: {
      type: Number,
      required: true,
      min: 0
    },
    minStockLevel: {
      type: Number,
      default: 0,
      min: 0
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    isFeatured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

productSchema.pre('validate', function syncProductName(next) {
  this.name = `${this.productName} ${this.sizeKg} kg`;
  this.price = Number((this.pricePerKg * this.sizeKg).toFixed(2));

  if (this.minStockLevel === undefined || this.minStockLevel === null) {
    this.minStockLevel = 0;
  }

  next();
});

productSchema.index({ merchant: 1, createdAt: -1 });
productSchema.index({ shop: 1, category: 1, isAvailable: 1 });
productSchema.index({ merchant: 1, catalogItem: 1 }, { unique: true });
productSchema.index({ name: 'text', productName: 'text' });

export const ProductModel =
  (mongoose.models.Product as mongoose.Model<ProductDocument> | undefined) ||
  mongoose.model<ProductDocument>('Product', productSchema);
