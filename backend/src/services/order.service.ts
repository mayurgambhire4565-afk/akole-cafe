import prisma from '../database/prisma';
import { generateOrderNumber } from '../utils/jwt';
import { sendOrderConfirmationEmail } from '../utils/email';
import { getPagination, paginationMeta } from '../utils/response';
import { clearCart } from './cart.service';

export const createOrder = async (userId: string, data: {
  addressId: string;
  couponCode?: string;
  notes?: string;
  paymentMethod?: string;
  paymentProvider?: string;
  transactionId?: string;
}) => {
  // Get cart with items
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } },
  });

  if (!cart || cart.items.length === 0) throw new Error('Cart is empty');

  // Validate stock and calculate totals
  let subtotal = 0;
  const orderItemsData: {
    productId: string;
    productName: string;
    productImage: string | null;
    quantity: number;
    price: number;
    total: number;
  }[] = [];

  for (const item of cart.items) {
    if (!item.product.isActive) throw new Error(`${item.product.name} is no longer available`);
    if (item.product.stock < item.quantity) throw new Error(`Insufficient stock for ${item.product.name}`);

    const price = item.product.salePrice || item.product.price;
    const total = price * item.quantity;
    subtotal += total;

    orderItemsData.push({
      productId: item.productId,
      productName: item.product.name,
      productImage: (item.product.images as string[])?.[0] || null,
      quantity: item.quantity,
      price,
      total,
    });
  }

  // Apply coupon
  let discount = 0;
  let couponId: string | undefined;

  if (data.couponCode) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: data.couponCode.toUpperCase(), isActive: true },
    });

    if (coupon && (!coupon.expiresAt || new Date() < coupon.expiresAt)) {
      if (!coupon.minOrderValue || subtotal >= coupon.minOrderValue) {
        if (coupon.type === 'PERCENTAGE') {
          discount = (subtotal * coupon.discount) / 100;
          if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
        } else if (coupon.type === 'FIXED') {
          discount = coupon.discount;
        }
        couponId = coupon.id;

        // Track usage
        await prisma.couponUsage.upsert({
          where: { couponId_userId: { couponId: coupon.id, userId } },
          update: {},
          create: { couponId: coupon.id, userId },
        });
        await prisma.coupon.update({ where: { id: coupon.id }, data: { usedCount: { increment: 1 } } });
      }
    }
  }

  const deliveryFee = subtotal > 500 ? 0 : 49;
  const tax = (subtotal - discount) * 0.05; // 5% GST
  const total = subtotal - discount + deliveryFee + tax;
  const orderNumber = generateOrderNumber();

  // Create order and update stock atomically
  const order = await prisma.$transaction(async (tx) => {
    const paymentStatus = (data.paymentMethod === 'cod' || !data.paymentMethod) ? 'PENDING' : 'COMPLETED';
    const paymentProvider = data.paymentProvider || (data.paymentMethod === 'cod' ? 'COD' : 'ONLINE');

    const newOrder = await tx.order.create({
      data: {
        orderNumber,
        userId,
        addressId: data.addressId,
        subtotal,
        discount,
        deliveryFee,
        tax,
        total,
        couponId,
        notes: data.notes,
        items: { create: orderItemsData },
        tracking: { create: { status: 'PENDING', message: 'Order placed successfully' } },
        payment: {
          create: {
            amount: total,
            provider: paymentProvider.toUpperCase(),
            status: paymentStatus,
            transactionId: data.transactionId || null,
            paidAt: paymentStatus === 'COMPLETED' ? new Date() : null,
          }
        }
      },
      include: { items: true, address: true, payment: true },
    });

    // Update stock
    for (const item of cart.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // Update user stats
    await tx.user.update({
      where: { id: userId },
      data: { totalOrders: { increment: 1 }, totalSpent: { increment: total } },
    });

    // Award loyalty points (1 point per ₹10 spent)
    const pointsEarned = Math.floor(total / 10);
    if (pointsEarned > 0) {
      await tx.reward.create({
        data: { userId, points: pointsEarned, type: 'EARNED', description: `Points for order #${orderNumber}`, orderId: newOrder.id },
      });
      await tx.user.update({ where: { id: userId }, data: { loyaltyPoints: { increment: pointsEarned } } });
    }

    return newOrder;
  });

  await clearCart(userId);

  // Send confirmation email
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true } });
  if (user) {
    await sendOrderConfirmationEmail(
      user.email, user.name, orderNumber, total,
      orderItemsData.map(i => ({ name: i.productName, qty: i.quantity, price: i.total }))
    );
  }

  return order;
};

export const getUserOrders = async (userId: string, page = 1, limit = 10) => {
  const { skip, take } = getPagination(page, limit);
  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      skip, take,
      orderBy: { createdAt: 'desc' },
      include: {
        items: { include: { product: { select: { name: true, images: true } } } },
        payment: { select: { status: true, provider: true } },
      },
    }),
    prisma.order.count({ where: { userId } }),
  ]);
  return { orders, pagination: paginationMeta(total, page, limit) };
};

export const getOrderById = async (id: string, userId?: string) => {
  const where: Record<string, unknown> = { id };
  if (userId) where.userId = userId;

  const order = await prisma.order.findFirst({
    where,
    include: {
      items: true,
      address: true,
      payment: true,
      tracking: { orderBy: { createdAt: 'asc' } },
      user: { select: { name: true, email: true } },
    },
  });
  if (!order) throw new Error('Order not found');
  return order;
};

export const cancelOrder = async (orderId: string, userId: string) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: { items: true },
  });

  if (!order) throw new Error('Order not found');
  if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
    throw new Error('Order cannot be cancelled at this stage');
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({ where: { id: orderId }, data: { status: 'CANCELLED' } });
    await tx.orderTracking.create({ data: { orderId, status: 'CANCELLED', message: 'Order cancelled by customer' } });

    // Restore stock
    for (const item of order.items) {
      await tx.product.update({ where: { id: item.productId }, data: { stock: { increment: item.quantity } } });
    }
  });

  return { message: 'Order cancelled successfully' };
};

// Admin
export const getAllOrders = async (page = 1, limit = 20, status?: string) => {
  const where = status ? { status: status as never } : {};
  const { skip, take } = getPagination(page, limit);

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where, skip, take,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        payment: { select: { status: true, provider: true } },
        _count: { select: { items: true } },
      },
    }),
    prisma.order.count({ where }),
  ]);
  return { orders, pagination: paginationMeta(total, page, limit) };
};

export const updateOrderStatus = async (orderId: string, status: string, message?: string) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new Error('Order not found');

  await prisma.$transaction([
    prisma.order.update({ where: { id: orderId }, data: { status: status as never } }),
    prisma.orderTracking.create({ data: { orderId, status: status as never, message: message || `Status updated to ${status}` } }),
  ]);

  return getOrderById(orderId);
};
