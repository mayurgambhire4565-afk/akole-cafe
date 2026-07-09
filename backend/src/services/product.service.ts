import prisma from '../database/prisma';
import { generateSlug } from '../utils/jwt';
import { getPagination, paginationMeta } from '../utils/response';

interface ProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  featured?: boolean;
  bestseller?: boolean;
}

export const getProducts = async (query: ProductQuery) => {
  const {
    page = 1, limit = 12, search, category, minPrice, maxPrice,
    sortBy = 'createdAt', sortOrder = 'desc', featured, bestseller
  } = query;

  const where: Record<string, unknown> = { isActive: true };

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
      { tags: { string_contains: search } },
    ];
  }

  if (category) {
    where.category = { slug: category };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) (where.price as Record<string, unknown>).gte = minPrice;
    if (maxPrice !== undefined) (where.price as Record<string, unknown>).lte = maxPrice;
  }

  if (featured !== undefined) where.isFeatured = featured;
  if (bestseller !== undefined) where.isBestseller = bestseller;

  const { skip, take } = getPagination(page, limit);

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take,
      orderBy: { [sortBy]: sortOrder },
      include: { category: { select: { name: true, slug: true } } },
    }),
    prisma.product.count({ where }),
  ]);

  return { products, pagination: paginationMeta(total, page, limit) };
};

export const getProductBySlug = async (slug: string) => {
  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      category: { select: { name: true, slug: true } },
      reviews: {
        where: { isApproved: true },
        include: { user: { select: { name: true, avatar: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });
  if (!product) throw new Error('Product not found');

  // Related products
  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id }, isActive: true },
    take: 4,
    include: { category: { select: { name: true, slug: true } } },
  });

  return { product, related };
};

export const createProduct = async (data: {
  name: string; description: string; price: number; categoryId: string;
  stock: number; images: string[]; salePrice?: number; sku?: string;
  shortDesc?: string; weight?: number; origin?: string; roastLevel?: string;
  flavor?: string; tags?: string[]; isFeatured?: boolean; isBestseller?: boolean;
}) => {
  const slug = generateSlug(data.name);

  // Check slug uniqueness
  const existing = await prisma.product.findUnique({ where: { slug } });
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

  return prisma.product.create({
    data: { ...data, slug: finalSlug, images: data.images, tags: data.tags },
    include: { category: { select: { name: true, slug: true } } },
  });
};

export const updateProduct = async (id: string, data: Partial<{
  name: string; description: string; price: number; salePrice: number;
  stock: number; images: string[]; isFeatured: boolean; isBestseller: boolean;
  isActive: boolean; roastLevel: string; flavor: string; origin: string;
}>) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new Error('Product not found');

  return prisma.product.update({ where: { id }, data });
};

export const deleteProduct = async (id: string) => {
  await prisma.product.update({ where: { id }, data: { isActive: false } });
};

export const getCategories = async () => {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { products: { where: { isActive: true } } } } },
  });
};

export const createCategory = async (data: { name: string; description?: string; image?: string }) => {
  const slug = generateSlug(data.name);
  return prisma.category.create({ data: { ...data, slug } });
};

export const updateCategory = async (id: string, data: Partial<{ name: string; description: string; image: string; isActive: boolean }>) => {
  return prisma.category.update({ where: { id }, data });
};

export const deleteCategory = async (id: string) => {
  await prisma.category.update({ where: { id }, data: { isActive: false } });
};
