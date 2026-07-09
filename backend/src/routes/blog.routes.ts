import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { sendSuccess, sendError } from '../utils/response';
import { Response } from 'express';
import prisma from '../database/prisma';
import { generateSlug } from '../utils/jwt';

const router = Router();

// Public routes
router.get('/', asyncHandler(async (req, res) => {
  const { page = '1', limit = '9', category, search } = req.query as Record<string, string>;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const where: Record<string, unknown> = { isPublished: true };
  if (category) where.category = category;
  if (search) where.OR = [{ title: { contains: search } }, { excerpt: { contains: search } }];

  const [blogs, total] = await Promise.all([
    prisma.blog.findMany({
      where, skip, take: parseInt(limit),
      orderBy: { publishedAt: 'desc' },
      include: { author: { select: { name: true, avatar: true } } },
    }),
    prisma.blog.count({ where }),
  ]);
  sendSuccess(res, { blogs }, 'Blogs fetched', 200, {
    page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit))
  });
}));

router.get('/:slug', asyncHandler(async (req, res) => {
  const blog = await prisma.blog.findUnique({
    where: { slug: req.params.slug },
    include: {
      author: { select: { name: true, avatar: true } },
      comments: { where: { isApproved: true }, orderBy: { createdAt: 'asc' } },
    },
  });
  if (!blog || !blog.isPublished) { sendError(res, 'Blog not found', 404); return; }
  await prisma.blog.update({ where: { id: blog.id }, data: { viewCount: { increment: 1 } } });
  sendSuccess(res, { blog }, 'Blog fetched');
}));

// Post comment
router.post('/:id/comments', asyncHandler(async (req, res) => {
  const { name, email, comment } = req.body;
  if (!name || !email || !comment) { sendError(res, 'Name, email and comment required', 400); return; }
  const newComment = await prisma.blogComment.create({
    data: { blogId: req.params.id, name, email, comment },
  });
  sendSuccess(res, { comment: newComment }, 'Comment submitted (pending approval)', 201);
}));

// Admin routes
router.get('/admin/all', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), asyncHandler(async (_req, res) => {
  const blogs = await prisma.blog.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: { select: { name: true, avatar: true } } },
  });
  sendSuccess(res, { blogs }, 'All blogs fetched');
}));

router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title, excerpt, content, category, tags, isPublished, coverImage } = req.body;
  if (!title || !content) { sendError(res, 'Title and content required', 400); return; }
  const slug = generateSlug(title);

  const blog = await prisma.blog.create({
    data: {
      title, slug, excerpt, content, category, tags, coverImage,
      authorId: req.user!.id,
      isPublished: isPublished || false,
      publishedAt: isPublished ? new Date() : null,
    },
  });
  sendSuccess(res, { blog }, 'Blog created', 201);
}));

router.put('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const existing = await prisma.blog.findUnique({ where: { id: req.params.id } });
  if (!existing) { sendError(res, 'Blog not found', 404); return; }

  const data = { ...req.body };
  if (req.body.isPublished && !existing.isPublished) data.publishedAt = new Date();

  const blog = await prisma.blog.update({ where: { id: req.params.id }, data });
  sendSuccess(res, { blog }, 'Blog updated');
}));

router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), asyncHandler(async (_req, res) => {
  await prisma.blog.delete({ where: { id: _req.params.id } });
  sendSuccess(res, null, 'Blog deleted');
}));

export default router;
