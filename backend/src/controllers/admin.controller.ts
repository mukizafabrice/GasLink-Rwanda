import { Request, Response } from 'express';
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const toggleUserStatus = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ error: 'isActive must be boolean' });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { isActive },
      select: { id: true, email: true, isActive: true }
    });

    return res.status(200).json({ 
      success: true, 
      message: `User ${isActive ? 'activated' : 'deactivated'}`,
      data: user 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const getPlatformStats = async (req: Request, res: Response) => {
  try {
    const [totalUsers, totalMerchants, totalClients, totalAdmins] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: UserRole.MERCHANT } }),
      prisma.user.count({ where: { role: UserRole.CLIENT } }),
      prisma.user.count({ where: { role: UserRole.ADMIN } })
    ]);

    const stats = {
      totalUsers,
      totalMerchants,
      totalClients,
      totalAdmins,
      activeMerchants: 0, // Will update when we have MerchantShop model
      activeClients: totalClients // Placeholder
    };

    return res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};