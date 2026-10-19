import { Router } from 'express';
import { authMiddleware, optionalAuth } from '../middleware/auth.js';
import { validateRequest as v } from '../middleware/validateRequest.js';
import { loginLimiter, contactLimiter } from '../middleware/rateLimiter.js';
import { uploadImage } from '../middleware/upload.js';
import * as val from '../validators/index.js';
import * as auth from '../controllers/auth.controller.js';
import * as company from '../controllers/company.controller.js';
import * as product from '../controllers/product.controller.js';
import * as news from '../controllers/news.controller.js';
import * as message from '../controllers/message.controller.js';
import { uploadFile } from '../controllers/upload.controller.js';
import { dashboardStats } from '../controllers/stats.controller.js';

const r = Router();

r.get('/health', (_req, res) => res.json({ success: true, status: 'ok', time: new Date().toISOString() }));

// Auth
r.post('/auth/login', loginLimiter, v({ body: val.loginBody }), auth.login);
r.post('/auth/logout', auth.logout);
r.get('/auth/me', authMiddleware, auth.me);

// Company
r.get('/company', company.getCompany);
r.put('/company', authMiddleware, v({ body: val.companyBody }), company.updateCompany);

// Products
r.get('/products', optionalAuth, v({ query: val.listQuery }), product.listProducts);
r.get('/products/categories', product.listProductCategories);
r.get('/products/:slug', optionalAuth, v({ params: val.slugParam }), product.getProduct);
r.post('/products', authMiddleware, v({ body: val.productBody }), product.createProduct);
r.put('/products/:id', authMiddleware, v({ params: val.idParam, body: val.productBody }), product.updateProduct);
r.delete('/products/:id', authMiddleware, v({ params: val.idParam }), product.deleteProduct);

// News
r.get('/news', optionalAuth, v({ query: val.listQuery }), news.listNews);
r.get('/news/categories', news.listNewsCategories);
r.get('/news/:slug', optionalAuth, v({ params: val.slugParam }), news.getNews);
r.post('/news', authMiddleware, v({ body: val.newsBody }), news.createNews);
r.put('/news/:id', authMiddleware, v({ params: val.idParam, body: val.newsBody }), news.updateNews);
r.delete('/news/:id', authMiddleware, v({ params: val.idParam }), news.deleteNews);

// Messages
r.post('/messages', contactLimiter, v({ body: val.messageBody }), message.createMessage);
r.get('/messages', authMiddleware, v({ query: val.messageListQuery }), message.listMessages);
r.patch('/messages/:id/read', authMiddleware, v({ params: val.idParam }), message.markRead);
r.delete('/messages/:id', authMiddleware, v({ params: val.idParam }), message.deleteMessage);

// Upload & stats
r.post('/upload', authMiddleware, uploadImage, uploadFile);
r.get('/stats', authMiddleware, dashboardStats);

export default r;
