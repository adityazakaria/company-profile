import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { NewsCard } from '../../components/shared';
import { Badge } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { SafeHtml } from '../../components/ui/SafeHtml';
import { ErrorState, LoadingState } from '../../components/ui/States';
import { useNewsItem } from '../../lib/queries';
import { usePageTitle } from '../../lib/usePageTitle';
import { formatDate, onImgError } from '../../lib/utils';

export default function NewsDetail() {
  const { slug } = useParams();
  const { data: n, isPending, isError, error, refetch } = useNewsItem(slug);
  usePageTitle(n?.title || 'Berita');

  if (isPending) return <LoadingState className="min-h-[60vh]" />;
  if (isError) {
    const notFound = error?.response?.status === 404;
    return (
      <div className="container py-24">
        <ErrorState error={error} title={notFound ? 'Berita tidak ditemukan' : undefined} onRetry={notFound ? undefined : refetch} />
        <div className="mt-6 text-center"><Button to="/berita" variant="outline"><ArrowLeft className="h-4 w-4" /> Kembali ke berita</Button></div>
      </div>
    );
  }

  return (
    <>
      <article>
        <header className="bg-navy text-white">
          <div className="container max-w-4xl py-12 md:py-16">
            <nav aria-label="Breadcrumb" className="mb-5 text-sm text-white/65">
              <Link to="/" className="hover:text-white">Beranda</Link><span className="mx-2" aria-hidden>/</span>
              <Link to="/berita" className="hover:text-white">Berita</Link>
            </nav>
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="!bg-primary !text-white">{n.category}</Badge>
              {!n.published && <Badge tone="amber">Draft (pratinjau admin)</Badge>}
            </div>
            <h1 className="mt-4 text-3xl leading-tight !text-white md:text-5xl">{n.title}</h1>
            <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/75">
              <span className="inline-flex items-center gap-1.5"><User className="h-4 w-4" aria-hidden />{n.author}</span>
              <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" aria-hidden />{formatDate(n.publishedAt || n.createdAt)}</span>
            </p>
          </div>
        </header>

        <div className="container max-w-4xl py-10 md:py-14">
          {n.thumbnail && (
            <img src={n.thumbnail} alt={n.title} onError={onImgError} className="mb-10 aspect-[16/9] w-full rounded-2xl object-cover shadow-card" />
          )}
          <SafeHtml html={n.content} />
          <div className="mt-12 border-t border-navy/10 pt-6">
            <Button to="/berita" variant="outline"><ArrowLeft className="h-4 w-4" /> Kembali ke berita</Button>
          </div>
        </div>
      </article>

      {n.related?.length > 0 && (
        <section className="section bg-surface pt-12 md:pt-16">
          <div className="container">
            <h2 className="mb-8 text-2xl">Berita Lainnya</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{n.related.map((r) => <NewsCard key={r.id} item={r} />)}</div>
          </div>
        </section>
      )}
    </>
  );
}
