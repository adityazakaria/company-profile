import sanitizeHtml from 'sanitize-html';

const htmlOptions = {
  allowedTags: [
    'h2', 'h3', 'h4', 'p', 'br', 'hr', 'strong', 'b', 'em', 'i', 'u', 's', 'blockquote',
    'ul', 'ol', 'li', 'a', 'img', 'figure', 'figcaption', 'code', 'pre', 'table', 'thead',
    'tbody', 'tr', 'th', 'td',
  ],
  allowedAttributes: {
    a: ['href', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'title'],
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  transformTags: {
    a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer', target: '_blank' }),
  },
};

/** HTML kaya (konten berita) */
export const cleanHtml = (v) => sanitizeHtml(v ?? '', htmlOptions);

/** Teks polos: buang semua tag */
export const cleanText = (v) =>
  sanitizeHtml(v ?? '', { allowedTags: [], allowedAttributes: {} }).trim();
