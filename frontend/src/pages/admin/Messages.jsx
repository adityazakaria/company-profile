import { useEffect, useState } from 'react';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Mail, MailOpen, Phone, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { AdminPageHeader, SearchBox } from '../../components/admin/bits';
import { Button } from '../../components/ui/Button';
import { Badge, Card } from '../../components/ui/Card';
import { ConfirmModal, Modal } from '../../components/ui/Modal';
import { Pagination } from '../../components/ui/Pagination';
import { EmptyState, ErrorState, LoadingState } from '../../components/ui/States';
import { messageApi } from '../../lib/api';
import { usePageTitle } from '../../lib/usePageTitle';
import { cn, formatDateTime, getErrorMessage } from '../../lib/utils';

const FILTERS = [{ v: 'all', l: 'Semua' }, { v: 'unread', l: 'Belum dibaca' }, { v: 'read', l: 'Sudah dibaca' }];

export default function Messages() {
  usePageTitle('Pesan Masuk');
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [open, setOpen] = useState(null);
  const [deleting, setDeleting] = useState(null);
  useEffect(() => setPage(1), [search, status]);

  const q = useQuery({
    queryKey: ['admin-messages', page, search, status],
    queryFn: () => messageApi.list({ page, limit: 10, search: search || undefined, status }),
    placeholderData: keepPreviousData,
  });
  const items = q.data?.data ?? [];
  const meta = q.data?.meta;

  const refresh = () => ['admin-messages', 'admin-unread', 'admin-stats'].forEach((k) => qc.invalidateQueries({ queryKey: [k] }));

  const mark = useMutation({
    mutationFn: ({ id, isRead }) => messageApi.markRead(id, isRead),
    onSuccess: (res) => { setOpen((o) => (o && o.id === res.data.id ? res.data : o)); refresh(); },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const del = useMutation({
    mutationFn: (id) => messageApi.remove(id),
    onSuccess: (res) => {
      toast.success(res.message); setDeleting(null); setOpen(null); refresh();
      if (items.length === 1 && page > 1) setPage(page - 1);
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const view = (m) => {
    setOpen(m);
    if (!m.isRead) mark.mutate({ id: m.id, isRead: true });
  };

  return (
    <>
      <AdminPageHeader title="Pesan Masuk" description={meta ? `${meta.unread} pesan belum dibaca` : 'Pesan dari formulir kontak.'} />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBox value={search} onChange={setSearch} placeholder="Cari pengirim atau isi pesan…" />
        <div className="flex gap-2" role="group" aria-label="Filter status">
          {FILTERS.map((f) => (
            <button key={f.v} type="button" aria-pressed={status === f.v} onClick={() => setStatus(f.v)}
              className={cn('rounded-full px-4 py-2 text-sm font-medium', status === f.v ? 'bg-navy text-white' : 'border border-navy/15 bg-white hover:bg-surface')}>
              {f.l}
            </button>
          ))}
        </div>
      </div>

      {q.isPending ? <LoadingState /> : q.isError ? <ErrorState error={q.error} onRetry={() => q.refetch()} /> : items.length === 0 ? (
        <EmptyState icon={Mail} title="Tidak ada pesan" description={search || status !== 'all' ? 'Tidak ada pesan yang cocok dengan filter.' : 'Pesan dari pengunjung akan muncul di sini.'} />
      ) : (
        <Card className="divide-y divide-navy/5 overflow-hidden">
          {items.map((m) => (
            <div key={m.id} className={cn('flex items-start gap-3 p-4 sm:p-5', !m.isRead && 'bg-primary-light/40')}>
              <button type="button" onClick={() => view(m)} className="min-w-0 flex-1 text-left" aria-label={`Buka pesan dari ${m.name}: ${m.subject}`}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={cn('truncate', m.isRead ? 'font-medium' : 'font-bold')}>{m.name}</span>
                  {!m.isRead && <Badge>Baru</Badge>}
                  <span className="text-xs text-navy-muted">{formatDateTime(m.createdAt)}</span>
                </div>
                <p className={cn('mt-1 truncate text-sm', !m.isRead && 'font-semibold')}>{m.subject}</p>
                <p className="mt-0.5 line-clamp-1 text-sm text-navy-muted">{m.message}</p>
              </button>
              <div className="flex shrink-0 gap-1">
                <Button variant="ghost" size="icon" onClick={() => mark.mutate({ id: m.id, isRead: !m.isRead })} aria-label={m.isRead ? 'Tandai belum dibaca' : 'Tandai sudah dibaca'} title={m.isRead ? 'Tandai belum dibaca' : 'Tandai sudah dibaca'}>
                  {m.isRead ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" className="!text-red-600 hover:!bg-red-50" onClick={() => setDeleting(m)} aria-label="Hapus pesan"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
        </Card>
      )}
      <Pagination className="mt-6" page={page} totalPages={meta?.totalPages} onChange={setPage} />

      <Modal
        open={!!open} onClose={() => setOpen(null)} title={open?.subject || ''}
        footer={open && <>
          <Button variant="outline" onClick={() => mark.mutate({ id: open.id, isRead: !open.isRead })}>{open.isRead ? 'Tandai belum dibaca' : 'Tandai sudah dibaca'}</Button>
          <Button href={`mailto:${open.email}?subject=${encodeURIComponent(`Re: ${open.subject}`)}`}><Mail className="h-4 w-4" /> Balas via Email</Button>
        </>}
      >
        {open && (
          <div className="space-y-4">
            <dl className="grid gap-3 rounded-xl bg-surface p-4 text-sm sm:grid-cols-2">
              <div><dt className="text-navy-muted">Nama</dt><dd className="font-semibold">{open.name}</dd></div>
              <div><dt className="text-navy-muted">Waktu</dt><dd className="font-semibold">{formatDateTime(open.createdAt)}</dd></div>
              <div><dt className="text-navy-muted">Email</dt><dd className="break-all font-semibold"><a className="text-primary-dark" href={`mailto:${open.email}`}>{open.email}</a></dd></div>
              <div><dt className="text-navy-muted">Telepon</dt><dd className="font-semibold">{open.phone ? <a className="inline-flex items-center gap-1 text-primary-dark" href={`tel:${open.phone}`}><Phone className="h-3.5 w-3.5" />{open.phone}</a> : '—'}</dd></div>
            </dl>
            {/* teks polos: React meng-escape otomatis */}
            <p className="whitespace-pre-wrap break-words leading-7">{open.message}</p>
          </div>
        )}
      </Modal>

      <ConfirmModal
        open={!!deleting} onClose={() => setDeleting(null)} loading={del.isPending} onConfirm={() => del.mutate(deleting.id)}
        title="Hapus pesan?" message={`Pesan dari ${deleting?.name} akan dihapus permanen.`}
      />
    </>
  );
}
