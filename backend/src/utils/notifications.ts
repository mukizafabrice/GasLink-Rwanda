import { Types } from 'mongoose';
import { NotificationModel } from '../models/Notification';
import { NotificationType } from '../types';

export const createNotification = async (input: {
  user: string | Types.ObjectId;
  title: string;
  message: string;
  type: NotificationType;
  metadata?: Record<string, unknown>;
}) =>
  NotificationModel.create({
    user: input.user,
    title: input.title,
    message: input.message,
    type: input.type,
    metadata: input.metadata
  });
