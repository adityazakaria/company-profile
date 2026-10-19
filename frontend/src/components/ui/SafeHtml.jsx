import { useMemo } from 'react';
import DOMPurify from 'dompurify';
import { cn } from '../../lib/utils';

// Semua link dari konten dibuka di tab baru dengan rel aman
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

export const sanitize = (html) =>
  DOMPurify.sanitize(html ?? '', { USE_PROFILES: { html: true }, FORBID_TAGS: ['style', 'form', 'input', 'iframe'], FORBID_ATTR: ['style'] });

export function SafeHtml({ html, className }) {
  const clean = useMemo(() => sanitize(html), [html]);
  return <div className={cn('prose-content', className)} dangerouslySetInnerHTML={{ __html: clean }} />;
}
