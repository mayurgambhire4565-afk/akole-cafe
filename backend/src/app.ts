import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { env } from './config/env';
import { errorHandler, notFound } from './middleware/errorHandler';

// Routes
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import cartRoutes from './routes/cart.routes';
import orderRoutes from './routes/order.routes';
import userRoutes from './routes/user.routes';
import wishlistRoutes from './routes/wishlist.routes';
import addressRoutes from './routes/address.routes';
import reviewRoutes from './routes/review.routes';
import blogRoutes from './routes/blog.routes';
import rewardRoutes from './routes/reward.routes';
import subscriptionRoutes from './routes/subscription.routes';
import couponRoutes from './routes/coupon.routes';
import notificationRoutes from './routes/notification.routes';
import adminRoutes from './routes/admin.routes';
import reservationRoutes from './routes/reservation.routes';

const app = express();

// ================================
// Security Middleware
// ================================
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// Auth rate limiter (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.NODE_ENV === 'development' ? 1000 : 10,
  message: { success: false, message: 'Too many auth attempts, please try again in 15 minutes.' },
});

// ================================
// General Middleware
// ================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser(env.COOKIE_SECRET));

if (!env.IS_PROD) {
  app.use(morgan('dev'));
}

// ================================
// Static Files (uploads)
// ================================
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ================================
// Health Check
// ================================
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Coffee Katta API is running ☕', timestamp: new Date().toISOString() });
});

// Newsletter subscription (public)
app.post('/api/newsletter', async (req, res) => {
  const { email } = req.body;
  if (!email) { res.status(400).json({ success: false, message: 'Email required' }); return; }
  try {
    const { default: prisma } = await import('./database/prisma');
    await prisma.newsletter.upsert({
      where: { email },
      update: { isActive: true },
      create: { email },
    });
    res.json({ success: true, message: 'Subscribed to newsletter!' });
  } catch {
    res.status(400).json({ success: false, message: 'Failed to subscribe' });
  }
});

// ================================
// API Routes
// ================================
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reservations', reservationRoutes);

// ================================
// Error Handling
// ================================
app.use(notFound);
app.use(errorHandler);

export default app;
