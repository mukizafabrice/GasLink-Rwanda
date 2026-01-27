import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clean existing data
  console.log('🧹 Cleaning existing users...');
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('123', 10);

  // 1. Create Admin User
  console.log('👑 Creating admin user...');
  await prisma.user.create({
    data: {
      email: 'admin@gaslink.rw',
      password: hashedPassword,
      firstName: 'System',
      lastName: 'Admin',
      phone: '+250788123456',
      role: UserRole.ADMIN,
      isActive: true,
    },
  });

  // 2. Create Merchant User
  console.log('🏪 Creating merchant user...');
  await prisma.user.create({
    data: {
      email: 'merchant@gaslink.rw',
      password: hashedPassword,
      firstName: 'Jibu',
      lastName: 'Merchant',
      phone: '+250788654321',
      role: UserRole.MERCHANT,
      isActive: true,
    },
  });

  // 3. Create Client User (Replacing CUSTOMER with CLIENT to match your schema)
  console.log('👤 Creating client user...');
  await prisma.user.create({
    data: {
      email: 'customer@example.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Client',
      phone: '+250788333444',
      role: UserRole.CLIENT,
      isActive: true,
    },
  });

  console.log('✅ Database seeding completed successfully with basic users!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });