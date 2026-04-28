import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { OrderModel } from '../models/Order';
import { MerchantShopModel } from '../models/MerchantShop';
import { sendError, sendSuccess } from '../utils/apiResponse';
import { UserRole } from '../types/user.types';
import { VerificationStatus } from '../types';

export const getPublicPlatformStats = async (req: Request, res: Response) => {
  try {
    const [activeMerchants, totalClients, totalOrders, verifiedMerchants, totalMerchants] = await Promise.all([
      UserModel.countDocuments({ role: UserRole.MERCHANT, isActive: true }),
      UserModel.countDocuments({ role: UserRole.CLIENT }),
      OrderModel.countDocuments(),
      MerchantShopModel.countDocuments({ verificationStatus: VerificationStatus.APPROVED }),
      MerchantShopModel.countDocuments()
    ]);

    const securePlatformScore = totalMerchants > 0
      ? Math.round((verifiedMerchants / totalMerchants) * 100)
      : 100;

    return sendSuccess(res, 200, 'Public platform stats fetched successfully', {
      activeMerchants,
      totalClients,
      totalOrders,
      securePlatformScore
    });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Failed to fetch public platform stats', 'Server error');
  }
};
