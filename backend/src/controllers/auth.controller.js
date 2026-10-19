import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';
import { HttpError, asyncHandler } from '../utils/httpError.js';

const cookieOptions = {
  httpOnly: true,
  secure: env.cookieSecure,
  sameSite: env.COOKIE_SAMESITE,
  path: '/',
};

// hash dummy agar waktu respons sama baik email ada maupun tidak (anti user-enumeration)
const DUMMY_HASH = bcrypt.hashSync('dummy-password', 10);

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await prisma.admin.findUnique({ where: { email } });
  const ok = await bcrypt.compare(password, admin?.password ?? DUMMY_HASH);
  if (!admin || !ok) throw new HttpError(401, 'Email atau password salah');

  const token = jwt.sign({ sub: String(admin.id) },env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
  res.cookie(env.COOKIE_NAME, token, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.json({
    success: true,
    message: 'Login berhasil',
    data: { id: admin.id, email: admin.email, name: admin.name },
  });
});

export const logout = (_req, res) => {
  res.clearCookie(env.COOKIE_NAME, cookieOptions);
  res.json({ success: true, message: 'Logout berhasil' });
};

export const me = (req, res) => res.json({ success: true, data: req.admin });
