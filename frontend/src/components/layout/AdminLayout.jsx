import { useEffect, useState } from 'react';
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Building2, ExternalLink, LayoutDashboard, LogOut, Mail, Menu, Newspaper, Package, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { LoadingState } from '../ui/States';
import { messageApi } from '../../lib/api';
import { useAuth } from '../../lib/useAuth';
import { cn } from '../../lib/utils';

const LINKS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/company', label: 'Profil Perusahaan', icon: Building2 },
  { to: '/admin/products', label: 'Produk', icon: Package },
  { to: '/admin/news', label: 'Berita', icon: Newspaper },
  { to: '/admin/messages', label: 'Pesan Masuk', icon: Mail, badge: true },
];

export function RequireAuth({ children }) {
  const { admin, loading } = useAuth();
  const location = useLocation();
  if (loading) return <LoadingState className="min-h-screen" label="Memeriksa sesi…" />;
  if (!admin) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  return children;
}

export function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const unread = useQuery({
    queryKey: ['admin-unread'],
    queryFn: () => messageApi.list({ limit: 1, status: 'unread' }),
    select: (r) => r.meta?.unread ?? 0,
    refetchInterval: 60_000,
  });

  const doLogout = async () => { await logout(); navigate('/admin/login', { replace: true }); };

  const sidebar = (
    <div className="flex h-full flex-col bg-navy text-white">
      <div className="flex h-[72px] items-center justify-between border-b border-white/10 px-5">
        <Link to="/admin/dashboard" className="flex items-center gap-2.5 font-heading font-bold">
          <img src="/company-logo.png" alt="" className="h-10 w-20 rounded-lg bg-white object-cover object-center" /> Panel Admin
        </Link>
        <Button variant="ghost" size="icon" className="!text-white lg:hidden" onClick={() => setOpen(false)} aria-label="Tutup menu"><X className="h-5 w-5" /></Button>
      </div>
      <nav aria-label="Menu admin" className="flex-1 space-y-1 p-3">
        {LINKS.map(({ to, label, icon: Icon, badge }) => (
          <NavLink
            key={to} to={to}
            className={({ isActive }) => cn('flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors', isActive ? 'bg-primary text-white' : 'text-white/75 hover:bg-white/10 hover:text-white')}
          >
            <Icon className="h-5 w-5" aria-hidden /> <span className="flex-1">{label}</span>
            {badge && unread.data > 0 && <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-primary-dark">{unread.data}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="space-y-1 border-t border-white/10 p-3">
        <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-white/75 hover:bg-white/10 hover:text-white">
          <ExternalLink className="h-5 w-5" aria-hidden /> Lihat Website
        </a>
        <button type="button" onClick={doLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-white/75 hover:bg-white/10 hover:text-white">
          <LogOut className="h-5 w-5" aria-hidden /> Keluar
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">{sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy/60" onClick={() => setOpen(false)} aria-hidden />
          <aside className="relative h-full w-72 max-w-[85vw]">{sidebar}</aside>
        </div>
      )}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between gap-3 border-b border-navy/10 bg-white px-4 sm:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)} aria-label="Buka menu"><Menu className="h-6 w-6" /></Button>
          <div className="ml-auto text-right text-sm leading-tight">
            <p className="font-semibold">{admin?.name}</p>
            <p className="text-xs text-navy-muted">{admin?.email}</p>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
