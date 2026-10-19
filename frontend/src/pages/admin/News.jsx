import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Newspaper, Pencil, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { AdminPageHeader, SearchBox, Th } from '../../components/admin/bits';
import { HtmlEditor } from '../../components/admin/HtmlEditor';
import { Button } from '../../components/ui/Button';
import { Badge, Card } from '../../components/ui/Card';
import { ImageUpload } from '../../components/ui/ImageUpload';
import { Checkbox, Input } from '../../components/ui/Input';
import { ConfirmModal, Modal } from '../../components/ui/Modal';
import { Pagination } from '../../components/ui/Pagination';
import { EmptyState, ErrorState, LoadingState } from '../../components/ui/States';
import { newsApi } from '../../lib/api';
import { newsSchema } from '../../lib/schemas';
import { usePageTitle } from '../../lib/usePageTitle';
import { formatDate, getErrorMessage, onImgError, PLACEHOLDER } from '../../lib/utils';

const EMPTY = { title: '', category: '', author: '', thumbnail: '', content: '', published: false };

function NewsForm({ item, onClose }) {
  const qc = useQueryClient();
  // daftar tidak memuat konten penuh → ambil detail saat edit
  const detail = useQuery({
    queryKey: ['admin-news-detail', item?.slug],
    queryFn: () => newsApi.get(item.slug),
    select: (r) => r.data,
    enabled: !!item,
  });

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(newsSchema),
    defaultValues: EMPTY,
  });

  useEffect(() => {
    if (detail.data) reset({ ...EMPTY, ...detail.data, thumbnail: detail.data.thumbnail ?? '' });
  }, [detail.data, reset]);

  const save = useMutation({
    mutationFn: (v) => {
      const body = { ...v, thumbnail: v.thumbnail || null };
      return item ? newsApi.update(item.id, body) : newsApi.create(body);
    },
    onSuccess: (res) => {
      toast.success(res.message);
      ['admin-news', 'news', 'news-item', 'news-categories', 'admin-stats'].forEach((k) => qc.invalidateQueries({ queryKey: [k] }));
      onClose();
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  return (
    <Modal
      open onClose={onClose} size="lg" title={item ? 'Edit Berita' : 'Tambah Berita'}
      footer={<>
        <Button variant="outline" onClick={onClose}>Batal</Button>
        <Button type="submit" form="news-form" loading={save.isPending} disabled={!!item && !detail.data}>Simpan</Button>
      </>}
    >
      {item && detail.isPending ? <LoadingState /> : item && detail.isError ? <ErrorState error={detail.error} onRetry={() => detail.refetch()} /> : (
        <form id="news-form" onSubmit={handleSubmit((v) => save.mutate(v))} noValidate className="space-y-5">
          <Input label="Judul" required error={errors.title?.message} {...register('title')} />
          <div className="grid gap-5 sm:grid-cols-2">
            <Input label="Kategori" required placeholder="mis. Produk" error={errors.category?.message} {...register('category')} />
            <Input label="Penulis" required error={errors.author?.message} {...register('author')} />
          </div>
          <Controller control={control} name="thumbnail" render={({ field }) => (
            <ImageUpload label="Thumbnail" value={field.value} onChange={field.onChange} error={errors.thumbnail?.message} aspect="aspect-[16/10]" />
          )} />
          <Controller control={control} name="content" render={({ field }) => (
            <HtmlEditor label="Konten" value={field.value} onChange={field.onChange} error={errors.content?.message} />
          )} />
          <Checkbox label="Terbitkan (tampil di website)" {...register('published')} />
        </form>
      )}
    </Modal>
  );
}

export default function News() {
  usePageTitle('Kelola Berita');
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  useEffect(() => setPage(1), [search]);

  const q = useQuery({
    queryKey: ['admin-news', page, search],
    queryFn: () => newsApi.list({ page, limit: 10, search: search || undefined, all: 'true' }),
    placeholderData: keepPreviousData,
  });
  const items = q.data?.data ?? [];
  const meta = q.data?.meta;

  const del = useMutation({
    mutationFn: (id) => newsApi.remove(id),
    onSuccess: (res) => {
      toast.success(res.message);
      setDeleting(null);
      ['admin-news', 'news', 'admin-stats'].forEach((k) => qc.invalidateQueries({ queryKey: [k] }));
      if (items.length === 1 && page > 1) setPage(page - 1);
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  return (
    <>
      <AdminPageHeader
        title="Berita" description="Tulis dan kelola berita serta artikel perusahaan."
        action={<Button onClick={() => setEditing('new')}><Plus className="h-4 w-4" /> Tambah Berita</Button>}
      />
      <div className="mb-4"><SearchBox value={search} onChange={setSearch} placeholder="Cari judul atau isi berita…" /></div>

      {q.isPending ? <LoadingState /> : q.isError ? <ErrorState error={q.error} onRetry={() => q.refetch()} /> : items.length === 0 ? (
        <EmptyState
          icon={Newspaper} title={search ? 'Berita tidak ditemukan' : 'Belum ada berita'}
          description={search ? 'Coba kata kunci lain.' : 'Mulai dengan menulis berita pertama Anda.'}
          action={!search && <Button onClick={() => setEditing('new')}><Plus className="h-4 w-4" /> Tambah Berita</Button>}
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-sm">
              <thead className="border-b border-navy/10 bg-surface"><tr>
                <Th>Berita</Th><Th>Kategori</Th><Th>Tanggal</Th><Th>Status</Th><Th className="text-right">Aksi</Th>
              </tr></thead>
              <tbody className="divide-y divide-navy/5">
                {items.map((n) => (
                  <tr key={n.id} className="hover:bg-surface/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={n.thumbnail || PLACEHOLDER} alt="" onError={onImgError} className="h-12 w-16 shrink-0 rounded-lg object-cover" />
                        <div className="min-w-0"><p className="line-clamp-2 font-semibold">{n.title}</p><p className="text-xs text-navy-muted">oleh {n.author}</p></div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{n.category}</td>
                    <td className="whitespace-nowrap px-4 py-3">{formatDate(n.publishedAt || n.createdAt, { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td className="px-4 py-3"><Badge tone={n.published ? 'green' : 'gray'}>{n.published ? 'Terbit' : 'Draft'}</Badge></td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setEditing(n)} aria-label={`Edit ${n.title}`}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="!text-red-600 hover:!bg-red-50" onClick={() => setDeleting(n)} aria-label={`Hapus ${n.title}`}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      <Pagination className="mt-6" page={page} totalPages={meta?.totalPages} onChange={setPage} />

      {editing && <NewsForm item={editing === 'new' ? null : editing} onClose={() => setEditing(null)} />}
      <ConfirmModal
        open={!!deleting} onClose={() => setDeleting(null)} loading={del.isPending} onConfirm={() => del.mutate(deleting.id)}
        title="Hapus berita?" message={`Berita "${deleting?.title}" akan dihapus permanen dan tidak dapat dikembalikan.`}
      />
    </>
  );
}
