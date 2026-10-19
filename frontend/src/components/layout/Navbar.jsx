import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/Button";
import { useCompany } from "../../lib/queries";
import { cn } from "../../lib/utils";

export const NAV_LINKS = [
  { to: "/", label: "Beranda", end: true },
  { to: "/tentang", label: "Tentang" },
  { to: "/produk", label: "Produk" },
  { to: "/berita", label: "Berita" },
  { to: "/kontak", label: "Kontak" },
];

export function Brand({ company, light = false }) {
  const name = company?.name || "PT Catudaya Data Prakasa";
  return (
    <span className="flex items-center gap-2.5">
      <img
        src={company?.logoUrl || "/company-logo.png"}
        alt=""
        className="h-14 w-28 rounded-lg object-cover object-center"
      />
      <span
        className={cn(
          "font-heading text-base font-bold leading-tight",
          light ? "text-white" : "text-navy",
        )}
      >
        {name}
      </span>
    </span>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const { data: company } = useCompany();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-white/95 backdrop-blur transition-shadow",
        scrolled ? "border-navy/10 shadow-card" : "border-transparent",
      )}
    >
      <div className="container flex h-[72px] items-center justify-between gap-4">
        <Link to="/" aria-label="Beranda" className="min-w-0">
          <Brand company={company} />
        </Link>

        <nav
          aria-label="Navigasi utama"
          className="hidden items-center gap-1 lg:flex"
        >
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                cn(
                  "relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors hover:text-primary-dark",
                  isActive
                    ? "text-primary-dark after:absolute after:inset-x-3.5 after:-bottom-0.5 after:h-0.5 after:rounded after:bg-primary"
                    : "text-navy",
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button to="/kontak" size="sm" className="hidden sm:inline-flex">
            Hubungi Kami
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Menu seluler"
          className="border-t border-navy/10 bg-white lg:hidden"
        >
          <div className="container flex flex-col py-3">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  cn(
                    "rounded-lg px-3 py-3 text-base font-medium",
                    isActive
                      ? "bg-primary-light text-primary-dark"
                      : "text-navy hover:bg-surface",
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Button to="/kontak" className="mt-3">
              Hubungi Kami
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}
