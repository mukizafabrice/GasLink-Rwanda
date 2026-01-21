import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'gaslink-secret-key';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, phone, role = UserRole.CLIENT } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, firstName, lastName, phone, role }
    });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);

    const { password: _, ...userWithoutPassword } = user;
    
    return res.status(201).json({ 
      success: true, 
      message: 'User registered', 
      data: { token, user: userWithoutPassword } 
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    if (!user.isActive) return res.status(401).json({ error: 'Account deactivated' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);

    const { password: _, ...userWithoutPassword } = user;
    
    return res.status(200).json({ 
      success: true, 
      message: 'Login successful', 
      data: { token, user: userWithoutPassword } 
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await prisma.user.findUnique({ 
      where: { id: userId },
      select: { id: true, email: true, firstName: true, lastName: true, phone: true, role: true, isActive: true }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    return res.status(200).json({ success: true, data: user });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const logout = (req: Request, res: Response) => {
  return res.status(200).json({ success: true, message: 'Logged out' });
};