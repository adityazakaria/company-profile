import { Link } from 'react-router-dom';
import { ArrowUpRight, Calendar, User } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube, FaTiktok, FaWhatsapp, FaXTwitter } from 'react-icons/fa6';
import { Card, Badge } from './ui/Card';
import { Skeleton } from './ui/States';
import { cn, formatDate, formatRupiah, onImgError, PLACEHOLDER } from '../lib/utils';

export const SOCIAL_ICONS = {
  facebook: FaFacebookF, instagram: FaInstagram, linkedin: FaLinkedinIn, youtube: FaYoutube,
  tiktok: FaTiktok, whatsapp: FaWhatsapp, twitter: FaXTwitter,
};
export const SOCIAL_LABELS = {
  facebook: 'Facebook', instagram: 'Instagram', linkedin: 'LinkedIn', youtube: 'YouTube',
  tiktok: 'TikTok', whatsapp: 'WhatsApp', twitter: 'X (Twitter)',
};

export function SectionHeading({ eyebrow, title, description, align = 'center', light = false, className }) {
  return (
    <div className={cn('mb-10 max-w-2xl md:mb-14', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && <p className={cn('eyebrow mb-3', light && '!text-white/70')}>{eyebrow}</p>}
      <h2 className={cn('text-3xl md:text-4xl', light && '!text-white')}>{title}</h2>
      <span className={cn('mt-4 block h-1 w-14 rounded-full bg-primary', align === 'center' && 'mx-auto')} aria-hidden />
      {description && <p className={cn('mt-5 leading-7', light ? 'text-white/75' : 'text-navy-muted')}>{description}</p>}
    </div>
  );
}

/** Banner judul untuk halaman dalam */
export function PageHeader({ title, description, crumbs }) {
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary/25 blur-3xl" aria-hidden />
      <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-primary via-primary/40 to-transparent" aria-hidden />
      <div className="container relative py-14 md:py-20">
        {crumbs && (
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-white/65">
            {crumbs.map((c, i) => (
              <span key={c.label}>
                {i > 0 && <span className="mx-2" aria-hidden>/</span>}
                {c.to ? <Link to={c.to} className="hover:text-white">{c.label}</Link> : <span className="text-white">{c.label}</span>}
              </span>
            ))}
          </nav>
        )}
        <h1 className="max-w-3xl text-3xl text-white md:text-5xl">{title}</h1>
        {description && <p className="mt-4 max-w-2xl text-base leading-7 text-white/75 md:text-lg">{description}</p>}
      </div>
    </section>
  );
}

export function ProductCard({ product }) {
  return (
    <Card hover className="group flex h-full flex-col overflow-hidden">
      <Link to={`/produk/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-surface" tabIndex={-1} aria-hidden>
        <img
          src={product.imageUrl || PLACEHOLDER} alt="" loading="lazy" onError={onImgError}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <Badge className="self-start">{product.category}</Badge>
        <h3 className="mt-3 text-xl">
          <Link to={`/produk/${product.slug}`} className="hover:text-primary-dark">{product.name}</Link>
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-navy-muted">{product.description}</p>
        <div className="mt-4 flex items-center justify-between border-t border-navy/5 pt-4">
          <span className="text-sm font-semibold">{product.price != null ? `Mulai ${formatRupiah(product.price)}` : 'Hubungi kami'}</span>
          <Link to={`/produk/${product.slug}`} className="inline-flex items-center gap-1 text-sm font-semibold text-primary-dark" aria-label={`Lihat detail ${product.name}`}>
            Detail <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </Card>
  );
}

export function NewsCard({ item }) {
  return (
    <Card hover className="group flex h-full flex-col overflow-hidden">
      <Link to={`/berita/${item.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-surface" tabIndex={-1} aria-hidden>
        <img
          src={item.thumbnail || PLACEHOLDER} alt="" loading="lazy" onError={onImgError}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3 text-xs text-navy-muted">
          <Badge>{item.category}</Badge>
          <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" aria-hidden />{formatDate(item.publishedAt || item.createdAt)}</span>
        </div>
        <h3 className="mt-3 text-lg leading-snug">
          <Link to={`/berita/${item.slug}`} className="line-clamp-2 hover:text-primary-dark">{item.title}</Link>
        </h3>
        {item.excerpt && <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-navy-muted">{item.excerpt}</p>}
        <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-navy-muted"><User className="h-3.5 w-3.5" aria-hidden />{item.author}</p>
      </div>
    </Card>
  );
}

export function CardGridSkeleton({ count = 3, cols = 'sm:grid-cols-2 lg:grid-cols-3' }) {
  return (
    <div className={cn('grid gap-6', cols)} role="status" aria-label="Memuat">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-navy/5 bg-white shadow-card">
          <Skeleton className="aspect-[4/3] rounded-none" />
          <div className="space-y-3 p-5">
            <Skeleton className="h-5 w-24" /><Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
