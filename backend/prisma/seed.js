import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const img = (seed, w = 800, h = 600) => `https://picsum.photos/seed/${seed}/${w}/${h}`;
const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

const company = {
  name: 'PT Nusa Karya Teknologi',
  tagline: 'Mitra Transformasi Digital untuk Bisnis Indonesia',
  description:
    'PT Nusa Karya Teknologi adalah perusahaan penyedia solusi teknologi informasi yang membantu bisnis berbagai skala meningkatkan efisiensi, keamanan, dan daya saing melalui perangkat lunak, infrastruktur cloud, dan layanan konsultasi yang andal.',
  history:
    'Berawal dari tim kecil beranggotakan lima insinyur di Bandung pada tahun 2010, Nusa Karya Teknologi mulai dengan mengembangkan sistem kasir untuk usaha ritel lokal. Kepercayaan pelanggan mendorong kami memperluas portofolio ke sistem ERP pada 2014, kemudian membuka kantor pusat di Jakarta pada 2017. Memasuki 2020, kami meluncurkan layanan cloud dan keamanan siber untuk mendukung percepatan digitalisasi nasional. Hari ini, lebih dari 450 perusahaan di seluruh Indonesia mengandalkan solusi kami.\n\nSetiap tahap pertumbuhan kami berpijak pada prinsip yang sama: memahami kebutuhan nyata pelanggan, membangun produk yang sederhana digunakan, dan hadir untuk mendukung setelah implementasi.',
  vision: 'Menjadi perusahaan teknologi terpercaya di Asia Tenggara yang mendorong pertumbuhan bisnis berkelanjutan melalui inovasi digital.',
  mission: [
    'Menyediakan produk dan layanan teknologi berkualitas tinggi yang mudah diadopsi pelanggan.',
    'Membangun kemitraan jangka panjang berdasarkan transparansi, integritas, dan hasil nyata.',
    'Mengembangkan talenta digital Indonesia melalui budaya belajar dan kolaborasi.',
    'Menjaga keamanan data dan keberlanjutan layanan sebagai prioritas utama.',
  ],
  address: 'Gedung Menara Nusantara Lt. 12, Jl. Jenderal Sudirman Kav. 45, Jakarta Selatan 12930',
  phone: '+62 21 5555 0123',
  email: 'halo@nusakarya.co.id',
  logoUrl: null,
  heroImageUrl: img('nkt-hero', 1600, 900),
  aboutImageUrl: img('nkt-about', 900, 700),
  foundedYear: 2010,
  operatingHours: 'Senin – Jumat, 08.00 – 17.00 WIB',
  mapEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.2!2d106.8227!3d-6.2297!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTMnNDYuOSJTIDEwNsKwNDknMjEuNyJF!5e0!3m2!1sid!2sid!4v1700000000000',
  stats: [
    { label: 'Tahun Pengalaman', value: 15, suffix: '+' },
    { label: 'Klien Perusahaan', value: 450, suffix: '+' },
    { label: 'Proyek Selesai', value: 1200, suffix: '+' },
    { label: 'Tingkat Kepuasan', value: 98, suffix: '%' },
  ],
  coreValues: [
    { title: 'Integritas', description: 'Jujur dalam setiap komunikasi dan konsisten menepati komitmen kepada pelanggan.' },
    { title: 'Inovasi', description: 'Terus mencari cara yang lebih baik untuk menyelesaikan masalah bisnis pelanggan.' },
    { title: 'Kolaborasi', description: 'Bekerja bersama pelanggan dan rekan tim sebagai satu kesatuan.' },
    { title: 'Keunggulan', description: 'Menjaga standar kualitas tinggi pada setiap produk dan layanan.' },
    { title: 'Tanggung Jawab', description: 'Menjaga keamanan data dan dampak positif bagi masyarakat.' },
    { title: 'Kepedulian', description: 'Mendengarkan dan memahami kebutuhan pelanggan secara mendalam.' },
  ],
  team: [
    { name: 'Rahmat Hidayat', position: 'Direktur Utama', photoUrl: img('team-rahmat', 400, 400) },
    { name: 'Dewi Anggraeni', position: 'Direktur Teknologi', photoUrl: img('team-dewi', 400, 400) },
    { name: 'Budi Santoso', position: 'Direktur Operasional', photoUrl: img('team-budi', 400, 400) },
    { name: 'Maya Kusuma', position: 'Kepala Pemasaran', photoUrl: img('team-maya', 400, 400) },
    { name: 'Andika Pratama', position: 'Kepala Keamanan Informasi', photoUrl: img('team-andika', 400, 400) },
    { name: 'Siti Rahayu', position: 'Kepala Layanan Pelanggan', photoUrl: img('team-siti', 400, 400) },
  ],
  legality: [
    { title: 'Akta Pendirian Perseroan', number: 'No. 12 tanggal 14 Maret 2010', description: 'Notaris Hendra Wijaya, S.H., M.Kn.' },
    { title: 'SK Kemenkumham', number: 'AHU-0012345.AH.01.01.Tahun 2010', description: 'Pengesahan badan hukum Perseroan Terbatas.' },
    { title: 'NIB (Nomor Induk Berusaha)', number: '1234567890123', description: 'Terdaftar pada sistem OSS RBA.' },
    { title: 'NPWP Perusahaan', number: '01.234.567.8-012.000', description: 'Terdaftar di KPP Pratama Jakarta Setiabudi.' },
    { title: 'Sertifikasi ISO/IEC 27001', number: 'ISMS-ID-2023-0456', description: 'Sistem manajemen keamanan informasi.' },
  ],
  socials: [
    { platform: 'facebook', url: 'https://facebook.com/nusakaryateknologi' },
    { platform: 'instagram', url: 'https://instagram.com/nusakaryateknologi' },
    { platform: 'linkedin', url: 'https://linkedin.com/company/nusakaryateknologi' },
    { platform: 'youtube', url: 'https://youtube.com/@nusakaryateknologi' },
  ],
};

const products = [
  {
    name: 'NusaERP', slug: 'nusaerp', category: 'Software Bisnis', price: 25000000,
    description:
      'Sistem perencanaan sumber daya perusahaan terpadu yang mengelola keuangan, persediaan, pembelian, penjualan, dan SDM dalam satu platform. Modul dapat disesuaikan dengan proses bisnis Anda, dilengkapi laporan real-time dan dasbor eksekutif.',
    imageUrl: img('nusaerp'),
  },
  {
    name: 'NusaPOS', slug: 'nusapos', category: 'Software Bisnis', price: 1500000,
    description:
      'Aplikasi kasir modern untuk ritel, restoran, dan kafe. Mendukung multi-outlet, manajemen stok otomatis, pembayaran QRIS dan kartu, serta tetap berjalan saat koneksi internet terputus.',
    imageUrl: img('nusapos'),
  },
  {
    name: 'NusaSense', slug: 'nusasense', category: 'Internet of Things', price: 12500000,
    description:
      'Platform IoT untuk pemantauan suhu, kelembapan, energi, dan aset secara real-time. Cocok untuk pabrik, gudang rantai dingin, dan gedung pintar dengan notifikasi otomatis ketika terjadi anomali.',
    imageUrl: img('nusasense'),
  },
  {
    name: 'NusaCloud', slug: 'nusacloud', category: 'Infrastruktur', price: 3500000,
    description:
      'Layanan cloud hosting dan server terkelola dengan pusat data di Indonesia. Uptime 99,9%, pencadangan harian otomatis, dan dukungan teknis 24/7 untuk menjaga aplikasi bisnis Anda tetap berjalan.',
    imageUrl: img('nusacloud'),
  },
  {
    name: 'NusaShield', slug: 'nusashield', category: 'Keamanan Siber', price: 18000000,
    description:
      'Paket keamanan siber komprehensif: pemantauan ancaman 24/7, uji penetrasi berkala, perlindungan endpoint, dan pelatihan kesadaran keamanan untuk karyawan. Membantu Anda memenuhi kepatuhan UU Pelindungan Data Pribadi.',
    imageUrl: img('nusashield'),
  },
];

const news = [
  {
    title: 'Nusa Karya Teknologi Raih Sertifikasi ISO/IEC 27001:2022',
    slug: 'nusa-karya-teknologi-raih-sertifikasi-iso-27001',
    category: 'Penghargaan', author: 'Tim Humas', thumbnail: img('news-iso', 1000, 600), daysAgo: 3,
    content:
      '<p>Jakarta — PT Nusa Karya Teknologi resmi memperoleh sertifikasi <strong>ISO/IEC 27001:2022</strong> untuk sistem manajemen keamanan informasi setelah melalui audit independen selama tiga bulan.</p><p>Sertifikasi ini mencakup seluruh layanan cloud dan pengembangan perangkat lunak perusahaan, dan menegaskan komitmen kami dalam melindungi data pelanggan.</p><h2>Apa artinya bagi pelanggan?</h2><ul><li>Proses pengelolaan data yang teruji dan terdokumentasi.</li><li>Penanganan insiden keamanan yang lebih cepat dan terukur.</li><li>Kemudahan memenuhi persyaratan kepatuhan dalam audit pelanggan.</li></ul><blockquote>"Keamanan bukan fitur tambahan, melainkan fondasi dari setiap produk yang kami bangun," ujar Andika Pratama, Kepala Keamanan Informasi.</blockquote>',
  },
  {
    title: 'Peluncuran NusaPOS 3.0 dengan Mode Offline dan Pembayaran QRIS',
    slug: 'peluncuran-nusapos-3-mode-offline-qris',
    category: 'Produk', author: 'Tim Produk', thumbnail: img('news-pos', 1000, 600), daysAgo: 10,
    content:
      '<p>Kami dengan bangga memperkenalkan <strong>NusaPOS 3.0</strong>, pembaruan terbesar sejak aplikasi kasir ini pertama kali dirilis.</p><h2>Fitur baru</h2><ul><li>Mode offline penuh — transaksi tetap tercatat dan tersinkronisasi otomatis.</li><li>Pembayaran QRIS dinamis langsung dari layar kasir.</li><li>Laporan penjualan multi-outlet dalam satu dasbor.</li><li>Antarmuka baru yang 40% lebih cepat.</li></ul><p>Pelanggan NusaPOS dapat memperbarui aplikasi tanpa biaya tambahan melalui portal pelanggan.</p>',
  },
  {
    title: 'Tips Menjaga Keamanan Data Bisnis di Era Kerja Hibrida',
    slug: 'tips-menjaga-keamanan-data-bisnis-kerja-hibrida',
    category: 'Tips & Edukasi', author: 'Andika Pratama', thumbnail: img('news-security', 1000, 600), daysAgo: 18,
    content:
      '<p>Kerja hibrida membuat data perusahaan diakses dari lebih banyak perangkat dan lokasi. Berikut langkah praktis yang dapat diterapkan segera.</p><h2>1. Aktifkan autentikasi multi-faktor</h2><p>Kata sandi saja tidak cukup. Pastikan seluruh akun email dan aplikasi bisnis memakai verifikasi tambahan.</p><h2>2. Perbarui perangkat secara berkala</h2><p>Sebagian besar serangan memanfaatkan celah yang sebenarnya sudah memiliki perbaikan.</p><h2>3. Lakukan pencadangan terjadwal</h2><p>Terapkan aturan 3-2-1: tiga salinan data, dua media berbeda, satu salinan di luar lokasi.</p><h2>4. Latih karyawan</h2><p>Pelatihan singkat tentang phishing terbukti menurunkan risiko insiden secara signifikan.</p>',
  },
  {
    title: 'Kolaborasi Strategis dengan Asosiasi UMKM Jawa Barat',
    slug: 'kolaborasi-strategis-asosiasi-umkm-jawa-barat',
    category: 'Kemitraan', author: 'Tim Humas', thumbnail: img('news-umkm', 1000, 600), daysAgo: 27,
    content:
      '<p>Nusa Karya Teknologi menandatangani nota kesepahaman dengan Asosiasi UMKM Jawa Barat untuk mendukung digitalisasi 2.000 pelaku usaha dalam dua tahun ke depan.</p><p>Program mencakup pelatihan literasi digital, pendampingan penggunaan aplikasi kasir, serta potongan harga khusus bagi anggota asosiasi.</p><p>Penandatanganan berlangsung di Bandung dan dihadiri perwakilan pemerintah daerah serta pelaku UMKM.</p>',
  },
  {
    title: 'Pusat Data Baru di Cikarang Perkuat Layanan NusaCloud',
    slug: 'pusat-data-baru-cikarang-perkuat-nusacloud',
    category: 'Perusahaan', author: 'Tim Humas', thumbnail: img('news-dc', 1000, 600), daysAgo: 40,
    content:
      '<p>Untuk memenuhi pertumbuhan permintaan, kami mengoperasikan pusat data baru di kawasan industri Cikarang, Jawa Barat, sebagai bagian dari layanan <strong>NusaCloud</strong>.</p><p>Fasilitas ini menggunakan catu daya redundan, pendinginan hemat energi, dan konektivitas multi-operator untuk menjaga ketersediaan layanan 99,9%.</p><p>Seluruh data pelanggan tetap berada di wilayah Indonesia sesuai ketentuan pelindungan data pribadi.</p>',
  },
];

async function main() {
  const email = (process.env.ADMIN_EMAIL || 'admin@company.com').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const name = process.env.ADMIN_NAME || 'Administrator';

  await prisma.admin.upsert({
    where: { email },
    update: {},
    create: { email, name, password: await bcrypt.hash(password, 12) },
  });

  const existing = await prisma.company.findFirst();
  if (existing) await prisma.company.update({ where: { id: existing.id }, data: company });
  else await prisma.company.create({ data: company });

  for (const p of products) {
    await prisma.product.upsert({ where: { slug: p.slug }, update: p, create: p });
  }

  for (const { daysAgo: d, ...n } of news) {
    const data = { ...n, published: true, publishedAt: daysAgo(d) };
    await prisma.news.upsert({ where: { slug: n.slug }, update: data, create: data });
  }
  // satu berita draft sebagai contoh
  await prisma.news.upsert({
    where: { slug: 'draft-rencana-webinar-transformasi-digital' },
    update: {},
    create: {
      title: 'Rencana Webinar Transformasi Digital untuk UMKM',
      slug: 'draft-rencana-webinar-transformasi-digital',
      category: 'Acara', author: 'Tim Humas', published: false, thumbnail: img('news-webinar', 1000, 600),
      content: '<p>Draf pengumuman webinar. Detail jadwal dan pembicara akan dilengkapi.</p>',
    },
  });

  if ((await prisma.message.count()) === 0) {
    await prisma.message.create({
      data: {
        name: 'Hendra Wijaya', email: 'hendra@contoh.co.id', phone: '0812-3456-7890',
        subject: 'Permintaan demo NusaERP',
        message: 'Selamat siang, kami perusahaan distribusi dengan 80 karyawan dan tertarik mencoba demo NusaERP. Mohon informasi jadwal yang tersedia minggu depan.',
      },
    });
  }

  console.log(`✅ Seed selesai. Admin: ${email} / ${password}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
