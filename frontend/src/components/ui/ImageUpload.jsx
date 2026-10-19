import { useRef, useState } from 'react';
import { ImagePlus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadApi } from '../../lib/api';
import { Button } from './Button';
import { Spinner } from './States';
import { cn, getErrorMessage, onImgError } from '../../lib/utils';

/** Kontrol input gambar: unggah file ATAU tempel URL. value/onChange bertipe string URL. */
export function ImageUpload({ label, value, onChange, error, className, aspect = 'aspect-video' }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error('Ukuran gambar maksimal 5 MB');
    setBusy(true);
    try {
      const res = await uploadApi.image(file);
      onChange(res.data.url);
      toast.success('Gambar berhasil diunggah');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Gagal mengunggah gambar'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={className}>
      {label && <span className="mb-1.5 block text-sm font-medium">{label}</span>}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className={cn('relative w-full overflow-hidden rounded-lg border border-dashed border-navy/25 bg-surface sm:w-48', aspect)}>
          {value ? (
            <img src={value} alt="Pratinjau" onError={onImgError} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-navy/40"><ImagePlus className="h-8 w-8" aria-hidden /></div>
          )}
          {busy && <div className="absolute inset-0 flex items-center justify-center bg-white/70"><Spinner className="h-7 w-7" /></div>}
        </div>
        <div className="flex-1 space-y-2">
          <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="sr-only" onChange={pick} aria-label={`Unggah ${label || 'gambar'}`} />
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()} loading={busy}>
              <ImagePlus className="h-4 w-4" /> Unggah gambar
            </Button>
            {value && (
              <Button variant="ghost" size="sm" onClick={() => onChange('')}><Trash2 className="h-4 w-4" /> Hapus</Button>
            )}
          </div>
          <input
            type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="atau tempel URL gambar (https://…)"
            aria-label="URL gambar"
            className="h-10 w-full rounded-lg border border-navy/20 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <p className="text-xs text-navy-muted">JPG, PNG, WEBP, atau GIF — maks. 5 MB.</p>
          {error && <p role="alert" className="text-xs font-medium text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
