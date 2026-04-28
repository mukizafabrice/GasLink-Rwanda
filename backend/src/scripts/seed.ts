import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { connectToDatabase, disconnectFromDatabase } from '../config/database';
import { MerchantShopModel } from '../models/MerchantShop';
import { NotificationModel } from '../models/Notification';
import { OrderItemModel } from '../models/OrderItem';
import { OrderModel } from '../models/Order';
import { ProductCatalogModel } from '../models/ProductCatalog';
import { ProductModel } from '../models/Product';
import { ReviewModel } from '../models/Review';
import { UserModel } from '../models/User';
import {
  CylinderType,
  NotificationType,
  OrderStatus,
  PaymentStatus,
  ProductCategory,
  VerificationStatus
} from '../types';
import { UserRole } from '../types/user.types';

dotenv.config();

type SeedUser = {
  key: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  address: {
    province: string;
    district: string;
    sector: string;
    cell?: string;
    village?: string;
    streetAddress?: string;
  };
};

type SeedShop = {
  key: string;
  ownerKey: string;
  shopName: string;
  description: string;
  businessEmail: string;
  businessPhone: string;
  businessLicense: string;
  verificationStatus: VerificationStatus;
  verificationNotes?: string;
  address: {
    province: string;
    district: string;
    sector: string;
    cell?: string;
    village?: string;
    streetAddress?: string;
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  deliveryFee: number;
  minimumOrderAmount: number;
  averageRating: number;
  totalReviews: number;
  isFeatured: boolean;
};

type SeedProduct = {
  key: string;
  catalogKey: string;
  shopKey: string;
  merchantKey: string;
  pricePerKg: number;
  currentStock: number;
  minStockLevel: number;
  isAvailable: boolean;
  isFeatured: boolean;
};

type SeedCatalog = {
  key: string;
  productName: string;
  cylinderType: CylinderType;
  sizeKg: number;
  isActive: boolean;
};

const usersSeed: SeedUser[] = [
  {
    key: 'admin',
    email: 'admin@gaslink.rw',
    password: 'Admin123!',
    firstName: 'System',
    lastName: 'Admin',
    phone: '+250788123456',
    role: UserRole.ADMIN,
    address: {
      province: 'Kigali City',
      district: 'Nyarugenge',
      sector: 'Kigali'
    }
  },
  {
    key: 'merchant_jibu',
    email: 'merchant@example.com',
    password: 'Merchant123!',
    firstName: 'Jibu',
    lastName: 'Merchant',
    phone: '+250788654321',
    role: UserRole.MERCHANT,
    address: {
      province: 'Kigali City',
      district: 'Gasabo',
      sector: 'Kimironko',
      cell: 'Bibare',
      village: 'Kibagabaga'
    }
  },
  {
    key: 'merchant_flame',
    email: 'merchant2@gaslink.rw',
    password: 'Merchant123!',
    firstName: 'Aline',
    lastName: 'Mukamana',
    phone: '+250788654322',
    role: UserRole.MERCHANT,
    address: {
      province: 'Kigali City',
      district: 'Kicukiro',
      sector: 'Kagarama',
      cell: 'Rukatsa',
      village: 'Nyanza'
    }
  },
  {
    key: 'merchant_hills',
    email: 'merchant3@gaslink.rw',
    password: 'Merchant123!',
    firstName: 'Eric',
    lastName: 'Habimana',
    phone: '+250788654323',
    role: UserRole.MERCHANT,
    address: {
      province: 'Northern Province',
      district: 'Musanze',
      sector: 'Muhoza',
      cell: 'Kigombe',
      village: 'Cyuve'
    }
  },
  {
    key: 'client_john',
    email: 'client@example.com',
    password: 'Client123!',
    firstName: 'John',
    lastName: 'Client',
    phone: '+250788333444',
    role: UserRole.CLIENT,
    address: {
      province: 'Kigali City',
      district: 'Gasabo',
      sector: 'Remera',
      cell: 'Rukiri',
      village: 'Nyabisindu'
    }
  },
  {
    key: 'client_sarah',
    email: 'sarah@gaslink.rw',
    password: 'Client123!',
    firstName: 'Sarah',
    lastName: 'Uwase',
    phone: '+250788333445',
    role: UserRole.CLIENT,
    address: {
      province: 'Kigali City',
      district: 'Kicukiro',
      sector: 'Niboye',
      cell: 'Nyakabanda',
      village: 'Busanza'
    }
  },
  {
    key: 'client_david',
    email: 'david@gaslink.rw',
    password: 'Client123!',
    firstName: 'David',
    lastName: 'Ndayisaba',
    phone: '+250788333446',
    role: UserRole.CLIENT,
    address: {
      province: 'Southern Province',
      district: 'Huye',
      sector: 'Ngoma',
      cell: 'Matyazo',
      village: 'Butare'
    }
  }
];

const shopSeed: SeedShop[] = [
  {
    key: 'shop_jibu',
    ownerKey: 'merchant_jibu',
    shopName: 'Jibu Merchant Gas',
    description: 'Trusted LPG supplier for Kigali households and small businesses.',
    businessEmail: 'merchant@example.com',
    businessPhone: '+250788654321',
    businessLicense: 'RDB-GLR-2026-001',
    verificationStatus: VerificationStatus.APPROVED,
    address: {
      province: 'Kigali City',
      district: 'Gasabo',
      sector: 'Kimironko',
      cell: 'Bibare',
      village: 'Kibagabaga',
      streetAddress: 'KG 11 Ave'
    },
    coordinates: {
      latitude: -1.9441,
      longitude: 30.1088
    },
    deliveryFee: 1500,
    minimumOrderAmount: 5000,
    averageRating: 4.8,
    totalReviews: 12,
    isFeatured: true
  },
  {
    key: 'shop_flame',
    ownerKey: 'merchant_flame',
    shopName: 'FlamePoint Energy',
    description: 'Fast citywide cylinder refill service with same-day dispatch.',
    businessEmail: 'merchant2@gaslink.rw',
    businessPhone: '+250788654322',
    businessLicense: 'RDB-GLR-2026-002',
    verificationStatus: VerificationStatus.APPROVED,
    address: {
      province: 'Kigali City',
      district: 'Kicukiro',
      sector: 'Kagarama',
      cell: 'Rukatsa',
      village: 'Nyanza',
      streetAddress: 'KN 5 Road'
    },
    coordinates: {
      latitude: -1.9842,
      longitude: 30.0914
    },
    deliveryFee: 1200,
    minimumOrderAmount: 6000,
    averageRating: 4.5,
    totalReviews: 7,
    isFeatured: true
  },
  {
    key: 'shop_hills',
    ownerKey: 'merchant_hills',
    shopName: 'Hillside Gas Musanze',
    description: 'Growing LPG shop serving Musanze town and nearby homes.',
    businessEmail: 'merchant3@gaslink.rw',
    businessPhone: '+250788654323',
    businessLicense: 'RDB-GLR-2026-003',
    verificationStatus: VerificationStatus.PENDING,
    verificationNotes: 'Awaiting site inspection confirmation.',
    address: {
      province: 'Northern Province',
      district: 'Musanze',
      sector: 'Muhoza',
      cell: 'Kigombe',
      village: 'Cyuve',
      streetAddress: 'RN4 Main Street'
    },
    coordinates: {
      latitude: -1.4996,
      longitude: 29.6349
    },
    deliveryFee: 1800,
    minimumOrderAmount: 7000,
    averageRating: 0,
    totalReviews: 0,
    isFeatured: false
  }
];

const productSeed: SeedProduct[] = [
  {
    key: 'jibu_kigali_3kg',
    catalogKey: 'catalog_kigali_3kg',
    shopKey: 'shop_jibu',
    merchantKey: 'merchant_jibu',
    pricePerKg: 2000,
    currentStock: 20,
    minStockLevel: 5,
    isAvailable: true,
    isFeatured: true
  },
  {
    key: 'jibu_kigali_6kg',
    catalogKey: 'catalog_kigali_6kg',
    shopKey: 'shop_jibu',
    merchantKey: 'merchant_jibu',
    pricePerKg: 1950,
    currentStock: 18,
    minStockLevel: 5,
    isAvailable: true,
    isFeatured: true
  },
  {
    key: 'jibu_kigali_12kg',
    catalogKey: 'catalog_kigali_12kg',
    shopKey: 'shop_jibu',
    merchantKey: 'merchant_jibu',
    pricePerKg: 1900,
    currentStock: 12,
    minStockLevel: 4,
    isAvailable: true,
    isFeatured: true
  },
  {
    key: 'jibu_kigali_15kg',
    catalogKey: 'catalog_kigali_15kg',
    shopKey: 'shop_jibu',
    merchantKey: 'merchant_jibu',
    pricePerKg: 1880,
    currentStock: 9,
    minStockLevel: 3,
    isAvailable: true,
    isFeatured: false
  },
  {
    key: 'flame_meru_3kg',
    catalogKey: 'catalog_meru_3kg',
    shopKey: 'shop_flame',
    merchantKey: 'merchant_flame',
    pricePerKg: 1800,
    currentStock: 14,
    minStockLevel: 3,
    isAvailable: true,
    isFeatured: true
  },
  {
    key: 'flame_meru_6kg',
    catalogKey: 'catalog_meru_6kg',
    shopKey: 'shop_flame',
    merchantKey: 'merchant_flame',
    pricePerKg: 1800,
    currentStock: 18,
    minStockLevel: 5,
    isAvailable: true,
    isFeatured: true
  },
  {
    key: 'flame_meru_12kg',
    catalogKey: 'catalog_meru_12kg',
    shopKey: 'shop_flame',
    merchantKey: 'merchant_flame',
    pricePerKg: 1750,
    currentStock: 10,
    minStockLevel: 4,
    isAvailable: true,
    isFeatured: false
  },
  {
    key: 'hills_kigali_15kg',
    catalogKey: 'catalog_kigali_15kg',
    shopKey: 'shop_hills',
    merchantKey: 'merchant_hills',
    pricePerKg: 1920,
    currentStock: 7,
    minStockLevel: 2,
    isAvailable: true,
    isFeatured: false
  }
];

const catalogSeed: SeedCatalog[] = [
  {
    key: 'catalog_kigali_3kg',
    productName: 'Kigali Gas',
    cylinderType: CylinderType.STANDARD,
    sizeKg: 3,
    isActive: true
  },
  {
    key: 'catalog_kigali_6kg',
    productName: 'Kigali Gas',
    cylinderType: CylinderType.STANDARD,
    sizeKg: 6,
    isActive: true
  },
  {
    key: 'catalog_kigali_12kg',
    productName: 'Kigali Gas',
    cylinderType: CylinderType.STANDARD,
    sizeKg: 12,
    isActive: true
  },
  {
    key: 'catalog_kigali_15kg',
    productName: 'Kigali Gas',
    cylinderType: CylinderType.STANDARD,
    sizeKg: 15,
    isActive: true
  },
  {
    key: 'catalog_meru_3kg',
    productName: 'Meru Gas',
    cylinderType: CylinderType.STANDARD,
    sizeKg: 3,
    isActive: true
  },
  {
    key: 'catalog_meru_6kg',
    productName: 'Meru Gas',
    cylinderType: CylinderType.STANDARD,
    sizeKg: 6,
    isActive: true
  },
  {
    key: 'catalog_meru_12kg',
    productName: 'Meru Gas',
    cylinderType: CylinderType.STANDARD,
    sizeKg: 12,
    isActive: true
  }
];

const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

async function main() {
  console.log('Seeding GasLink Rwanda MongoDB data...');

  await connectToDatabase();

  await Promise.all([
    NotificationModel.deleteMany({}),
    ReviewModel.deleteMany({}),
    OrderItemModel.deleteMany({}),
    OrderModel.deleteMany({}),
    ProductModel.deleteMany({}),
    ProductCatalogModel.deleteMany({}),
    MerchantShopModel.deleteMany({}),
    UserModel.deleteMany({})
  ]);

  const insertedUsers = await Promise.all(
    usersSeed.map(async (user) =>
      UserModel.create({
        email: user.email,
        password: await hashPassword(user.password),
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        isActive: true,
        emailVerified: true,
        phoneVerified: true,
        address: user.address,
        lastLoginAt: daysAgo(Math.floor(Math.random() * 4))
      })
    )
  );

  const userMap = new Map(usersSeed.map((user, index) => [user.key, insertedUsers[index]]));
  const adminUser = userMap.get('admin');

  if (!adminUser) {
    throw new Error('Admin user was not created');
  }

  const insertedShops = await Promise.all(
    shopSeed.map((shop) =>
      MerchantShopModel.create({
        owner: userMap.get(shop.ownerKey)?.id,
        shopName: shop.shopName,
        description: shop.description,
        businessEmail: shop.businessEmail,
        businessPhone: shop.businessPhone,
        businessLicense: shop.businessLicense,
        verificationStatus: shop.verificationStatus,
        verificationNotes: shop.verificationNotes,
        verifiedAt: shop.verificationStatus === VerificationStatus.APPROVED ? daysAgo(10) : undefined,
        verifiedBy: shop.verificationStatus === VerificationStatus.APPROVED ? adminUser.id : undefined,
        address: shop.address,
        coordinates: shop.coordinates,
        deliveryFee: shop.deliveryFee,
        minimumOrderAmount: shop.minimumOrderAmount,
        averageRating: shop.averageRating,
        totalReviews: shop.totalReviews,
        isFeatured: shop.isFeatured,
        isOpen: true
      })
    )
  );

  const shopMap = new Map(shopSeed.map((shop, index) => [shop.key, insertedShops[index]]));

  const insertedCatalog = await Promise.all(
    catalogSeed.map((catalogItem) =>
      ProductCatalogModel.create({
        productName: catalogItem.productName,
        cylinderType: catalogItem.cylinderType,
        sizeKg: catalogItem.sizeKg,
        category: ProductCategory.GAS_CYLINDER,
        isActive: catalogItem.isActive,
        createdBy: adminUser.id,
        updatedBy: adminUser.id
      })
    )
  );

  const catalogMap = new Map(catalogSeed.map((catalogItem, index) => [catalogItem.key, insertedCatalog[index]]));

  const insertedProducts = await Promise.all(
    productSeed.map((product) =>
      ProductModel.create({
        merchant: userMap.get(product.merchantKey)?.id,
        shop: shopMap.get(product.shopKey)?.id,
        catalogItem: catalogMap.get(product.catalogKey)?.id,
        productName: catalogMap.get(product.catalogKey)?.productName,
        cylinderType: catalogMap.get(product.catalogKey)?.cylinderType,
        sizeKg: catalogMap.get(product.catalogKey)?.sizeKg,
        category: ProductCategory.GAS_CYLINDER,
        unit: 'cylinder',
        pricePerKg: product.pricePerKg,
        currentStock: product.currentStock,
        minStockLevel: product.minStockLevel,
        isAvailable: product.isAvailable,
        isFeatured: product.isFeatured
      })
    )
  );

  const productMap = new Map(productSeed.map((product, index) => [product.key, insertedProducts[index]]));

  await UserModel.findByIdAndUpdate(userMap.get('client_john')?.id, {
    savedMerchants: [shopMap.get('shop_jibu')?.id, shopMap.get('shop_flame')?.id]
  });
  await UserModel.findByIdAndUpdate(userMap.get('client_sarah')?.id, {
    savedMerchants: [shopMap.get('shop_flame')?.id]
  });

  const orderTemplates = [
    {
      key: 'order_001',
      orderNumber: 'GLR-20260427-A001',
      clientKey: 'client_john',
      merchantKey: 'merchant_jibu',
      shopKey: 'shop_jibu',
      status: OrderStatus.DELIVERED,
      paymentStatus: PaymentStatus.PAID,
      deliveryFee: 1500,
      clientNote: 'Please call when you are near the gate.',
      merchantNote: 'Delivered on time and received by customer.',
      stockCommitted: true,
      deliveryAddress: {
        province: 'Kigali City',
        district: 'Gasabo',
        sector: 'Remera',
        cell: 'Rukiri',
        village: 'Nyabisindu',
        streetAddress: 'KG 22 Street'
      },
      items: [
        { productKey: 'jibu_kigali_3kg', quantity: 1 },
        { productKey: 'jibu_kigali_15kg', quantity: 1 }
      ],
      statusHistory: [
        { status: OrderStatus.PENDING, actorKey: 'client_john', days: 8, note: 'Order created by client.' },
        { status: OrderStatus.APPROVED, actorKey: 'merchant_jibu', days: 8, note: 'Order accepted for dispatch.' },
        { status: OrderStatus.IN_TRANSIT, actorKey: 'merchant_jibu', days: 7, note: 'Driver left the shop.' },
        { status: OrderStatus.DELIVERED, actorKey: 'merchant_jibu', days: 7, note: 'Order completed successfully.' }
      ]
    },
    {
      key: 'order_002',
      orderNumber: 'GLR-20260427-A002',
      clientKey: 'client_sarah',
      merchantKey: 'merchant_flame',
      shopKey: 'shop_flame',
      status: OrderStatus.IN_TRANSIT,
      paymentStatus: PaymentStatus.CASH_ON_DELIVERY,
      deliveryFee: 1200,
      clientNote: 'Need delivery before 6 PM.',
      merchantNote: 'Driver dispatched and customer informed.',
      stockCommitted: true,
      deliveryAddress: {
        province: 'Kigali City',
        district: 'Kicukiro',
        sector: 'Niboye',
        cell: 'Nyakabanda',
        village: 'Busanza',
        streetAddress: 'KK 15 Ave'
      },
      items: [
        { productKey: 'flame_meru_6kg', quantity: 2 }
      ],
      statusHistory: [
        { status: OrderStatus.PENDING, actorKey: 'client_sarah', days: 2, note: 'Order created by client.' },
        { status: OrderStatus.APPROVED, actorKey: 'merchant_flame', days: 2, note: 'Stock reserved.' },
        { status: OrderStatus.IN_TRANSIT, actorKey: 'merchant_flame', days: 1, note: 'On the way to client.' }
      ]
    },
    {
      key: 'order_003',
      orderNumber: 'GLR-20260427-A003',
      clientKey: 'client_john',
      merchantKey: 'merchant_jibu',
      shopKey: 'shop_jibu',
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      deliveryFee: 1500,
      clientNote: 'Please confirm availability first.',
      merchantNote: '',
      stockCommitted: false,
      deliveryAddress: {
        province: 'Kigali City',
        district: 'Gasabo',
        sector: 'Remera',
        cell: 'Rukiri',
        village: 'Nyabisindu',
        streetAddress: 'KG 22 Street'
      },
      items: [
        { productKey: 'jibu_kigali_12kg', quantity: 1 }
      ],
      statusHistory: [
        { status: OrderStatus.PENDING, actorKey: 'client_john', days: 0, note: 'Awaiting merchant approval.' }
      ]
    },
    {
      key: 'order_004',
      orderNumber: 'GLR-20260427-A004',
      clientKey: 'client_david',
      merchantKey: 'merchant_flame',
      shopKey: 'shop_flame',
      status: OrderStatus.REJECTED,
      paymentStatus: PaymentStatus.FAILED,
      deliveryFee: 1200,
      clientNote: 'Can you deliver tomorrow morning?',
      merchantNote: 'Rejected because route is outside current delivery zone.',
      stockCommitted: false,
      deliveryAddress: {
        province: 'Southern Province',
        district: 'Huye',
        sector: 'Ngoma',
        cell: 'Matyazo',
        village: 'Butare',
        streetAddress: 'University Road'
      },
      items: [
        { productKey: 'flame_meru_3kg', quantity: 1 }
      ],
      statusHistory: [
        { status: OrderStatus.PENDING, actorKey: 'client_david', days: 5, note: 'Order created by client.' },
        { status: OrderStatus.REJECTED, actorKey: 'merchant_flame', days: 5, note: 'Delivery area not supported yet.' }
      ]
    }
  ] as const;

  const insertedOrders = [];

  for (const orderTemplate of orderTemplates) {
    const client = userMap.get(orderTemplate.clientKey);
    const merchant = userMap.get(orderTemplate.merchantKey);
    const shop = shopMap.get(orderTemplate.shopKey);

    if (!client || !merchant || !shop) {
      throw new Error(`Missing order references for ${orderTemplate.key}`);
    }

    const itemSnapshots = orderTemplate.items.map((item) => {
      const product = productMap.get(item.productKey);

      if (!product) {
        throw new Error(`Product ${item.productKey} not found for ${orderTemplate.key}`);
      }

      return {
        product,
        quantity: item.quantity,
        subtotal: product.price * item.quantity
      };
    });

    const subtotal = itemSnapshots.reduce((sum, item) => sum + item.subtotal, 0);

    const order = await OrderModel.create({
      orderNumber: orderTemplate.orderNumber,
      client: client.id,
      merchant: merchant.id,
      shop: shop.id,
      items: [],
      status: orderTemplate.status,
      paymentStatus: orderTemplate.paymentStatus,
      subtotal,
      deliveryFee: orderTemplate.deliveryFee,
      totalAmount: subtotal + orderTemplate.deliveryFee,
      deliveryAddress: orderTemplate.deliveryAddress,
      clientNote: orderTemplate.clientNote,
      merchantNote: orderTemplate.merchantNote || undefined,
      stockCommitted: orderTemplate.stockCommitted,
      statusHistory: orderTemplate.statusHistory.map((entry) => ({
        status: entry.status,
        changedAt: daysAgo(entry.days),
        changedBy: userMap.get(entry.actorKey)?.id,
        note: entry.note
      }))
    });

    const orderItems = await Promise.all(
      itemSnapshots.map((item) =>
        OrderItemModel.create({
          order: order.id,
          product: item.product.id,
          merchant: merchant.id,
          client: client.id,
          productName: item.product.name,
          productCategory: item.product.category,
          unit: item.product.unit,
          unitPrice: item.product.price,
          quantity: item.quantity,
          subtotal: item.subtotal
        })
      )
    );

    order.items = orderItems.map((item) => item._id);
    await order.save();
    insertedOrders.push(order);
  }

  const deliveredOrder = insertedOrders.find((order) => order.orderNumber === 'GLR-20260427-A001');

  if (deliveredOrder) {
    await ReviewModel.create({
      order: deliveredOrder.id,
      client: userMap.get('client_john')?.id,
      merchant: userMap.get('merchant_jibu')?.id,
      product: productMap.get('jibu_kigali_3kg')?.id,
      rating: 5,
      comment: 'Fast delivery and the refill quality was excellent.'
    });
  }

  const notificationSeed = [
    {
      userKey: 'merchant_jibu',
      title: 'New order received',
      message: 'Order GLR-20260427-A003 is waiting for your approval.',
      type: NotificationType.ORDER_CREATED,
      isRead: false
    },
    {
      userKey: 'merchant_flame',
      title: 'Delivery in progress',
      message: 'Order GLR-20260427-A002 is currently on the road.',
      type: NotificationType.ORDER_UPDATED,
      isRead: false
    },
    {
      userKey: 'merchant_hills',
      title: 'Verification pending',
      message: 'Your shop onboarding is pending final review by the admin team.',
      type: NotificationType.SHOP_VERIFICATION,
      isRead: false
    },
    {
      userKey: 'client_john',
      title: 'Order delivered',
      message: 'Your order GLR-20260427-A001 was delivered successfully.',
      type: NotificationType.ORDER_UPDATED,
      isRead: true
    },
    {
      userKey: 'client_sarah',
      title: 'Order dispatched',
      message: 'Order GLR-20260427-A002 is on the way to your location.',
      type: NotificationType.ORDER_UPDATED,
      isRead: false
    },
    {
      userKey: 'admin',
      title: 'Merchant requires review',
      message: 'Hillside Gas Musanze is ready for manual verification review.',
      type: NotificationType.SYSTEM,
      isRead: false
    }
  ] as const;

  await Promise.all(
    notificationSeed.map((notification) =>
      NotificationModel.create({
        user: userMap.get(notification.userKey)?.id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        isRead: notification.isRead
      })
    )
  );

  console.log('Seed complete.');
  console.log(`Users: ${insertedUsers.length}`);
  console.log(`Shops: ${insertedShops.length}`);
  console.log(`Catalog entries: ${insertedCatalog.length}`);
  console.log(`Products: ${insertedProducts.length}`);
  console.log(`Orders: ${insertedOrders.length}`);
  console.log('Demo credentials:');
  console.log('  Admin    -> admin@gaslink.rw / Admin123!');
  console.log('  Merchant -> merchant@example.com / Merchant123!');
  console.log('  Client   -> client@example.com / Client123!');
}

main()
  .catch((error) => {
    console.error('Error during MongoDB seeding:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectFromDatabase();
  });
