import slugify from 'slugify';

export const toSlug = (text) =>
  slugify(text, { lower: true, strict: true, trim: true }) || 'item';

/**
 * Buat slug unik untuk sebuah model Prisma.
 * @param delegate prisma.product | prisma.news
 */
export async function uniqueSlug(delegate, text, ignoreId) {
  const base = toSlug(text);
  let slug = base;
  let i = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const found = await delegate.findUnique({ where: { slug } });
    if (!found || found.id === ignoreId) return slug;
    i += 1;
    slug = `${base}-${i}`;
  }
}
