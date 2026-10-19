import { prisma } from '../config/prisma.js';
import { asyncHandler } from '../utils/httpError.js';

export const dashboardStats = asyncHandler(async (_req, res) => {
  const [products, activeProducts, news, publishedNews, messages, unreadMessages, recentMessages, recentNews] =
    await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.news.count(),
      prisma.news.count({ where: { published: true } }),
      prisma.message.count(),
      prisma.message.count({ where: { isRead: false } }),
      prisma.message.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
      prisma.news.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, title: true, slug: true, published: true, createdAt: true },
      }),
    ]);

  res.json({
    success: true,
    data: { products, activeProducts, news, publishedNews, messages, unreadMessages, recentMessages, recentNews },
  });
});
