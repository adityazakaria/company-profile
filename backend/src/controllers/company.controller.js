import { prisma } from '../config/prisma.js';
import { HttpError, asyncHandler } from '../utils/httpError.js';

export const getCompany = asyncHandler(async (_req, res) => {
  const company = await prisma.company.findFirst({ orderBy: { id: 'asc' } });
  if (!company) throw new HttpError(404, 'Profil perusahaan belum diisi');
  res.json({ success: true, data: company });
});

export const updateCompany = asyncHandler(async (req, res) => {
  const existing = await prisma.company.findFirst({ orderBy: { id: 'asc' } });
  const data = { ...req.body };
  // Json? nullable: Prisma butuh Prisma.JsonNull/DbNull — gunakan array kosong sebagai default
  for (const k of ['stats', 'coreValues', 'team', 'legality', 'socials']) data[k] = data[k] ?? [];

  const company = existing
    ? await prisma.company.update({ where: { id: existing.id }, data })
    : await prisma.company.create({ data });
  res.json({ success: true, message: 'Profil perusahaan diperbarui', data: company });
});
