import { useRef, useState } from 'react';
import { Bold, Eye, Heading2, Italic, Link2, List, ListOrdered, Pilcrow, Quote } from 'lucide-react';
import { SafeHtml } from '../ui/SafeHtml';
import { cn } from '../../lib/utils';

/**
 * Editor HTML sederhana: textarea + toolbar penyisip tag + pratinjau.
 * Konten disanitasi di backend (sanitize-html) dan saat ditampilkan (DOMPurify).
 */
export function HtmlEditor({ label, value, onChange, error }) {
  const ref = useRef(null);
  const [preview, setPreview] = useState(false);

  const wrap = (before, after = '', placeholder = 'teks') => {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e } = el;
    const sel = value.slice(s, e) || placeholder;
    const next = value.slice(0, s) + before + sel + after + value.slice(e);
    onChange(next);
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(s + before.length, s + before.length + sel.length); });
  };

  const tools = [
    { icon: Heading2, label: 'Subjudul', run: () => wrap('<h2>', '</h2>', 'Subjudul') },
    { icon: Pilcrow, label: 'Paragraf', run: () => wrap('<p>', '</p>', 'Paragraf baru') },
    { icon: Bold, label: 'Tebal', run: () => wrap('<strong>', '</strong>') },
    { icon: Italic, label: 'Miring', run: () => wrap('<em>', '</em>') },
    { icon: List, label: 'Daftar poin', run: () => wrap('<ul>\n  <li>', '</li>\n</ul>', 'butir') },
    { icon: ListOrdered, label: 'Daftar angka', run: () => wrap('<ol>\n  <li>', '</li>\n</ol>', 'butir') },
    { icon: Quote, label: 'Kutipan', run: () => wrap('<blockquote>', '</blockquote>', 'kutipan') },
    { icon: Link2, label: 'Tautan', run: () => { const u = window.prompt('URL tautan (https://…)'); if (u) wrap(`<a href="${u.replace(/"/g, '')}">`, '</a>'); } },
  ];

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor="html-editor" className="text-sm font-medium">{label} <span className="text-primary-dark" aria-hidden>*</span></label>
        <button type="button" onClick={() => setPreview((p) => !p)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-dark">
          <Eye className="h-4 w-4" /> {preview ? 'Kembali edit' : 'Pratinjau'}
        </button>
      </div>
      <div className={cn('overflow-hidden rounded-lg border', error ? 'border-red-500' : 'border-navy/20')}>
        {!preview && (
          <div className="flex flex-wrap gap-1 border-b border-navy/10 bg-surface p-1.5" role="toolbar" aria-label="Format teks">
            {tools.map(({ icon: Icon, label: l, run }) => (
              <button key={l} type="button" onClick={run} title={l} aria-label={l} className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-white">
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        )}
        {preview ? (
          <div className="max-h-96 min-h-48 overflow-y-auto p-4">{value.trim() ? <SafeHtml html={value} /> : <p className="text-sm text-navy-muted">Belum ada konten.</p>}</div>
        ) : (
          <textarea
            id="html-editor" ref={ref} value={value} onChange={(e) => onChange(e.target.value)} rows={12} aria-invalid={!!error}
            placeholder="<p>Tulis isi berita di sini…</p>" className="block w-full resize-y p-3.5 font-mono text-[13px] leading-6 focus:outline-none"
          />
        )}
      </div>
      <p className="mt-1 text-xs text-navy-muted">Mendukung HTML dasar (h2, p, strong, em, ul/ol, blockquote, a, img). Script & atribut berbahaya dibuang otomatis.</p>
      {error && <p role="alert" className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
