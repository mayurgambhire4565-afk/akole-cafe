import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { sendSuccess, sendError } from '../utils/response';
import * as productService from '../services/product.service';

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = '1', limit = '12', search, category, minPrice, maxPrice,
    sortBy = 'createdAt', sortOrder = 'desc', featured, bestseller,
  } = req.query as Record<string, string>;

  const result = await productService.getProducts({
    page: parseInt(page), limit: parseInt(limit), search, category,
    minPrice: minPrice ? parseFloat(minPrice) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    sortBy, sortOrder: sortOrder as 'asc' | 'desc',
    featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
    bestseller: bestseller === 'true' ? true : bestseller === 'false' ? false : undefined,
  });

  sendSuccess(res, { products: result.products }, 'Products fetched', 200, result.pagination);
});

export const getProductBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const result = await productService.getProductBySlug(slug);
  sendSuccess(res, result, 'Product fetched');
});

export const getCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await productService.getCategories();
  sendSuccess(res, { categories }, 'Categories fetched');
});

export const createProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  const images = req.files
    ? (req.files as Express.Multer.File[]).map(f => `/uploads/${f.filename}`)
    : req.body.images || [];

  const product = await productService.createProduct({ ...req.body, images, price: parseFloat(req.body.price), stock: parseInt(req.body.stock) });
  sendSuccess(res, { product }, 'Product created', 201);
});

export const updateProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const product = await productService.updateProduct(id, req.body);
  sendSuccess(res, { product }, 'Product updated');
});

export const deleteProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  await productService.deleteProduct(req.params.id);
  sendSuccess(res, null, 'Product deleted');
});

export const createCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;
  const category = await productService.createCategory({ ...req.body, image });
  sendSuccess(res, { category }, 'Category created', 201);
});

export const updateCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const category = await productService.updateCategory(req.params.id, req.body);
  sendSuccess(res, { category }, 'Category updated');
});

export const deleteCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  await productService.deleteCategory(req.params.id);
  sendSuccess(res, null, 'Category deleted');
});
