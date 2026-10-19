import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

export function AdminPageHeader({ title, description, action }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl md:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-navy-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

/** Input pencarian dengan debounce */
export function SearchBox({ value, onChange, placeholder = 'Cari…' }) {
  const [text, setText] = useState(value);
  useEffect(() => setText(value), [value]);
  useEffect(() => {
    const t = setTimeout(() => text !== value && onChange(text.trim()), 400);
    return () => clearTimeout(t);
  }, [text]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="relative w-full sm:max-w-xs">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/40" aria-hidden />
      <input
        type="search" value={text} onChange={(e) => setText(e.target.value)} placeholder={placeholder} aria-label={placeholder}
        className="h-11 w-full rounded-lg border border-navy/20 bg-white pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}

export const Th = ({ children, className = '' }) => (
  <th scope="col" className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-navy-muted ${className}`}>{children}</th>
);
