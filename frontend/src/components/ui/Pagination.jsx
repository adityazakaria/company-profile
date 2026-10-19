import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

function range(page, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, total, page - 1, page, page + 1]);
  const pages = [...set].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out = [];
  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) out.push('…');
    out.push(p);
  });
  return out;
}

export function Pagination({ page, totalPages, onChange, className }) {
  if (!totalPages || totalPages <= 1) return null;
  const btn = 'inline-flex h-10 min-w-10 items-center justify-center rounded-lg px-3 text-sm font-medium transition-colors';
  return (
    <nav aria-label="Navigasi halaman" className={cn('flex flex-wrap items-center justify-center gap-1.5', className)}>
      <button
        type="button" className={cn(btn, 'border border-navy/15 hover:bg-surface disabled:opacity-40')}
        disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Halaman sebelumnya"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {range(page, totalPages).map((p, i) =>
        p === '…' ? (
          <span key={`e${i}`} className="px-1 text-navy/40" aria-hidden>…</span>
        ) : (
          <button
            key={p} type="button" onClick={() => onChange(p)} aria-current={p === page ? 'page' : undefined}
            className={cn(btn, p === page ? 'bg-navy text-white' : 'border border-navy/15 hover:bg-surface')}
          >
            {p}
          </button>
        ),
      )}
      <button
        type="button" className={cn(btn, 'border border-navy/15 hover:bg-surface disabled:opacity-40')}
        disabled={page >= totalPages} onClick={() => onChange(page + 1)} aria-label="Halaman berikutnya"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
