import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true, // kirim cookie httpOnly JWT
  timeout: 15000,
});

const unwrap = (res) => res.data;

export const authApi = {
  login: (body) => api.post('/auth/login', body).then(unwrap),
  logout: () => api.post('/auth/logout').then(unwrap),
  me: () => api.get('/auth/me').then(unwrap),
};

export const companyApi = {
  get: () => api.get('/company').then(unwrap),
  update: (body) => api.put('/company', body).then(unwrap),
};

export const productApi = {
  list: (params) => api.get('/products', { params }).then(unwrap),
  categories: () => api.get('/products/categories').then(unwrap),
  get: (slug) => api.get(`/products/${slug}`).then(unwrap),
  create: (body) => api.post('/products', body).then(unwrap),
  update: (id, body) => api.put(`/products/${id}`, body).then(unwrap),
  remove: (id) => api.delete(`/products/${id}`).then(unwrap),
};

export const newsApi = {
  list: (params) => api.get('/news', { params }).then(unwrap),
  categories: () => api.get('/news/categories').then(unwrap),
  get: (slug) => api.get(`/news/${slug}`).then(unwrap),
  create: (body) => api.post('/news', body).then(unwrap),
  update: (id, body) => api.put(`/news/${id}`, body).then(unwrap),
  remove: (id) => api.delete(`/news/${id}`).then(unwrap),
};

export const messageApi = {
  send: (body) => api.post('/messages', body).then(unwrap),
  list: (params) => api.get('/messages', { params }).then(unwrap),
  markRead: (id, isRead = true) => api.patch(`/messages/${id}/read`, { isRead }).then(unwrap),
  remove: (id) => api.delete(`/messages/${id}`).then(unwrap),
};

export const statsApi = { get: () => api.get('/stats').then(unwrap) };

export const uploadApi = {
  image: (file) => {
    const fd = new FormData();
    fd.append('image', file);
    return api.post('/upload', fd).then(unwrap);
  },
};
