import { PrismaClient, UserRole, OrderStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clean existing data (in development only)
  if (process.env.NODE_ENV === 'development') {
    console.log('🧹 Cleaning existing data...');
    await prisma.notification.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.priceHistory.deleteMany();
    await prisma.product.deleteMany();
    await prisma.merchant.deleteMany();
    await prisma.user.deleteMany();
    await prisma.location.deleteMany();
  }

  // Hash password for test users
  const hashedPassword = await bcrypt.hash('Password123!', 10);

  // Create Admin User
  console.log('👑 Creating admin user...');
  const adminUser = await prisma.user.create({
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

  // Create Sample Merchant User (Jibu Gas Dealer)
  console.log('🏪 Creating Jibu Gas merchant...');
  const jibuMerchantUser = await prisma.user.create({
    data: {
      email: 'jibu@gaslink.rw',
      password: hashedPassword,
      firstName: 'Jibu',
      lastName: 'Gas Dealer',
      phone: '+250788654321',
      role: UserRole.MERCHANT,
      isActive: true,
    },
  });

  const jibuMerchant = await prisma.merchant.create({
    data: {
      userId: jibuMerchantUser.id,
      businessName: 'Jibu Gas Remera',
      businessEmail: 'remera@jibugas.com',
      businessPhone: '+250788111222',
      businessLicense: 'JIBU-001-2024',
      description: 'Premium gas supplier in Remera area',
      province: 'Kigali City',
      district: 'Gasabo',
      sector: 'Remera',
      cell: 'Rukiri I',
      village: 'Rukiri I',
      exactLocation: 'KG 123 St, Remera',
      isVerified: true,
      isActive: true,
    },
  });

  // Create Another Merchant (Kgali Gas Dealer)
  console.log('🏪 Creating Kgali Gas merchant...');
  const kgaliMerchantUser = await prisma.user.create({
    data: {
      email: 'kgaligas@gaslink.rw',
      password: hashedPassword,
      firstName: 'Kgali',
      lastName: 'Gas Distributor',
      phone: '+250788777888',
      role: UserRole.MERCHANT,
      isActive: true,
    },
  });

  const kgaliMerchant = await prisma.merchant.create({
    data: {
      userId: kgaliMerchantUser.id,
      businessName: 'Kgali Gas Gikondo',
      businessEmail: 'gikondo@kgaligas.com',
      businessPhone: '+250788333444',
      businessLicense: 'KGALI-001-2024',
      description: 'Reliable gas distributor in Gikondo',
      province: 'Kigali City',
      district: 'Kicukiro',
      sector: 'Gikondo',
      cell: 'Kanserege',
      village: 'Kanserege',
      exactLocation: 'KK 456 St, Gikondo',
      isVerified: true,
      isActive: true,
    },
  });

  // Create Unverified Merchant
  console.log('🏪 Creating unverified merchant...');
  const unverifiedMerchantUser = await prisma.user.create({
    data: {
      email: 'newmerchant@gaslink.rw',
      password: hashedPassword,
      firstName: 'New',
      lastName: 'Merchant',
      phone: '+250788999000',
      role: UserRole.MERCHANT,
      isActive: true,
    },
  });

  const unverifiedMerchant = await prisma.merchant.create({
    data: {
      userId: unverifiedMerchantUser.id,
      businessName: 'New Gas Station',
      businessEmail: 'new@gasstation.rw',
      businessPhone: '+250788999111',
      businessLicense: 'NEW-001-2024',
      description: 'New gas station awaiting verification',
      province: 'Kigali City',
      district: 'Nyarugenge',
      sector: 'Nyakabanda',
      cell: 'Rugenge',
      village: 'Rugenge',
      exactLocation: 'KN 789 St, Nyakabanda',
      isVerified: false,
      isActive: true,
    },
  });

  // Create Sample Customer
  console.log('👤 Creating sample customer...');
  const customerUser = await prisma.user.create({
    data: {
      email: 'customer@example.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Customer',
      phone: '+250788333444',
      role: UserRole.CUSTOMER,
      isActive: true,
    },
  });

  // Create Sample Driver
  console.log('🚚 Creating sample driver...');
  const driverUser = await prisma.user.create({
    data: {
      email: 'driver@example.com',
      password: hashedPassword,
      firstName: 'David',
      lastName: 'Driver',
      phone: '+250788555666',
      role: UserRole.DRIVER,
      isActive: true,
    },
  });

  // Create Products for Jibu Merchant
  console.log('📦 Creating Jibu Gas products...');
  const jibuProducts = [
    { name: 'Jibu Gas 3KG', category: 'Cooking Gas', unit: 'cylinder', price: 14500, stock: 50 },
    { name: 'Jibu Gas 6KG', category: 'Cooking Gas', unit: 'cylinder', price: 24000, stock: 30 },
    { name: 'Jibu Gas 12KG', category: 'Cooking Gas', unit: 'cylinder', price: 44000, stock: 20 },
    { name: 'Jibu Gas 15KG', category: 'Cooking Gas', unit: 'cylinder', price: 54000, stock: 15 },
    { name: 'Gas Regulator', category: 'Accessories', unit: 'piece', price: 5000, stock: 100 },
    { name: 'Gas Pipe (2m)', category: 'Accessories', unit: 'piece', price: 3000, stock: 80 },
  ];

  for (const product of jibuProducts) {
    await prisma.product.create({
      data: {
        merchantId: jibuMerchant.id,
        name: product.name,
        description: `High quality ${product.name}`,
        category: product.category,
        unit: product.unit,
        price: product.price,
        currentStock: product.stock,
        minStockLevel: 10,
        isAvailable: true,
      },
    });
  }

  // Create Products for Kgali Merchant
  console.log('📦 Creating Kgali Gas products...');
  const kgaliProducts = [
    { name: 'Kgali Gas 3KG', category: 'Cooking Gas', unit: 'cylinder', price: 14200, stock: 40 },
    { name: 'Kgali Gas 6KG', category: 'Cooking Gas', unit: 'cylinder', price: 23800, stock: 25 },
    { name: 'Kgali Gas 12KG', category: 'Cooking Gas', unit: 'cylinder', price: 43500, stock: 18 },
    { name: 'Kgali Gas 15KG', category: 'Cooking Gas', unit: 'cylinder', price: 53000, stock: 12 },
    { name: 'Meru Gas 6KG', category: 'Cooking Gas', unit: 'cylinder', price: 25000, stock: 15 },
    { name: 'Rwanda Gas 12KG', category: 'Cooking Gas', unit: 'cylinder', price: 44500, stock: 10 },
    { name: 'Gas Stove (Single)', category: 'Accessories', unit: 'piece', price: 15000, stock: 25 },
    { name: 'Gas Stove (Double)', category: 'Accessories', unit: 'piece', price: 25000, stock: 15 },
  ];

  for (const product of kgaliProducts) {
    await prisma.product.create({
      data: {
        merchantId: kgaliMerchant.id,
        name: product.name,
        description: `Premium ${product.name}`,
        category: product.category,
        unit: product.unit,
        price: product.price,
        currentStock: product.stock,
        minStockLevel: 10,
        isAvailable: true,
      },
    });
  }

  // Get a product for sample order
  const sampleProduct = await prisma.product.findFirst({
    where: { merchantId: jibuMerchant.id, name: 'Jibu Gas 6KG' },
  });

  // Create a sample order
  if (sampleProduct) {
    console.log('📝 Creating sample order...');
    const order = await prisma.order.create({
      data: {
        clientId: customerUser.id,
        merchantId: jibuMerchant.id,
        quantity: 1,
        totalAmount: 24500,
        deliveryFee: 500,
        deliveryAddress: 'KK 456 St, Gikondo, Kigali',
        clientNote: 'Please call before delivery',
        status: OrderStatus.PENDING,
      },
    });

    // Create order item
    await prisma.orderItem.create({
      data: {
        orderId: order.id,
        productId: sampleProduct.id,
        quantity: 1,
        unitPrice: sampleProduct.price,
      },
    });

    // Create notification for merchant
    await prisma.notification.create({
      data: {
        userId: jibuMerchantUser.id,
        type: 'NEW_ORDER',
        title: 'New Order Received',
        message: `You have received a new order #${order.orderNumber}`,
        orderId: order.id,
        isRead: false,
      },
    });
  }

  // Seed Rwanda Locations (sample)
  console.log('🗺️ Creating sample locations...');
  const locations = [
    { name: 'Kigali City', type: 'PROVINCE', code: 'KC' },
    { name: 'Eastern Province', type: 'PROVINCE', code: 'EP' },
    { name: 'Western Province', type: 'PROVINCE', code: 'WP' },
    { name: 'Northern Province', type: 'PROVINCE', code: 'NP' },
    { name: 'Southern Province', type: 'PROVINCE', code: 'SP' },
  ];

  for (const location of locations) {
    await prisma.location.create({
      data: {
        name: location.name,
        type: location.type,
        code: location.code,
      },
    });
  }

  console.log('✅ Database seeding completed successfully!');
  console.log('\n📋 Sample Users Created:');
  console.log('-----------------------');
  console.log(`👑 Admin: admin@gaslink.rw / Password123!`);
  console.log(`🏪 Jibu Gas Merchant: jibu@gaslink.rw / Password123!`);
  console.log(`🏪 Kgali Gas Merchant: kgaligas@gaslink.rw / Password123!`);
  console.log(`🏪 Unverified Merchant: newmerchant@gaslink.rw / Password123!`);
  console.log(`👤 Customer: customer@example.com / Password123!`);
  console.log(`🚚 Driver: driver@example.com / Password123!`);
  console.log('\n🔥 Available Products:');
  console.log('----------------------');
  console.log('• Jibu Gas (3KG, 6KG, 12KG, 15KG)');
  console.log('• Kgali Gas (3KG, 6KG, 12KG, 15KG)');
  console.log('• Meru Gas (6KG)');
  console.log('• Rwanda Gas (12KG)');
  console.log('• Accessories (Regulators, Pipes, Stoves)');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
