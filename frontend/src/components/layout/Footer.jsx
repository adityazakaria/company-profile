import { Link } from 'react-router-dom';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { Brand, NAV_LINKS } from './Navbar';
import { SOCIAL_ICONS, SOCIAL_LABELS } from '../shared';
import { useCompany } from '../../lib/queries';

export function Footer() {
  const { data: c, isPending } = useCompany();
  const socials = c?.socials ?? [];

  return (
    <footer className="bg-navy text-white/80">
      <div className="container grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Brand company={c} light />
          <p className="mt-4 text-sm leading-6">
            {isPending ? 'Memuat…' : c?.tagline || 'Solusi teknologi untuk bisnis Anda.'}
          </p>
          {socials.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {socials.map((s) => {
                const Icon = SOCIAL_ICONS[s.platform];
                return Icon ? (
                  <li key={s.platform}>
                    <a
                      href={s.url} target="_blank" rel="noopener noreferrer" aria-label={SOCIAL_LABELS[s.platform]}
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 transition-colors hover:bg-primary"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  </li>
                ) : null;
              })}
            </ul>
          )}
        </div>

        <div>
          <h3 className="mb-4 text-sm uppercase tracking-wider !text-white">Navigasi</h3>
          <ul className="space-y-2.5 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.to}><Link to={l.to} className="transition-colors hover:text-white">{l.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm uppercase tracking-wider !text-white">Layanan</h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/produk?category=Software%20Bisnis" className="hover:text-white">Software Bisnis</Link></li>
            <li><Link to="/produk?category=Internet%20of%20Things" className="hover:text-white">Internet of Things</Link></li>
            <li><Link to="/produk?category=Infrastruktur" className="hover:text-white">Infrastruktur Cloud</Link></li>
            <li><Link to="/produk?category=Keamanan%20Siber" className="hover:text-white">Keamanan Siber</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm uppercase tracking-wider !text-white">Kontak</h3>
          <ul className="space-y-3 text-sm">
            {c?.address && <li className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />{c.address}</li>}
            {c?.phone && <li className="flex gap-3"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden /><a href={`tel:${c.phone.replace(/\s/g, '')}`} className="hover:text-white">{c.phone}</a></li>}
            {c?.email && <li className="flex gap-3"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden /><a href={`mailto:${c.email}`} className="break-all hover:text-white">{c.email}</a></li>}
            {c?.operatingHours && <li className="flex gap-3"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />{c.operatingHours}</li>}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/60 sm:flex-row">
          <p>© {new Date().getFullYear()} {c?.name || 'Nusa Karya Teknologi'}. Hak cipta dilindungi.</p>
          <Link to="/admin/login" className="hover:text-white">Login Admin</Link>
        </div>
      </div>
    </footer>
  );
}
