import mongoose, { Schema, Types } from 'mongoose';
import { NotificationType } from '../types';

export interface NotificationDocument extends mongoose.Document {
  user: Types.ObjectId;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<NotificationDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      default: NotificationType.SYSTEM
    },
    isRead: {
      type: Boolean,
      default: false
    },
    metadata: {
      type: Schema.Types.Mixed
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

export const NotificationModel =
  (mongoose.models.Notification as mongoose.Model<NotificationDocument> | undefined) ||
  mongoose.model<NotificationDocument>('Notification', notificationSchema);
