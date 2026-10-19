import { Home } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { usePageTitle } from '../../lib/usePageTitle';

export default function NotFound() {
  usePageTitle('Halaman tidak ditemukan');
  return (
    <section className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-heading text-8xl font-extrabold text-primary/25">404</p>
      <h1 className="mt-2 text-3xl">Halaman tidak ditemukan</h1>
      <p className="mt-3 max-w-md text-navy-muted">Alamat yang Anda tuju tidak tersedia atau sudah dipindahkan.</p>
      <Button to="/" className="mt-8"><Home className="h-4 w-4" /> Kembali ke Beranda</Button>
    </section>
  );
}
