import { prisma } from '../config/prisma.js';
import { HttpError, asyncHandler } from '../utils/httpError.js';
import { uniqueSlug } from '../utils/slug.js';
import { cleanHtml } from '../utils/sanitize.js';

const listSelect = {
  id: true, title: true, slug: true, thumbnail: true, category: true, author: true,
  published: true, publishedAt: true, createdAt: true, updatedAt: true,
};

const excerpt = (html, n = 160) => {
  const t = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return t.length > n ? `${t.slice(0, n).trim()}…` : t;
};

export const listNews = asyncHandler(async (req, res) => {
  const { page, limit, search, category, all } = req.validatedQuery;
  const includeDrafts = all === 'true' && Boolean(req.admin);

  const where = {
    ...(includeDrafts ? {} : { published: true }),
    ...(category ? { category: { equals: category, mode: 'insensitive' } } : {}),
    ...(search
      ? { OR: [{ title: { contains: search, mode: 'insensitive' } }, { content: { contains: search, mode: 'insensitive' } }] }
      : {}),
  };

  const [rows, total] = await Promise.all([
    prisma.news.findMany({
      where,
      select: { ...listSelect, content: true },
      orderBy: [{ publishedAt: { sort: 'desc', nulls: 'last' } }, { createdAt: 'desc' }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.news.count({ where }),
  ]);

  const data = rows.map(({ content, ...n }) => ({ ...n, excerpt: excerpt(content) }));
  res.json({ success: true, data, meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) } });
});

export const listNewsCategories = asyncHandler(async (_req, res) => {
  const rows = await prisma.news.groupBy({ by: ['category'], where: { published: true }, _count: true, orderBy: { category: 'asc' } });
  res.json({ success: true, data: rows.map((r) => ({ name: r.category, count: r._count })) });
});

export const getNews = asyncHandler(async (req, res) => {
  const news = await prisma.news.findUnique({ where: { slug: req.params.slug } });
  if (!news || (!news.published && !req.admin)) throw new HttpError(404, 'Berita tidak ditemukan');

  const related = await prisma.news.findMany({
    where: { published: true, NOT: { id: news.id } },
    select: listSelect,
    orderBy: { publishedAt: 'desc' },
    take: 3,
  });
  res.json({ success: true, data: { ...news, related } });
});

export const createNews = asyncHandler(async (req, res) => {
  const slug = await uniqueSlug(prisma.news, req.body.title);
  const news = await prisma.news.create({
    data: {
      ...req.body,
      content: cleanHtml(req.body.content),
      slug,
      publishedAt: req.body.published ? new Date() : null,
    },
  });
  res.status(201).json({ success: true, message: 'Berita berhasil ditambahkan', data: news });
});

export const updateNews = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const current = await prisma.news.findUnique({ where: { id } });
  if (!current) throw new HttpError(404, 'Berita tidak ditemukan');

  const slug = current.title === req.body.title ? current.slug : await uniqueSlug(prisma.news, req.body.title, id);
  const publishedAt = req.body.published ? current.publishedAt ?? new Date() : null;

  const news = await prisma.news.update({
    where: { id },
    data: { ...req.body, content: cleanHtml(req.body.content), slug, publishedAt },
  });
  res.json({ success: true, message: 'Berita berhasil diperbarui', data: news });
});

export const deleteNews = asyncHandler(async (req, res) => {
  await prisma.news.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Berita berhasil dihapus' });
});
