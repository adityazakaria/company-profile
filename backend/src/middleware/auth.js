import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { prisma } from '../config/prisma.js';
import { HttpError, asyncHandler } from '../utils/httpError.js';

const readToken = (req) => {
  const bearer = req.headers.authorization;
  if (bearer?.startsWith('Bearer ')) return bearer.slice(7);
  return req.cookies?.[env.COOKIE_NAME];
};

async function resolveAdmin(req) {
  const token = readToken(req);
  if (!token) return null;
  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    return await prisma.admin.findUnique({
      where: { id: Number(payload.sub) },
      select: { id: true, email: true, name: true, createdAt: true },
    });
  } catch {
    return null;
  }
}

/** Wajib login admin */
export const authMiddleware = asyncHandler(async (req, _res, next) => {
  const admin = await resolveAdmin(req);
  if (!admin) throw new HttpError(401, 'Sesi tidak valid. Silakan login kembali.');
  req.admin = admin;
  next();
});

/** Login opsional: set req.admin bila token valid (untuk endpoint publik yang punya mode admin) */
export const optionalAuth = asyncHandler(async (req, _res, next) => {
  req.admin = await resolveAdmin(req);
  next();
});
