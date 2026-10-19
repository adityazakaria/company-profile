import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import routes from './routes/index.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { UPLOAD_DIR } from './middleware/upload.js';
import { HttpError } from './utils/httpError.js';

const app = express();

app.set('trust proxy', 1); // di balik reverse proxy (nginx, dll) agar rate-limit memakai IP asli
app.disable('x-powered-by');

app.use(
  helmet({
    // gambar upload boleh dimuat oleh frontend di origin berbeda
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);

app.use(
  cors({
    origin(origin, cb) {
      // izinkan request tanpa Origin (curl/Postman/server-to-server) dan origin dalam whitelist
      if (!origin || env.corsOrigins.includes(origin)) return cb(null, true);
      return cb(new HttpError(403, 'Origin tidak diizinkan oleh CORS'));
    },
    credentials: true,
  }),
);

app.use(morgan(env.isProd ? 'combined' : 'dev', { stream: { write: (m) => logger.http?.(m.trim()) ?? logger.info(m.trim()) } }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

app.use('/uploads', express.static(UPLOAD_DIR, { maxAge: '7d', index: false }));
app.use('/api', apiLimiter, routes);

app.use(notFound);
app.use(errorHandler);

export default app;
