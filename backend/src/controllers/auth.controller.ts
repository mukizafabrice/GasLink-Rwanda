import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { MerchantShopModel } from '../models/MerchantShop';
import { NotificationModel } from '../models/Notification';
import { UserModel, toPublicUser } from '../models/User';
import { UserRole } from '../types/user.types';
import { buildAuthPayload, normalizeEmail } from '../utils/auth';
import { sendError, sendSuccess } from '../utils/apiResponse';

const normalizeRole = (role: unknown): UserRole => {
  if (role === 'CUSTOMER') {
    return UserRole.CLIENT;
  }

  return Object.values(UserRole).includes(role as UserRole)
    ? (role as UserRole)
    : UserRole.CLIENT;
};

export const register = async (req: Request, res: Response) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      businessName,
      businessEmail,
      businessPhone,
      businessLicense,
      description,
      province,
      district,
      sector,
      cell,
      village,
      streetAddress
    } = req.body;
    const role = normalizeRole(req.body.role);

    if (!email || !password || !firstName || !lastName) {
      return sendError(res, 400, 'Missing required fields', 'email, password, firstName, and lastName are required');
    }

    if (role === UserRole.MERCHANT) {
      if (!businessName || !businessPhone || !province || !district || !sector) {
        return sendError(
          res,
          400,
          'Missing merchant onboarding fields',
          'businessName, businessPhone, province, district, and sector are required'
        );
      }
    }

    const normalizedEmail = normalizeEmail(email);
    const existingUser = await UserModel.findOne({ email: normalizedEmail });

    if (existingUser) {
      return sendError(res, 400, 'User already exists', 'An account with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      email: normalizedEmail,
      password: hashedPassword,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone,
      role,
      address: province
        ? {
            province,
            district,
            sector,
            cell,
            village,
            streetAddress
          }
        : undefined
    });

    if (role === UserRole.MERCHANT) {
      await MerchantShopModel.create({
        owner: user.id,
        shopName: businessName,
        description,
        businessEmail: businessEmail || normalizedEmail,
        businessPhone,
        businessLicense,
        address: {
          province,
          district,
          sector,
          cell,
          village,
          streetAddress
        }
      });
    }

    return sendSuccess(res, 201, 'User registered successfully', buildAuthPayload(user));

  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Failed to register user', 'Server error');
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, 'Email and password are required');
    }

    const user = await UserModel.findOne({ email: normalizeEmail(email) });

    if (!user) return sendError(res, 401, 'Invalid credentials');
    if (!user.isActive) return sendError(res, 401, 'Account deactivated');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return sendError(res, 401, 'Invalid credentials');

    user.lastLoginAt = new Date();
    await user.save();

    return sendSuccess(res, 200, 'Login successful', buildAuthPayload(user));

  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Failed to login', 'Server error');
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return sendError(res, 401, 'Unauthorized');

    const user = await UserModel.findById(userId);

    if (!user) return sendError(res, 404, 'User not found');

    const payload: Record<string, unknown> = {
      ...toPublicUser(user)
    };

    if (user.role === UserRole.MERCHANT) {
      payload.shop = await MerchantShopModel.findOne({ owner: user.id });
    }

    return sendSuccess(res, 200, 'Profile fetched successfully', payload);

  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Failed to fetch profile', 'Server error');
  }
};

export const logout = (req: Request, res: Response) => {
  return sendSuccess(res, 200, 'Logged out successfully');
};

export const getMyNotifications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return sendError(res, 401, 'Unauthorized');
    }

    const notifications = await NotificationModel.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(20);

    return sendSuccess(res, 200, 'Notifications fetched successfully', notifications);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Failed to fetch notifications', 'Server error');
  }
};
