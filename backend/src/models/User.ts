import mongoose, { Schema, Types } from 'mongoose';
import { UserRole } from '../types/user.types';

export interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  address?: {
    province?: string;
    district?: string;
    sector?: string;
    cell?: string;
    village?: string;
    streetAddress?: string;
  };
  savedMerchants: Types.ObjectId[];
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  address?: UserDocument['address'];
  savedMerchants: string[];
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.CLIENT
    },
    isActive: {
      type: Boolean,
      default: true
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    phoneVerified: {
      type: Boolean,
      default: false
    },
    address: {
      province: String,
      district: String,
      sector: String,
      cell: String,
      village: String,
      streetAddress: String
    },
    savedMerchants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'MerchantShop'
      }
    ],
    lastLoginAt: {
      type: Date
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

userSchema.index({ role: 1 });
userSchema.index({ isActive: 1, role: 1 });
userSchema.index({ 'address.province': 1, 'address.district': 1, 'address.sector': 1 });

export const UserModel =
  (mongoose.models.User as mongoose.Model<UserDocument> | undefined) ||
  mongoose.model<UserDocument>('User', userSchema);

export const toPublicUser = (user: UserDocument): PublicUser => ({
  id: user.id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  phone: user.phone,
  role: user.role,
  isActive: user.isActive,
  emailVerified: user.emailVerified,
  phoneVerified: user.phoneVerified,
  address: user.address,
  savedMerchants: user.savedMerchants?.map((merchantId) => merchantId.toString()) ?? [],
  lastLoginAt: user.lastLoginAt,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});
