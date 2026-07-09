import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { sendSuccess } from '../utils/response';
import prisma from '../database/prisma';

const router = Router();
router.use(authenticate, authorize('ADMIN', 'SUPER_ADMIN'));

router.get('/stats', asyncHandler(async (_req, res) => {
  const [
    totalUsers, totalOrders, totalRevenue, totalProducts,
    pendingOrders, activeSubscriptions, recentOrders, topProducts,
    ordersByStatus, revenueByMonth,
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.subscription.count({ where: { status: 'ACTIVE' } }),
    prisma.order.findMany({
      take: 5, orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } },
    }),
    prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true, total: true },
      orderBy: { _sum: { total: 'desc' } },
      take: 5,
    }),
    prisma.order.groupBy({ by: ['status'], _count: true }),
    // Monthly revenue for last 6 months
    prisma.$queryRaw`
      SELECT DATE_FORMAT(created_at, '%Y-%m') as month, SUM(total) as revenue
      FROM orders
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY month
      ORDER BY month ASC
    `,
  ]);

  // Enrich top products
  const productIds = topProducts.map(p => p.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true, images: true },
  });
  const enrichedTopProducts = topProducts.map(tp => ({
    ...tp,
    product: products.find(p => p.id === tp.productId),
  }));

  sendSuccess(res, {
    stats: {
      totalUsers, totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      totalProducts, pendingOrders, activeSubscriptions,
    },
    recentOrders,
    topProducts: enrichedTopProducts,
    ordersByStatus,
    revenueByMonth,
  }, 'Dashboard stats fetched');
}));

export default router;
