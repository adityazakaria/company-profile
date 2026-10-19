import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Package, Pencil, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { AdminPageHeader, SearchBox, Th } from '../../components/admin/bits';
import { Button } from '../../components/ui/Button';
import { Badge, Card } from '../../components/ui/Card';
import { ImageUpload } from '../../components/ui/ImageUpload';
import { Checkbox, Input, Textarea } from '../../components/ui/Input';
import { ConfirmModal, Modal } from '../../components/ui/Modal';
import { Pagination } from '../../components/ui/Pagination';
import { EmptyState, ErrorState, LoadingState } from '../../components/ui/States';
import { productApi } from '../../lib/api';
import { productSchema } from '../../lib/schemas';
import { usePageTitle } from '../../lib/usePageTitle';
import { formatRupiah, getErrorMessage, onImgError, PLACEHOLDER } from '../../lib/utils';

const EMPTY = { name: '', category: '', description: '', imageUrl: '', price: '', isActive: true };

function ProductForm({ item, onClose }) {
  const qc = useQueryClient();
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: item ? { ...EMPTY, ...item, imageUrl: item.imageUrl ?? '', price: item.price != null ? String(item.price) : '' } : EMPTY,
  });

  const save = useMutation({
    mutationFn: (v) => {
      const body = { ...v, price: v.price === '' || v.price == null ? null : Number(v.price), imageUrl: v.imageUrl || null };
      return item ? productApi.update(item.id, body) : productApi.create(body);
    },
    onSuccess: (res) => {
      toast.success(res.message);
      qc.invalidateQueries({ queryKey: ['admin-products'] });
      qc.invalidateQueries({ queryKey: ['products'] });
      qc.invalidateQueries({ queryKey: ['product-categories'] });
      qc.invalidateQueries({ queryKey: ['admin-stats'] });
      onClose();
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  return (
    <Modal
      open onClose={onClose} title={item ? 'Edit Produk' : 'Tambah Produk'}
      footer={<>
        <Button variant="outline" onClick={onClose}>Batal</Button>
        <Button type="submit" form="product-form" loading={save.isPending}>Simpan</Button>
      </>}
    >
      <form id="product-form" onSubmit={handleSubmit((v) => save.mutate(v))} noValidate className="space-y-5">
        <Input label="Nama produk" required error={errors.name?.message} {...register('name')} />
        <div className="grid gap-5 sm:grid-cols-2">
          <Input label="Kategori" required placeholder="mis. Software Bisnis" error={errors.category?.message} {...register('category')} />
          <Input label="Harga (Rp)" inputMode="numeric" placeholder="kosongkan jika hubungi kami" error={errors.price?.message} {...register('price')} />
        </div>
        <Textarea label="Deskripsi" required rows={6} error={errors.description?.message} {...register('description')} />
        <Controller control={control} name="imageUrl" render={({ field }) => (
          <ImageUpload label="Gambar produk" value={field.value} onChange={field.onChange} error={errors.imageUrl?.message} aspect="aspect-[4/3]" />
        )} />
        <Checkbox label="Tampilkan di website (aktif)" {...register('isActive')} />
      </form>
    </Modal>
  );
}

export default function Products() {
  usePageTitle('Kelola Produk');
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null); // null | 'new' | product
  const [deleting, setDeleting] = useState(null);

  useEffect(() => setPage(1), [search]);

  const q = useQuery({
    queryKey: ['admin-products', page, search],
    queryFn: () => productApi.list({ page, limit: 10, search: search || undefined, all: 'true' }),
    placeholderData: keepPreviousData,
  });
  const items = q.data?.data ?? [];
  const meta = q.data?.meta;

  const del = useMutation({
    mutationFn: (id) => productApi.remove(id),
    onSuccess: (res) => {
      toast.success(res.message);
      setDeleting(null);
      qc.invalidateQueries({ queryKey: ['admin-products'] });
      qc.invalidateQueries({ queryKey: ['products'] });
      qc.invalidateQueries({ queryKey: ['admin-stats'] });
      if (items.length === 1 && page > 1) setPage(page - 1);
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  return (
    <>
      <AdminPageHeader
        title="Produk" description="Kelola katalog produk yang tampil di website."
        action={<Button onClick={() => setEditing('new')}><Plus className="h-4 w-4" /> Tambah Produk</Button>}
      />
      <div className="mb-4"><SearchBox value={search} onChange={setSearch} placeholder="Cari nama atau kategori…" /></div>

      {q.isPending ? <LoadingState /> : q.isError ? <ErrorState error={q.error} onRetry={() => q.refetch()} /> : items.length === 0 ? (
        <EmptyState
          icon={Package} title={search ? 'Produk tidak ditemukan' : 'Belum ada produk'}
          description={search ? 'Coba kata kunci lain.' : 'Mulai dengan menambahkan produk pertama Anda.'}
          action={!search && <Button onClick={() => setEditing('new')}><Plus className="h-4 w-4" /> Tambah Produk</Button>}
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="border-b border-navy/10 bg-surface"><tr>
                <Th>Produk</Th><Th>Kategori</Th><Th>Harga</Th><Th>Status</Th><Th className="text-right">Aksi</Th>
              </tr></thead>
              <tbody className="divide-y divide-navy/5">
                {items.map((p) => (
                  <tr key={p.id} className="hover:bg-surface/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.imageUrl || PLACEHOLDER} alt="" onError={onImgError} className="h-12 w-16 shrink-0 rounded-lg object-cover" />
                        <div className="min-w-0"><p className="truncate font-semibold">{p.name}</p><p className="truncate text-xs text-navy-muted">/{p.slug}</p></div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{p.category}</td>
                    <td className="whitespace-nowrap px-4 py-3">{formatRupiah(p.price)}</td>
                    <td className="px-4 py-3"><Badge tone={p.isActive ? 'green' : 'gray'}>{p.isActive ? 'Aktif' : 'Nonaktif'}</Badge></td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setEditing(p)} aria-label={`Edit ${p.name}`}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="!text-red-600 hover:!bg-red-50" onClick={() => setDeleting(p)} aria-label={`Hapus ${p.name}`}><Trash2 className="h-4 w-4" /></Button>
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

      {editing && <ProductForm item={editing === 'new' ? null : editing} onClose={() => setEditing(null)} />}
      <ConfirmModal
        open={!!deleting} onClose={() => setDeleting(null)} loading={del.isPending} onConfirm={() => del.mutate(deleting.id)}
        title="Hapus produk?" message={`Produk "${deleting?.name}" akan dihapus permanen dan tidak dapat dikembalikan.`}
      />
    </>
  );
}
