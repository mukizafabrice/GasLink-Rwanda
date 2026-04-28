import mongoose, { Schema, Types } from 'mongoose';

export interface ReviewDocument extends mongoose.Document {
  order: Types.ObjectId;
  client: Types.ObjectId;
  merchant: Types.ObjectId;
  product?: Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<ReviewDocument>(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      unique: true
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
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

reviewSchema.index({ merchant: 1, createdAt: -1 });
reviewSchema.index({ product: 1, createdAt: -1 });

export const ReviewModel =
  (mongoose.models.Review as mongoose.Model<ReviewDocument> | undefined) ||
  mongoose.model<ReviewDocument>('Review', reviewSchema);
