import mongoose, { Schema, Types } from 'mongoose';
import { OrderStatus, PaymentStatus } from '../types';

export interface OrderDocument extends mongoose.Document {
  orderNumber: string;
  client: Types.ObjectId;
  merchant: Types.ObjectId;
  shop: Types.ObjectId;
  items: Types.ObjectId[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  deliveryAddress: {
    province: string;
    district: string;
    sector: string;
    cell?: string;
    village?: string;
    streetAddress?: string;
  };
  clientNote?: string;
  merchantNote?: string;
  stockCommitted: boolean;
  statusHistory: Array<{
    status: OrderStatus;
    changedAt: Date;
    changedBy: Types.ObjectId;
    note?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<OrderDocument>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
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
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: 'OrderItem',
        required: true
      }
    ],
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    deliveryFee: {
      type: Number,
      default: 0,
      min: 0
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    deliveryAddress: {
      province: { type: String, required: true, trim: true },
      district: { type: String, required: true, trim: true },
      sector: { type: String, required: true, trim: true },
      cell: { type: String, trim: true },
      village: { type: String, trim: true },
      streetAddress: { type: String, trim: true }
    },
    clientNote: {
      type: String,
      trim: true
    },
    merchantNote: {
      type: String,
      trim: true
    },
    stockCommitted: {
      type: Boolean,
      default: false
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: Object.values(OrderStatus),
          required: true
        },
        changedAt: {
          type: Date,
          default: Date.now
        },
        changedBy: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        note: {
          type: String,
          trim: true
        }
      }
    ]
  },
  {
    timestamps: true,
    versionKey: false
  }
);

orderSchema.index({ client: 1, createdAt: -1 });
orderSchema.index({ merchant: 1, status: 1, createdAt: -1 });
orderSchema.index({ shop: 1, status: 1, createdAt: -1 });

export const OrderModel =
  (mongoose.models.Order as mongoose.Model<OrderDocument> | undefined) ||
  mongoose.model<OrderDocument>('Order', orderSchema);
