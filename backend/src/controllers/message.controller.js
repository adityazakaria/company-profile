import { prisma } from '../config/prisma.js';
import { asyncHandler } from '../utils/httpError.js';

export const createMessage = asyncHandler(async (req, res) => {
  const { website, ...data } = req.body;
  // honeypot terisi → anggap sukses tapi jangan simpan
  if (!website) await prisma.message.create({ data });
  res.status(201).json({ success: true, message: 'Pesan Anda berhasil dikirim. Kami akan segera menghubungi Anda.' });
});

export const listMessages = asyncHandler(async (req, res) => {
  const { page, limit, search, status } = req.validatedQuery;
  const where = {
    ...(status === 'read' ? { isRead: true } : status === 'unread' ? { isRead: false } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { subject: { contains: search, mode: 'insensitive' } },
            { message: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}),
  };
  const [data, total, unread] = await Promise.all([
    prisma.message.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
    prisma.message.count({ where }),
    prisma.message.count({ where: { isRead: false } }),
  ]);
  res.json({ success: true, data, meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)), unread } });
});

export const markRead = asyncHandler(async (req, res) => {
  const isRead = req.body?.isRead === false ? false : true;
  const data = await prisma.message.update({ where: { id: req.params.id }, data: { isRead } });
  res.json({ success: true, data });
});

export const deleteMessage = asyncHandler(async (req, res) => {
  await prisma.message.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Pesan berhasil dihapus' });
});
