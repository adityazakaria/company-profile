import { AlertTriangle, Inbox, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { cn, getErrorMessage } from '../../lib/utils';

export function Spinner({ className }) {
  return <Loader2 className={cn('h-5 w-5 animate-spin text-primary', className)} aria-hidden />;
}

export function Skeleton({ className }) {
  return <div className={cn('animate-pulse rounded-lg bg-navy/10', className)} aria-hidden />;
}

export function LoadingState({ label = 'Memuat data…', className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-16 text-navy-muted', className)} role="status">
      <Spinner className="h-8 w-8" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function ErrorState({ error, onRetry, title = 'Gagal memuat data', className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center', className)} role="alert">
      <AlertTriangle className="h-9 w-9 text-red-600" aria-hidden />
      <h3 className="text-lg text-red-900">{title}</h3>
      <p className="max-w-md text-sm text-red-800">{getErrorMessage(error)}</p>
      {onRetry && <Button variant="outline" size="sm" onClick={onRetry}>Coba lagi</Button>}
    </div>
  );
}

export function EmptyState({ title = 'Belum ada data', description, action, icon: Icon = Inbox, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-navy/20 bg-surface/60 px-6 py-14 text-center', className)}>
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-navy/50 shadow-sm"><Icon className="h-7 w-7" aria-hidden /></span>
      <h3 className="text-lg">{title}</h3>
      {description && <p className="max-w-md text-sm text-navy-muted">{description}</p>}
      {action}
    </div>
  );
}

/** Pembungkus umum: loading → error → empty → konten */
export function QueryBoundary({ query, isEmpty, empty, skeleton, children }) {
  if (query.isPending) return skeleton ?? <LoadingState />;
  if (query.isError) return <ErrorState error={query.error} onRetry={() => query.refetch()} />;
  if (isEmpty) return empty;
  return children;
}
