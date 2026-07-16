// ================================
// USER & AUTH
// ================================
export type Role = 'CUSTOMER' | 'EMPLOYEE' | 'ADMIN' | 'SUPER_ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: Role;
  isVerified: boolean;
  isActive: boolean;
  loyaltyPoints: number;
  referralCode?: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ================================
// PRODUCT
// ================================
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
  _count?: { products: number };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc?: string;
  price: number;
  salePrice?: number;
  sku?: string;
  stock: number;
  images: string[];
  categoryId: string;
  category: { name: string; slug: string };
  rating: number;
  reviewCount: number;
  isActive: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  weight?: number;
  origin?: string;
  roastLevel?: string;
  flavor?: string;
  tags?: string[];
  isVeg?: boolean;
  isChefSpecial?: boolean;
  spiceLevel?: 'mild' | 'medium' | 'hot' | 'extra-hot';
  prepTime?: string;
  reviews?: Review[];
  createdAt: string;
}

// ================================
// CART
// ================================
export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  product: Pick<Product, 'id' | 'name' | 'price' | 'salePrice' | 'images' | 'stock' | 'slug'>;
  quantity: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

// ================================
// ADDRESS
// ================================
export interface Address {
  id: string;
  userId: string;
  label?: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

// ================================
// ORDER
// ================================
export type OrderStatus = 
  | 'PENDING' | 'CONFIRMED' | 'PREPARING' 
  | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  price: number;
  total: number;
}

export interface OrderTracking {
  id: string;
  status: OrderStatus;
  message: string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  addressId: string;
  address?: Address;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  total: number;
  couponId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  tracking?: OrderTracking[];
  payment?: Payment;
  user?: Pick<User, 'name' | 'email'>;
}

// ================================
// PAYMENT
// ================================
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
export type PaymentProvider = 'RAZORPAY' | 'STRIPE' | 'PAYPAL' | 'COD';

export interface Payment {
  id: string;
  orderId: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  amount: number;
  currency: string;
  transactionId?: string;
  paidAt?: string;
}

// ================================
// REVIEW
// ================================
export interface Review {
  id: string;
  userId: string;
  user: Pick<User, 'name' | 'avatar'>;
  productId: string;
  rating: number;
  title?: string;
  comment: string;
  isApproved: boolean;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
}

// ================================
// SUBSCRIPTION
// ================================
export type SubscriptionPlan = 'WEEKLY' | 'MONTHLY' | 'CUSTOM';
export type SubscriptionStatus = 'ACTIVE' | 'PAUSED' | 'CANCELLED' | 'EXPIRED';

export interface Subscription {
  id: string;
  userId: string;
  productId: string;
  product?: Pick<Product, 'name' | 'images' | 'price'>;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  quantity: number;
  price: number;
  startDate: string;
  nextDelivery: string;
  pausedUntil?: string;
  cancelledAt?: string;
}

// ================================
// REWARD
// ================================
export type RewardType = 'EARNED' | 'REDEEMED' | 'REFERRAL' | 'BONUS' | 'EXPIRED';

export interface Reward {
  id: string;
  userId: string;
  points: number;
  type: RewardType;
  description: string;
  orderId?: string;
  expiresAt?: string;
  createdAt: string;
}

// ================================
// BLOG
// ================================
export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  authorId: string;
  author: Pick<User, 'name' | 'avatar'>;
  category: string;
  tags?: string[];
  isPublished: boolean;
  publishedAt?: string;
  viewCount: number;
  createdAt: string;
  comments?: BlogComment[];
}

export interface BlogComment {
  id: string;
  blogId: string;
  name: string;
  email: string;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

// ================================
// COUPON
// ================================
export type CouponType = 'PERCENTAGE' | 'FIXED' | 'FREE_SHIPPING';

export interface Coupon {
  id: string;
  code: string;
  description?: string;
  type: CouponType;
  discount: number;
  minOrderValue?: number;
  maxDiscount?: number;
  maxUses?: number;
  usedCount: number;
  isActive: boolean;
  expiresAt?: string;
}

// ================================
// NOTIFICATION
// ================================
export type NotificationType = 'ORDER' | 'PAYMENT' | 'PROMOTION' | 'SYSTEM' | 'REWARD';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// ================================
// API RESPONSE
// ================================
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  errors?: unknown;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ProductQueryParams extends PaginationParams {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  featured?: boolean;
  bestseller?: boolean;
}
