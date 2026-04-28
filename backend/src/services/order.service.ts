import { Types } from 'mongoose';
import { MerchantShopModel } from '../models/MerchantShop';
import { OrderItemModel } from '../models/OrderItem';
import { OrderModel } from '../models/Order';
import { ProductModel } from '../models/Product';
import { NotificationType, OrderStatus, PaymentStatus } from '../types';
import { createNotification } from '../utils/notifications';

type DeliveryAddress = {
  province: string;
  district: string;
  sector: string;
  cell?: string;
  village?: string;
  streetAddress?: string;
};

export interface CreateOrderInput {
  clientId: string;
  merchantId: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  deliveryAddress: DeliveryAddress;
  deliveryFee?: number;
  clientNote?: string;
  paymentMethod?: PaymentStatus;
}

const buildOrderNumber = () => {
  const now = new Date();
  const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const uniquePart = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `GLR-${datePart}-${uniquePart}`;
};

const populateOrder = (orderId: string | Types.ObjectId) =>
  OrderModel.findById(orderId)
    .populate('client', 'firstName lastName email phone')
    .populate('merchant', 'firstName lastName email phone')
    .populate('shop', 'shopName slug businessPhone address verificationStatus')
    .populate({
      path: 'items',
      model: 'OrderItem',
      populate: {
        path: 'product',
        model: 'Product',
        select: 'name category imageUrl'
      }
    });

export const createOrderRecord = async (input: CreateOrderInput) => {
  if (!input.items.length) {
    throw new Error('At least one order item is required');
  }

  const shop = await MerchantShopModel.findOne({ owner: input.merchantId });
  if (!shop) {
    throw new Error('Merchant shop not found');
  }

  const requestedIds = input.items.map((item) => item.productId);
  const products = await ProductModel.find({
    _id: { $in: requestedIds },
    merchant: input.merchantId,
    isAvailable: true
  });

  if (products.length !== requestedIds.length) {
    throw new Error('One or more selected products are unavailable');
  }

  const productMap = new Map(products.map((product) => [product.id, product]));

  let subtotal = 0;
  const lineItems = input.items.map((item) => {
    const product = productMap.get(item.productId);
    if (!product) {
      throw new Error('Selected product does not belong to this merchant');
    }

    if (item.quantity < 1) {
      throw new Error('Order quantity must be at least 1');
    }

    if (product.currentStock < item.quantity) {
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    const lineSubtotal = product.price * item.quantity;
    subtotal += lineSubtotal;

    return {
      product,
      quantity: item.quantity,
      subtotal: lineSubtotal
    };
  });

  const deliveryFee = input.deliveryFee ?? shop.deliveryFee ?? 0;
  const totalAmount = subtotal + deliveryFee;

  const order = await OrderModel.create({
    orderNumber: buildOrderNumber(),
    client: input.clientId,
    merchant: input.merchantId,
    shop: shop.id,
    items: [],
    status: OrderStatus.PENDING,
    paymentStatus: input.paymentMethod ?? PaymentStatus.PENDING,
    subtotal,
    deliveryFee,
    totalAmount,
    deliveryAddress: input.deliveryAddress,
    clientNote: input.clientNote,
    statusHistory: [
      {
        status: OrderStatus.PENDING,
        changedAt: new Date(),
        changedBy: input.clientId
      }
    ]
  });

  const orderItems = await OrderItemModel.insertMany(
    lineItems.map((item) => ({
      order: order.id,
      product: item.product.id,
      merchant: input.merchantId,
      client: input.clientId,
      productName: item.product.name,
      productCategory: item.product.category,
      unit: item.product.unit,
      unitPrice: item.product.price,
      quantity: item.quantity,
      subtotal: item.subtotal
    }))
  );

  order.items = orderItems.map((item) => item._id as Types.ObjectId);
  await order.save();

  await Promise.all([
    createNotification({
      user: input.merchantId,
      title: 'New order received',
      message: `A new order ${order.orderNumber} has been placed and is awaiting approval.`,
      type: NotificationType.ORDER_CREATED,
      metadata: { orderId: order.id, orderNumber: order.orderNumber }
    }),
    createNotification({
      user: input.clientId,
      title: 'Order placed successfully',
      message: `Your order ${order.orderNumber} has been sent to ${shop.shopName}.`,
      type: NotificationType.ORDER_CREATED,
      metadata: { orderId: order.id, orderNumber: order.orderNumber }
    })
  ]);

  return populateOrder(order.id);
};

const ensureTransitionAllowed = (currentStatus: OrderStatus, nextStatus: OrderStatus) => {
  const transitions: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.PENDING]: [OrderStatus.APPROVED, OrderStatus.REJECTED, OrderStatus.CANCELLED],
    [OrderStatus.APPROVED]: [OrderStatus.IN_TRANSIT, OrderStatus.CANCELLED],
    [OrderStatus.REJECTED]: [],
    [OrderStatus.IN_TRANSIT]: [OrderStatus.DELIVERED, OrderStatus.CANCELLED],
    [OrderStatus.DELIVERED]: [],
    [OrderStatus.CANCELLED]: []
  };

  if (!transitions[currentStatus].includes(nextStatus)) {
    throw new Error(`Cannot change order from ${currentStatus} to ${nextStatus}`);
  }
};

export const transitionOrderStatus = async (input: {
  orderId: string;
  actorId: string;
  status: OrderStatus;
  note?: string;
}) => {
  const order = await OrderModel.findById(input.orderId).populate('items');
  if (!order) {
    throw new Error('Order not found');
  }

  ensureTransitionAllowed(order.status, input.status);

  const orderItems = await OrderItemModel.find({ order: order.id });

  if (input.status === OrderStatus.APPROVED && !order.stockCommitted) {
    for (const item of orderItems) {
      const product = await ProductModel.findOneAndUpdate(
        {
          _id: item.product,
          currentStock: { $gte: item.quantity }
        },
        {
          $inc: { currentStock: -item.quantity }
        },
        { new: true }
      );

      if (!product) {
        throw new Error(`Stock could not be reserved for ${item.productName}`);
      }
    }

    order.stockCommitted = true;
  }

  if (
    input.status === OrderStatus.CANCELLED &&
    order.stockCommitted &&
    [OrderStatus.APPROVED, OrderStatus.IN_TRANSIT].includes(order.status)
  ) {
    for (const item of orderItems) {
      await ProductModel.findByIdAndUpdate(item.product, {
        $inc: { currentStock: item.quantity }
      });
    }

    order.stockCommitted = false;
  }

  order.status = input.status;
  if (input.status === OrderStatus.DELIVERED && order.paymentStatus === PaymentStatus.PENDING) {
    order.paymentStatus = PaymentStatus.PAID;
  }
  order.statusHistory.push({
    status: input.status,
    changedAt: new Date(),
    changedBy: new Types.ObjectId(input.actorId),
    note: input.note
  });
  if (input.note) {
    order.merchantNote = input.note;
  }

  await order.save();

  await Promise.all([
    createNotification({
      user: order.client,
      title: 'Order status updated',
      message: `Your order ${order.orderNumber} is now ${input.status}.`,
      type: NotificationType.ORDER_UPDATED,
      metadata: { orderId: order.id, orderNumber: order.orderNumber, status: input.status }
    }),
    createNotification({
      user: order.merchant,
      title: 'Order updated',
      message: `Order ${order.orderNumber} has been marked as ${input.status}.`,
      type: NotificationType.ORDER_UPDATED,
      metadata: { orderId: order.id, orderNumber: order.orderNumber, status: input.status }
    })
  ]);

  return populateOrder(order.id);
};
