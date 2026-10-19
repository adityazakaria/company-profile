import { z } from 'zod';
import { cleanText } from '../utils/sanitize.js';

// ---------- helpers ----------
const text = (min, max, label) =>
  z.string({ required_error: `${label} wajib diisi` })
    .transform(cleanText)
    .pipe(z.string().min(min, `${label} minimal ${min} karakter`).max(max, `${label} maksimal ${max} karakter`));

const optText = (max, label) =>
  z.string().transform(cleanText).pipe(z.string().max(max, `${label} maksimal ${max} karakter`))
    .nullish().transform((v) => (v ? v : null));

/** URL http(s) atau path upload lokal */
const imageUrl = z
  .string()
  .max(500)
  .refine((v) => v === '' || /^https?:\/\//i.test(v) || v.startsWith('/'), 'URL gambar tidak valid')
  .nullish()
  .transform((v) => (v ? v : null));

const boolish = z.union([z.boolean(), z.enum(['true', 'false']).transform((v) => v === 'true')]);

// ---------- params / query ----------
export const idParam = z.object({ id: z.coerce.number().int().positive('ID tidak valid') });
export const slugParam = z.object({ slug: z.string().min(1).max(200) });

export const listQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(9),
  search: z.string().trim().max(100).optional(),
  category: z.string().trim().max(100).optional(),
  all: z.enum(['true', 'false']).optional(), // admin: sertakan yang non-aktif/draft
});

export const messageListQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().trim().max(100).optional(),
  status: z.enum(['all', 'read', 'unread']).default('all'),
});

// ---------- auth ----------
export const loginBody = z.object({
  email: z.string({ required_error: 'Email wajib diisi' }).trim().toLowerCase().email('Format email tidak valid'),
  password: z.string({ required_error: 'Password wajib diisi' }).min(1, 'Password wajib diisi').max(200),
});

// ---------- company ----------
const arr = (item, max = 30) => z.array(item).max(max).nullish();

export const companyBody = z.object({
  name: text(2, 150, 'Nama perusahaan'),
  tagline: text(2, 250, 'Tagline'),
  description: text(10, 3000, 'Deskripsi'),
  history: text(10, 6000, 'Sejarah'),
  vision: text(5, 1000, 'Visi'),
  mission: z.array(text(2, 400, 'Misi')).min(1, 'Minimal 1 misi').max(15),
  address: text(5, 400, 'Alamat'),
  phone: text(5, 40, 'Telepon'),
  email: z.string().trim().toLowerCase().email('Format email tidak valid'),
  logoUrl: imageUrl,
  heroImageUrl: imageUrl,
  aboutImageUrl: imageUrl,
  foundedYear: z.coerce.number().int().min(1800).max(2100).nullish(),
  operatingHours: optText(200, 'Jam operasional'),
  mapEmbedUrl: z.string().trim().max(1000)
    .refine((v) => v === '' || /^https:\/\//i.test(v), 'URL peta harus diawali https://')
    .nullish().transform((v) => (v ? v : null)),
  stats: arr(z.object({ label: text(1, 80, 'Label'), value: z.coerce.number(), suffix: z.string().max(10).optional().default('') })),
  coreValues: arr(z.object({ title: text(1, 80, 'Judul'), description: text(1, 400, 'Deskripsi') })),
  team: arr(z.object({ name: text(1, 100, 'Nama'), position: text(1, 100, 'Jabatan'), photoUrl: imageUrl })),
  legality: arr(z.object({ title: text(1, 120, 'Judul'), number: text(1, 120, 'Nomor'), description: optText(300, 'Deskripsi') })),
  socials: arr(z.object({
    platform: z.enum(['facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'tiktok', 'whatsapp']),
    url: z.string().trim().url('URL sosial media tidak valid').max(300),
  })),
});

// ---------- products ----------
const productFields = {
  name: text(2, 150, 'Nama produk'),
  category: text(2, 80, 'Kategori'),
  description: text(10, 5000, 'Deskripsi'),
  imageUrl,
  price: z.coerce.number().int().min(0, 'Harga tidak boleh negatif').max(2_000_000_000).nullish()
    .transform((v) => (v === undefined ? null : v)),
  isActive: boolish.default(true),
};
export const productBody = z.object(productFields);

// ---------- news ----------
export const newsBody = z.object({
  title: text(5, 200, 'Judul'),
  content: z.string({ required_error: 'Konten wajib diisi' }).min(10, 'Konten minimal 10 karakter').max(100_000),
  thumbnail: imageUrl,
  category: text(2, 80, 'Kategori'),
  author: text(2, 100, 'Penulis'),
  published: boolish.default(false),
});

// ---------- messages ----------
export const messageBody = z.object({
  name: text(2, 100, 'Nama'),
  email: z.string({ required_error: 'Email wajib diisi' }).trim().toLowerCase().email('Format email tidak valid').max(150),
  phone: z.string().trim().max(30)
    .refine((v) => v === '' || /^[0-9+()\-\s]{6,30}$/.test(v), 'Nomor telepon tidak valid')
    .nullish().transform((v) => (v ? v : null)),
  subject: text(3, 150, 'Subjek'),
  message: text(10, 3000, 'Pesan'),
  // honeypot anti-bot: harus kosong
  website: z.string().max(0).optional(),
});
