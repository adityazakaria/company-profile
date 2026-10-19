import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Newspaper, Search, X } from 'lucide-react';
import { CardGridSkeleton, NewsCard, PageHeader } from '../../components/shared';
import { Button } from '../../components/ui/Button';
import { Pagination } from '../../components/ui/Pagination';
import { EmptyState, ErrorState } from '../../components/ui/States';
import { useNews, useNewsCategories } from '../../lib/queries';
import { usePageTitle } from '../../lib/usePageTitle';
import { cn } from '../../lib/utils';

export default function News() {
  usePageTitle('Berita');
  const [sp, setSp] = useSearchParams();
  const page = Math.max(1, Number(sp.get('page')) || 1);
  const category = sp.get('category') || '';
  const search = sp.get('search') || '';
  const [text, setText] = useState(search);
  useEffect(() => setText(search), [search]);

  const update = (patch) => {
    const next = new URLSearchParams(sp);
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    if (!('page' in patch)) next.delete('page');
    setSp(next);
  };

  const cats = useNewsCategories();
  const q = useNews({ page, limit: 9, search: search || undefined, category: category || undefined });
  const items = q.data?.data ?? [];
  const meta = q.data?.meta;

  return (
    <>
      <PageHeader title="Berita & Artikel" description="Kabar terbaru, pengumuman, dan wawasan dari perusahaan kami." crumbs={[{ label: 'Beranda', to: '/' }, { label: 'Berita' }]} />
      <section className="section">
        <div className="container">
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <form role="search" onSubmit={(e) => { e.preventDefault(); update({ search: text.trim() }); }} className="flex w-full gap-2 lg:max-w-md">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/40" aria-hidden />
                <input
                  type="search" value={text} onChange={(e) => setText(e.target.value)} placeholder="Cari berita…" aria-label="Cari berita"
                  className="h-11 w-full rounded-lg border border-navy/20 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <Button type="submit">Cari</Button>
            </form>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter kategori">
              {[{ name: '' }, ...(cats.data ?? [])].map((c) => (
                <button
                  key={c.name || 'all'} type="button" onClick={() => update({ category: c.name })} aria-pressed={category === c.name}
                  className={cn('rounded-full px-4 py-2 text-sm font-medium transition-colors', category === c.name ? 'bg-navy text-white' : 'border border-navy/15 hover:bg-surface')}
                >
                  {c.name || 'Semua'}
                </button>
              ))}
            </div>
          </div>

          {(search || category) && (
            <p className="mb-6 flex flex-wrap items-center gap-2 text-sm text-navy-muted">
              {meta ? `${meta.total} berita ditemukan` : 'Mencari…'}
              <button type="button" onClick={() => setSp(new URLSearchParams())} className="inline-flex items-center gap-1 font-semibold text-primary-dark"><X className="h-3.5 w-3.5" /> Reset filter</button>
            </p>
          )}

          {q.isPending ? <CardGridSkeleton count={6} /> : q.isError ? (
            <ErrorState error={q.error} onRetry={() => q.refetch()} />
          ) : items.length === 0 ? (
            <EmptyState
              icon={Newspaper} title="Berita tidak ditemukan"
              description={search || category ? 'Coba kata kunci lain atau hapus filter yang aktif.' : 'Belum ada berita yang dipublikasikan.'}
              action={(search || category) && <Button variant="outline" onClick={() => setSp(new URLSearchParams())}>Reset filter</Button>}
            />
          ) : (
            <div className={cn('grid gap-6 md:grid-cols-2 lg:grid-cols-3', q.isPlaceholderData && 'opacity-60 transition-opacity')}>
              {items.map((n) => <NewsCard key={n.id} item={n} />)}
            </div>
          )}

          <Pagination className="mt-12" page={page} totalPages={meta?.totalPages} onChange={(p) => { update({ page: String(p) }); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
        </div>
      </section>
    </>
  );
}
