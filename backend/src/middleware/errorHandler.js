import { ZodError } from 'zod';
import multer from 'multer';
import { Prisma } from '@prisma/client';
import { logger } from '../config/logger.js';
import { env } from '../config/env.js';

export const notFound = (req, res) =>
  res.status(404).json({ success: false, message: `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan` });

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, _next) => {
  let status = err.status || 500;
  let message = err.message || 'Terjadi kesalahan pada server';
  let details = err.details;

  if (err instanceof ZodError) {
    status = 422;
    message = 'Data tidak valid';
    details = err.issues.map((i) => ({ field: i.path.join('.'), message: i.message }));
  } else if (err instanceof multer.MulterError) {
    status = 400;
    message = err.code === 'LIMIT_FILE_SIZE' ? `Ukuran file maksimal ${env.MAX_UPLOAD_MB} MB` : err.message;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') { status = 404; message = 'Data tidak ditemukan'; }
    else if (err.code === 'P2002') { status = 409; message = 'Data sudah ada (duplikat)'; }
  } else if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Format JSON tidak valid';
  }

  if (status >= 500) logger.error(`${req.method} ${req.originalUrl} → ${err.stack || err}`);
  else logger.debug(`${req.method} ${req.originalUrl} → ${status} ${message}`);

  res.status(status).json({
    success: false,
    message: status >= 500 && env.isProd ? 'Terjadi kesalahan pada server' : message,
    ...(details ? { errors: details } : {}),
  });
};
