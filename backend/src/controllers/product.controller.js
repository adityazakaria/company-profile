import { prisma } from '../config/prisma.js';
import { HttpError, asyncHandler } from '../utils/httpError.js';
import { uniqueSlug } from '../utils/slug.js';

export const listProducts = asyncHandler(async (req, res) => {
  const { page, limit, search, category, all } = req.validatedQuery;
  const includeInactive = all === 'true' && Boolean(req.admin);

  const where = {
    ...(includeInactive ? {} : { isActive: true }),
    ...(category ? { category: { equals: category, mode: 'insensitive' } } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { category: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.product.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
    prisma.product.count({ where }),
  ]);

  res.json({
    success: true,
    data: items,
    meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
  });
});

export const listProductCategories = asyncHandler(async (_req, res) => {
  const rows = await prisma.product.groupBy({ by: ['category'], where: { isActive: true }, _count: true, orderBy: { category: 'asc' } });
  res.json({ success: true, data: rows.map((r) => ({ name: r.category, count: r._count })) });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await prisma.product.findUnique({ where: { slug: req.params.slug } });
  if (!product || (!product.isActive && !req.admin)) throw new HttpError(404, 'Produk tidak ditemukan');

  const related = await prisma.product.findMany({
    where: { isActive: true, category: product.category, NOT: { id: product.id } },
    orderBy: { createdAt: 'desc' },
    take: 3,
  });
  res.json({ success: true, data: { ...product, related } });
});

export const createProduct = asyncHandler(async (req, res) => {
  const slug = await uniqueSlug(prisma.product, req.body.name);
  const product = await prisma.product.create({ data: { ...req.body, slug } });
  res.status(201).json({ success: true, message: 'Produk berhasil ditambahkan', data: product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const current = await prisma.product.findUnique({ where: { id } });
  if (!current) throw new HttpError(404, 'Produk tidak ditemukan');
  const slug = current.name === req.body.name ? current.slug : await uniqueSlug(prisma.product, req.body.name, id);
  const product = await prisma.product.update({ where: { id }, data: { ...req.body, slug } });
  res.json({ success: true, message: 'Produk berhasil diperbarui', data: product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  await prisma.product.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Produk berhasil dihapus' });
});
