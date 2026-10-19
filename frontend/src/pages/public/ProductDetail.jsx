import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { PageHeader, ProductCard } from '../../components/shared';
import { Badge } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ErrorState, LoadingState } from '../../components/ui/States';
import { useProduct } from '../../lib/queries';
import { usePageTitle } from '../../lib/usePageTitle';
import { formatDate, formatRupiah, onImgError, PLACEHOLDER } from '../../lib/utils';

export default function ProductDetail() {
  const { slug } = useParams();
  const { data: p, isPending, isError, error, refetch } = useProduct(slug);
  usePageTitle(p?.name || 'Detail Produk');

  if (isPending) return <LoadingState className="min-h-[60vh]" />;
  if (isError) {
    const notFound = error?.response?.status === 404;
    return (
      <div className="container py-24">
        <ErrorState error={error} title={notFound ? 'Produk tidak ditemukan' : undefined} onRetry={notFound ? undefined : refetch} />
        <div className="mt-6 text-center"><Button to="/produk" variant="outline"><ArrowLeft className="h-4 w-4" /> Kembali ke produk</Button></div>
      </div>
    );
  }

  return (
    <>
      <PageHeader title={p.name} crumbs={[{ label: 'Beranda', to: '/' }, { label: 'Produk', to: '/produk' }, { label: p.name }]} />
      <section className="section">
        <div className="container grid gap-10 lg:grid-cols-2 lg:gap-14">
          <img src={p.imageUrl || PLACEHOLDER} alt={p.name} onError={onImgError} className="aspect-[4/3] w-full rounded-3xl object-cover shadow-card" />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{p.category}</Badge>
              {!p.isActive && <Badge tone="amber">Nonaktif (pratinjau admin)</Badge>}
            </div>
            <h2 className="mt-4 text-3xl md:text-4xl">{p.name}</h2>
            <p className="mt-4 font-heading text-2xl font-bold text-primary-dark">{p.price != null ? `Mulai ${formatRupiah(p.price)}` : 'Hubungi kami untuk harga'}</p>
            <div className="mt-6 space-y-4 whitespace-pre-line leading-8 text-navy-muted">{p.description}</div>
            <dl className="mt-6 grid grid-cols-2 gap-4 rounded-2xl bg-surface p-5 text-sm">
              <div><dt className="text-navy-muted">Kategori</dt><dd className="font-semibold">{p.category}</dd></div>
              <div><dt className="text-navy-muted">Diperbarui</dt><dd className="font-semibold">{formatDate(p.updatedAt)}</dd></div>
            </dl>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button to={`/kontak?subjek=${encodeURIComponent(`Permintaan informasi ${p.name}`)}`} size="lg"><MessageSquare className="h-5 w-5" /> Tanya Produk Ini</Button>
              <Button to="/produk" variant="outline" size="lg"><ArrowLeft className="h-4 w-4" /> Semua Produk</Button>
            </div>
          </div>
        </div>
      </section>

      {p.related?.length > 0 && (
        <section className="section bg-surface pt-12 md:pt-16">
          <div className="container">
            <h2 className="mb-8 text-2xl">Produk Terkait</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{p.related.map((r) => <ProductCard key={r.id} product={r} />)}</div>
          </div>
        </section>
      )}
    </>
  );
}
