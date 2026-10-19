import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Eye, Target } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { EmptyState, ErrorState, Skeleton } from "../../components/ui/States";
import {
  CardGridSkeleton,
  NewsCard,
  ProductCard,
  SectionHeading,
} from "../../components/shared";
import { useCompany, useNews, useProducts } from "../../lib/queries";
import { usePageTitle } from "../../lib/usePageTitle";
import { formatNumber, onImgError, PLACEHOLDER } from "../../lib/utils";

function Hero({ c }) {
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <div
        className="absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-primary/20 blur-3xl"
        aria-hidden
      />
      <div className="container relative grid items-center gap-10 py-16 md:py-24 lg:grid-cols-2 lg:gap-16">
        <div className="animate-fade-up">
          <p className="eyebrow mb-4 !text-white/70">
            {c.foundedYear ? `Sejak ${c.foundedYear}` : "Selamat datang"}
          </p>
          <h1 className="text-4xl leading-[1.1] !text-white md:text-5xl lg:text-6xl">
            {c.tagline}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-white/75 md:text-lg">
            {c.description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button to="/produk" size="lg">
              Lihat Produk <ArrowRight className="h-5 w-5" />
            </Button>
            <Button
              to="/kontak"
              size="lg"
              variant="outline"
              className="!border-white/30 !bg-transparent !text-white hover:!bg-white/10"
            >
              Konsultasi Gratis
            </Button>
          </div>
        </div>
        <div className="relative animate-fade-up [animation-delay:120ms]">
          <div
            className="absolute -bottom-4 -right-4 h-full w-full rounded-3xl border-2 border-primary/60"
            aria-hidden
          />
          <img
            src={c.heroImageUrl || PLACEHOLDER}
            alt={`Banner ${c.name}`}
            onError={onImgError}
            className="relative aspect-[4/3] w-full rounded-3xl object-cover shadow-lift"
          />
        </div>
      </div>
    </section>
  );
}

function AboutPreview({ c }) {
  const points = c.coreValues?.slice(0, 3) ?? [];
  return (
    <section className="section">
      <div className="container grid items-center gap-12 lg:grid-cols-2">
        <img
          src={c.aboutImageUrl || PLACEHOLDER}
          alt={`Tentang ${c.name}`}
          loading="lazy"
          onError={onImgError}
          className="aspect-[5/4] w-full rounded-3xl object-cover shadow-card"
        />
        <div>
          <p className="eyebrow mb-3">Tentang Kami</p>
          <h2 className="text-3xl md:text-4xl">{c.name}</h2>
          <span
            className="mt-4 block h-1 w-14 rounded-full bg-primary"
            aria-hidden
          />
          <p className="mt-6 line-clamp-5 whitespace-pre-line leading-8 text-navy-muted">
            {c.history}
          </p>
          {points.length > 0 && (
            <ul className="mt-6 space-y-3">
              {points.map((p) => (
                <li key={p.title} className="flex items-start gap-3 text-sm">
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                    aria-hidden
                  />
                  <span>
                    <strong>{p.title}.</strong>{" "}
                    <span className="text-navy-muted">{p.description}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Button to="/tentang" variant="secondary" className="mt-8">
            Selengkapnya <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

function FeaturedProducts() {
  const q = useProducts({ page: 1, limit: 6 });
  const items = q.data?.data ?? [];
  return (
    <section className="section bg-surface">
      <div className="container">
        <SectionHeading
          eyebrow="Produk Unggulan"
          title="Solusi untuk Setiap Kebutuhan Bisnis"
          description="Produk dan layanan terbaru kami dirancang agar mudah digunakan dan siap tumbuh bersama bisnis Anda."
        />
        {q.isPending ? (
          <CardGridSkeleton count={3} />
        ) : q.isError ? (
          <ErrorState error={q.error} onRetry={() => q.refetch()} />
        ) : items.length === 0 ? (
          <EmptyState
            title="Belum ada produk"
            description="Produk akan segera ditampilkan di sini."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
        <div className="mt-10 text-center">
          <Button to="/produk" variant="outline">
            Lihat Semua Produk <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

function VisionMission({ c }) {
  return (
    <section className="section">
      <div className="container">
        <SectionHeading eyebrow="Arah Kami" title="Visi & Misi" />
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="rounded-3xl bg-navy p-8 text-white lg:col-span-2">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Eye className="h-6 w-6" aria-hidden />
            </span>
            <h3 className="mt-5 text-2xl !text-white">Visi</h3>
            <p className="mt-3 leading-8 text-white/80">{c.vision}</p>
          </div>
          <div className="rounded-3xl border border-navy/10 bg-white p-8 shadow-card lg:col-span-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary-dark">
              <Target className="h-6 w-6" aria-hidden />
            </span>
            <h3 className="mt-5 text-2xl">Misi</h3>
            <ol className="mt-4 space-y-3">
              {(c.mission ?? []).slice(0, 4).map((m, i) => (
                <li key={i} className="flex gap-3 leading-7">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="text-navy-muted">{m}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats({ stats }) {
  if (!stats?.length) return null;
  return (
    <section
      className="bg-primary py-14 text-white"
      aria-label="Statistik perusahaan"
    >
      <div className="container">
        <dl className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <dd className="font-heading text-4xl font-extrabold md:text-5xl">
                {formatNumber(s.value)}
                {s.suffix}
              </dd>
              <dt className="mt-2 text-sm font-medium text-white/90">
                {s.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function LatestNews() {
  const q = useNews({ page: 1, limit: 3 });
  const items = q.data?.data ?? [];
  return (
    <section className="section bg-surface">
      <div className="container">
        <SectionHeading
          eyebrow="Berita Terbaru"
          title="Kabar dari Kami"
          description="Informasi terkini seputar produk, kemitraan, dan kegiatan perusahaan."
        />
        {q.isPending ? (
          <CardGridSkeleton count={3} />
        ) : q.isError ? (
          <ErrorState error={q.error} onRetry={() => q.refetch()} />
        ) : items.length === 0 ? (
          <EmptyState
            title="Belum ada berita"
            description="Berita terbaru akan tampil di sini."
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((n) => (
              <NewsCard key={n.id} item={n} />
            ))}
          </div>
        )}
        <div className="mt-10 text-center">
          <Button to="/berita" variant="outline">
            Lihat Semua Berita <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

function Cta() {
  return (
    <section className="section">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl bg-navy px-6 py-12 text-center text-white md:px-12 md:py-16">
          <div
            className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/30 blur-3xl"
            aria-hidden
          />
          <h2 className="relative mx-auto max-w-2xl text-3xl !text-white md:text-4xl">
            Siap memulai transformasi digital bisnis Anda?
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-white/75">
            Tim kami siap membantu menemukan solusi yang paling tepat. Hubungi
            kami untuk konsultasi tanpa biaya.
          </p>
          <div className="relative mt-8">
            <Button to="/kontak" size="lg">
              Hubungi Kami <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { data: c, isPending, isError, error, refetch } = useCompany();
  usePageTitle("", c?.name || "Beranda");

  if (isPending) {
    return (
      <div className="container py-24" role="status" aria-label="Memuat">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="mt-4 h-6 w-1/2" />
        <Skeleton className="mt-10 h-72 w-full" />
      </div>
    );
  }
  if (isError)
    return (
      <div className="container py-24">
        <ErrorState
          error={error}
          onRetry={refetch}
          title="Gagal memuat profil perusahaan"
        />
      </div>
    );

  return (
    <>
      <Hero c={c} />
      <AboutPreview c={c} />
      <FeaturedProducts />
      <VisionMission c={c} />
      <Stats stats={c.stats} />
      <LatestNews />
      <Cta />
    </>
  );
}
