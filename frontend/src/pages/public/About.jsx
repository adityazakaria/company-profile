import { Award, Eye, FileCheck2, Target } from 'lucide-react';
import { PageHeader, SectionHeading } from '../../components/shared';
import { Card } from '../../components/ui/Card';
import { EmptyState, ErrorState, LoadingState } from '../../components/ui/States';
import { useCompany } from '../../lib/queries';
import { usePageTitle } from '../../lib/usePageTitle';
import { onImgError, PLACEHOLDER } from '../../lib/utils';

export default function About() {
  const { data: c, isPending, isError, error, refetch } = useCompany();
  usePageTitle('Tentang Kami');

  if (isPending) return <LoadingState className="min-h-[60vh]" />;
  if (isError) return <div className="container py-24"><ErrorState error={error} onRetry={refetch} /></div>;

  return (
    <>
      <PageHeader title="Tentang Kami" description={c.description} crumbs={[{ label: 'Beranda', to: '/' }, { label: 'Tentang' }]} />

      {/* Sejarah */}
      <section className="section">
        <div className="container grid items-start gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <p className="eyebrow mb-3">Perjalanan Kami</p>
            <h2 className="text-3xl md:text-4xl">Sejarah Perusahaan</h2>
            <span className="mt-4 block h-1 w-14 rounded-full bg-primary" aria-hidden />
            <div className="mt-6 space-y-5 leading-8 text-navy-muted">
              {c.history.split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
          <div className="lg:col-span-2">
            <img src={c.aboutImageUrl || PLACEHOLDER} alt={`Tentang ${c.name}`} onError={onImgError} className="aspect-[4/5] w-full rounded-3xl object-cover shadow-card" />
          </div>
        </div>
      </section>

      {/* Visi & Misi */}
      <section className="section bg-surface">
        <div className="container">
          <SectionHeading eyebrow="Arah Kami" title="Visi & Misi" />
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-white"><Eye className="h-6 w-6" aria-hidden /></span>
              <h3 className="mt-5 text-2xl">Visi</h3>
              <p className="mt-3 leading-8 text-navy-muted">{c.vision}</p>
            </Card>
            <Card className="p-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white"><Target className="h-6 w-6" aria-hidden /></span>
              <h3 className="mt-5 text-2xl">Misi</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 leading-7 text-navy-muted marker:text-primary">
                {(c.mission ?? []).map((m, i) => <li key={i}>{m}</li>)}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Core values */}
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Budaya Kerja" title="Nilai-Nilai Inti" description="Prinsip yang memandu setiap keputusan dan cara kami bekerja." />
          {c.coreValues?.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {c.coreValues.map((v, i) => (
                <Card key={v.title} hover className="p-7">
                  <span className="font-heading text-4xl font-extrabold text-primary/25">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="mt-2 text-xl">{v.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-navy-muted">{v.description}</p>
                </Card>
              ))}
            </div>
          ) : <EmptyState title="Nilai inti belum diisi" />}
        </div>
      </section>

      {/* Tim */}
      <section className="section bg-surface">
        <div className="container">
          <SectionHeading eyebrow="Tim Kami" title="Struktur Organisasi" description="Orang-orang di balik layanan dan produk kami." />
          {c.team?.length ? (
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
              {c.team.map((m) => (
                <Card key={m.name} hover className="overflow-hidden text-center">
                  <img src={m.photoUrl || PLACEHOLDER} alt={m.name} loading="lazy" onError={onImgError} className="aspect-square w-full object-cover" />
                  <div className="p-4">
                    <h3 className="text-base">{m.name}</h3>
                    <p className="mt-1 text-sm text-primary-dark">{m.position}</p>
                  </div>
                </Card>
              ))}
            </div>
          ) : <EmptyState title="Data tim belum diisi" />}
        </div>
      </section>

      {/* Legalitas */}
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Kepercayaan" title="Legalitas Perusahaan" description="Kami beroperasi secara resmi dan memenuhi persyaratan hukum yang berlaku." />
          {c.legality?.length ? (
            <div className="grid gap-5 md:grid-cols-2">
              {c.legality.map((l) => (
                <Card key={l.title} className="flex gap-4 p-6">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary-dark">
                    {/ISO|sertifikasi/i.test(l.title) ? <Award className="h-6 w-6" aria-hidden /> : <FileCheck2 className="h-6 w-6" aria-hidden />}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-base">{l.title}</h3>
                    <p className="mt-1 break-words text-sm font-semibold text-primary-dark">{l.number}</p>
                    {l.description && <p className="mt-1 text-sm text-navy-muted">{l.description}</p>}
                  </div>
                </Card>
              ))}
            </div>
          ) : <EmptyState title="Data legalitas belum diisi" />}
        </div>
      </section>
    </>
  );
}
