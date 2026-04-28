import mongoose, { Schema, Types } from 'mongoose';

export interface OrderItemDocument extends mongoose.Document {
  order: Types.ObjectId;
  product: Types.ObjectId;
  merchant: Types.ObjectId;
  client: Types.ObjectId;
  productName: string;
  productCategory: string;
  unit: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<OrderItemDocument>(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    merchant: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    productName: {
      type: String,
      required: true,
      trim: true
    },
    productCategory: {
      type: String,
      required: true
    },
    unit: {
      type: String,
      required: true,
      trim: true
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

orderItemSchema.index({ order: 1 });
orderItemSchema.index({ merchant: 1, createdAt: -1 });
orderItemSchema.index({ client: 1, createdAt: -1 });

export const OrderItemModel =
  (mongoose.models.OrderItem as mongoose.Model<OrderItemDocument> | undefined) ||
  mongoose.model<OrderItemDocument>('OrderItem', orderItemSchema);
