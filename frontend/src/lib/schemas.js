import { z } from 'zod';

const req = (label, min = 1, max = 500) =>
  z.string({ required_error: `${label} wajib diisi` }).trim()
    .min(min, min === 1 ? `${label} wajib diisi` : `${label} minimal ${min} karakter`)
    .max(max, `${label} maksimal ${max} karakter`);

const optUrl = z.string().trim().refine((v) => !v || /^https?:\/\//i.test(v) || v.startsWith('/'), 'URL tidak valid').optional();

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email wajib diisi').email('Format email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
});

export const contactSchema = z.object({
  name: req('Nama', 2, 100),
  email: z.string().trim().min(1, 'Email wajib diisi').email('Format email tidak valid'),
  phone: z.string().trim().refine((v) => !v || /^[0-9+()\-\s]{6,30}$/.test(v), 'Nomor telepon tidak valid').optional(),
  subject: req('Subjek', 3, 150),
  message: req('Pesan', 10, 3000),
  website: z.string().max(0).optional(), // honeypot
});

export const productSchema = z.object({
  name: req('Nama produk', 2, 150),
  category: req('Kategori', 2, 80),
  description: req('Deskripsi', 10, 5000),
  imageUrl: optUrl,
  price: z.string().trim().refine((v) => v === '' || (/^\d+$/.test(v) && Number(v) <= 2_000_000_000), 'Harga harus berupa angka bulat (Rupiah)').optional(),
  isActive: z.boolean(),
});

export const newsSchema = z.object({
  title: req('Judul', 5, 200),
  category: req('Kategori', 2, 80),
  author: req('Penulis', 2, 100),
  thumbnail: optUrl,
  content: req('Konten', 10, 100000),
  published: z.boolean(),
});

const textItem = z.object({ value: req('Isi', 2, 400) });

export const companySchema = z.object({
  name: req('Nama perusahaan', 2, 150),
  tagline: req('Tagline', 2, 250),
  description: req('Deskripsi', 10, 3000),
  history: req('Sejarah', 10, 6000),
  vision: req('Visi', 5, 1000),
  mission: z.array(textItem).min(1, 'Minimal 1 misi'),
  address: req('Alamat', 5, 400),
  phone: req('Telepon', 5, 40),
  email: z.string().trim().min(1, 'Email wajib diisi').email('Format email tidak valid'),
  operatingHours: z.string().trim().max(200).optional(),
  foundedYear: z.string().trim().refine((v) => !v || (/^\d{4}$/.test(v) && Number(v) >= 1800), 'Tahun tidak valid').optional(),
  mapEmbedUrl: z.string().trim().refine((v) => !v || /^https:\/\//i.test(v), 'Harus diawali https://').optional(),
  logoUrl: optUrl,
  heroImageUrl: optUrl,
  aboutImageUrl: optUrl,
  stats: z.array(z.object({ label: req('Label', 1, 80), value: z.string().trim().regex(/^\d+(\.\d+)?$/, 'Angka tidak valid'), suffix: z.string().max(10).optional() })),
  coreValues: z.array(z.object({ title: req('Judul', 1, 80), description: req('Deskripsi', 1, 400) })),
  team: z.array(z.object({ name: req('Nama', 1, 100), position: req('Jabatan', 1, 100), photoUrl: optUrl })),
  legality: z.array(z.object({ title: req('Judul', 1, 120), number: req('Nomor', 1, 120), description: z.string().max(300).optional() })),
  socials: z.array(z.object({ platform: z.string().min(1), url: z.string().trim().url('URL tidak valid') })),
});
