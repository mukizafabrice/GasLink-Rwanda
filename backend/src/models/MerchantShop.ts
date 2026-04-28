import mongoose, { Schema, Types } from 'mongoose';
import { VerificationStatus } from '../types';

export interface MerchantShopDocument extends mongoose.Document {
  owner: Types.ObjectId;
  shopName: string;
  slug: string;
  description?: string;
  businessEmail?: string;
  businessPhone: string;
  businessLicense?: string;
  address: {
    province: string;
    district: string;
    sector: string;
    cell?: string;
    village?: string;
    streetAddress?: string;
  };
  coordinates?: {
    latitude?: number;
    longitude?: number;
  };
  verificationStatus: VerificationStatus;
  verificationNotes?: string;
  verifiedAt?: Date;
  verifiedBy?: Types.ObjectId;
  isOpen: boolean;
  isFeatured: boolean;
  deliveryFee: number;
  minimumOrderAmount: number;
  averageRating: number;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const merchantShopSchema = new Schema<MerchantShopDocument>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    shopName: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    businessEmail: {
      type: String,
      trim: true,
      lowercase: true
    },
    businessPhone: {
      type: String,
      required: true,
      trim: true
    },
    businessLicense: {
      type: String,
      trim: true
    },
    address: {
      province: { type: String, required: true, trim: true },
      district: { type: String, required: true, trim: true },
      sector: { type: String, required: true, trim: true },
      cell: { type: String, trim: true },
      village: { type: String, trim: true },
      streetAddress: { type: String, trim: true }
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    verificationStatus: {
      type: String,
      enum: Object.values(VerificationStatus),
      default: VerificationStatus.PENDING
    },
    verificationNotes: {
      type: String,
      trim: true
    },
    verifiedAt: Date,
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    isOpen: {
      type: Boolean,
      default: true
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    deliveryFee: {
      type: Number,
      default: 0,
      min: 0
    },
    minimumOrderAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

merchantShopSchema.pre('validate', function setSlug(next) {
  if (!this.slug && this.shopName) {
    this.slug = slugify(this.shopName);
  } else if (this.shopName) {
    this.slug = slugify(this.slug || this.shopName);
  }
  next();
});

merchantShopSchema.index({ verificationStatus: 1, isOpen: 1 });
merchantShopSchema.index({ 'address.province': 1, 'address.district': 1, 'address.sector': 1 });
merchantShopSchema.index({ shopName: 'text', description: 'text', 'address.district': 'text', 'address.sector': 'text' });

export const MerchantShopModel =
  (mongoose.models.MerchantShop as mongoose.Model<MerchantShopDocument> | undefined) ||
  mongoose.model<MerchantShopDocument>('MerchantShop', merchantShopSchema);
