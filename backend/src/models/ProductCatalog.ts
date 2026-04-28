import mongoose, { Schema, Types } from 'mongoose';
import { CylinderType, ProductCategory } from '../types';

export interface ProductCatalogDocument extends mongoose.Document {
  productName: string;
  cylinderType: CylinderType;
  sizeKg: number;
  category: ProductCategory;
  isActive: boolean;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const productCatalogSchema = new Schema<ProductCatalogDocument>(
  {
    productName: {
      type: String,
      required: true,
      trim: true
    },
    cylinderType: {
      type: String,
      enum: Object.values(CylinderType),
      default: CylinderType.STANDARD,
      required: true
    },
    sizeKg: {
      type: Number,
      required: true,
      min: 1
    },
    category: {
      type: String,
      enum: Object.values(ProductCategory),
      default: ProductCategory.GAS_CYLINDER,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

productCatalogSchema.index(
  { productName: 1, cylinderType: 1, sizeKg: 1 },
  { unique: true }
);
productCatalogSchema.index({ isActive: 1, sizeKg: 1 });

export const ProductCatalogModel =
  (mongoose.models.ProductCatalog as mongoose.Model<ProductCatalogDocument> | undefined) ||
  mongoose.model<ProductCatalogDocument>('ProductCatalog', productCatalogSchema);
