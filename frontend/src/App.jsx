import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { PublicLayout } from './components/layout/PublicLayout';
import { AdminLayout, RequireAuth } from './components/layout/AdminLayout';
import { LoadingState } from './components/ui/States';

import Home from './pages/public/Home';
import NotFound from './pages/public/NotFound';

// Halaman lain dimuat malas (code-splitting)
const About = lazy(() => import('./pages/public/About'));
const Products = lazy(() => import('./pages/public/Products'));
const ProductDetail = lazy(() => import('./pages/public/ProductDetail'));
const News = lazy(() => import('./pages/public/News'));
const NewsDetail = lazy(() => import('./pages/public/NewsDetail'));
const Contact = lazy(() => import('./pages/public/Contact'));

const Login = lazy(() => import('./pages/admin/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminCompany = lazy(() => import('./pages/admin/Company'));
const AdminProducts = lazy(() => import('./pages/admin/Products'));
const AdminNews = lazy(() => import('./pages/admin/News'));
const AdminMessages = lazy(() => import('./pages/admin/Messages'));

export default function App() {
  return (
    <Suspense fallback={<LoadingState className="min-h-screen" />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="tentang" element={<About />} />
          <Route path="produk" element={<Products />} />
          <Route path="produk/:slug" element={<ProductDetail />} />
          <Route path="berita" element={<News />} />
          <Route path="berita/:slug" element={<NewsDetail />} />
          <Route path="kontak" element={<Contact />} />
        </Route>

        <Route path="admin/login" element={<Login />} />
        <Route path="admin" element={<RequireAuth><AdminLayout /></RequireAuth>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="company" element={<AdminCompany />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="news" element={<AdminNews />} />
          <Route path="messages" element={<AdminMessages />} />
        </Route>

        <Route element={<PublicLayout />}><Route path="*" element={<NotFound />} /></Route>
      </Routes>
    </Suspense>
  );
}
