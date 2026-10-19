import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import {
  PageHeader,
  SOCIAL_ICONS,
  SOCIAL_LABELS,
} from "../../components/shared";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input, Textarea } from "../../components/ui/Input";
import { ErrorState, Skeleton } from "../../components/ui/States";
import { messageApi } from "../../lib/api";
import { useCompany } from "../../lib/queries";
import { contactSchema } from "../../lib/schemas";
import { usePageTitle } from "../../lib/usePageTitle";
import { getErrorMessage } from "../../lib/utils";

function InfoItem({ icon: Icon, label, children }) {
  return (
    <li className="flex gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary-dark">
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold">{label}</p>
        <div className="text-sm leading-6 text-navy-muted">{children}</div>
      </div>
    </li>
  );
}

export default function Contact() {
  usePageTitle("Kontak");
  const [sp] = useSearchParams();
  const { data: c, isPending, isError, error, refetch } = useCompany();
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: sp.get("subjek") || "",
      message: "",
      website: "",
    },
  });

  const send = useMutation({
    mutationFn: messageApi.send,
    onSuccess: () => {
      setDone(true);
      reset();
    },
  });

  return (
    <>
      <PageHeader
        title="Hubungi Kami"
        description="Punya pertanyaan atau ingin berdiskusi? Kirim pesan dan tim kami akan merespons secepatnya."
        crumbs={[{ label: "Beranda", to: "/" }, { label: "Kontak" }]}
      />
      <section className="section">
        <div className="container grid gap-8 lg:grid-cols-5">
          {/* Form */}
          <Card className="p-6 sm:p-8 lg:col-span-3">
            <h2 className="text-2xl">Kirim Pesan</h2>
            <p className="mt-1 text-sm text-navy-muted">
              Kolom bertanda * wajib diisi.
            </p>

            {done ? (
              <div
                className="mt-8 flex flex-col items-center gap-3 rounded-2xl bg-emerald-50 px-6 py-12 text-center"
                role="status"
              >
                <CheckCircle2
                  className="h-12 w-12 text-emerald-600"
                  aria-hidden
                />
                <h3 className="text-xl text-emerald-900">Pesan terkirim!</h3>
                <p className="max-w-sm text-sm text-emerald-800">
                  Terima kasih telah menghubungi kami. Tim kami akan segera
                  merespons melalui email atau telepon.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setDone(false);
                    send.reset();
                  }}
                >
                  Kirim pesan lain
                </Button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit((v) => send.mutate(v))}
                noValidate
                className="mt-6 space-y-5"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input
                    label="Nama lengkap"
                    required
                    autoComplete="name"
                    placeholder="Nama Anda"
                    error={errors.name?.message}
                    {...register("name")}
                  />
                  <Input
                    label="Email"
                    required
                    type="email"
                    autoComplete="email"
                    placeholder="nama@email.com"
                    error={errors.email?.message}
                    {...register("email")}
                  />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input
                    label="Telepon"
                    type="tel"
                    autoComplete="tel"
                    placeholder="0812-3456-7890"
                    error={errors.phone?.message}
                    {...register("phone")}
                  />
                  <Input
                    label="Subjek"
                    required
                    placeholder="Topik pesan"
                    error={errors.subject?.message}
                    {...register("subject")}
                  />
                </div>
                <Textarea
                  label="Pesan"
                  required
                  rows={6}
                  placeholder="Tulis pesan Anda di sini…"
                  error={errors.message?.message}
                  {...register("message")}
                />
                {/* honeypot anti-spam: disembunyikan dari pengguna */}
                <div className="absolute -left-[9999px]" aria-hidden>
                  <label>
                    Website
                    <input
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      {...register("website")}
                    />
                  </label>
                </div>
                {send.isError && (
                  <p
                    role="alert"
                    className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                  >
                    {getErrorMessage(send.error)}
                  </p>
                )}
                <Button
                  type="submit"
                  size="lg"
                  loading={send.isPending}
                  className="w-full sm:w-auto"
                >
                  <Send className="h-4 w-4" /> Kirim Pesan
                </Button>
              </form>
            )}
          </Card>

          {/* Info */}
          <div className="space-y-6 lg:col-span-2">
            <Card className="p-6 sm:p-8">
              <h2 className="text-2xl">Informasi Kontak</h2>
              {isPending ? (
                <div
                  className="mt-6 space-y-5"
                  role="status"
                  aria-label="Memuat"
                >
                  {[0, 1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : isError ? (
                <div className="mt-6">
                  <ErrorState error={error} onRetry={refetch} />
                </div>
              ) : (
                <>
                  <ul className="mt-6 space-y-5">
                    <InfoItem icon={MapPin} label="Alamat">
                      {c.address}
                    </InfoItem>
                    <InfoItem icon={Phone} label="Telepon">
                      <a
                        href={`tel:${c.phone.replace(/\s/g, "")}`}
                        className="hover:text-primary-dark"
                      >
                        {c.phone}
                      </a>
                    </InfoItem>
                    <InfoItem icon={Mail} label="Email">
                      <a
                        href={`mailto:${c.email}`}
                        className="break-all hover:text-primary-dark"
                      >
                        {c.email}
                      </a>
                    </InfoItem>
                    {c.operatingHours && (
                      <InfoItem icon={Clock} label="Jam Operasional">
                        {c.operatingHours}
                      </InfoItem>
                    )}
                  </ul>
                  {c.socials?.length > 0 && (
                    <div className="mt-6 border-t border-navy/10 pt-5">
                      <p className="mb-3 text-sm font-semibold">Ikuti kami</p>
                      <ul className="flex flex-wrap gap-2">
                        {c.socials.map((s) => {
                          const Icon = SOCIAL_ICONS[s.platform];
                          return Icon ? (
                            <li key={s.platform}>
                              <a
                                href={s.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={SOCIAL_LABELS[s.platform]}
                                className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy text-white transition-colors hover:bg-primary"
                              >
                                <Icon className="h-4 w-4" />
                              </a>
                            </li>
                          ) : null;
                        })}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </Card>
          </div>
        </div>

        {/* Peta */}
        <div className="container mt-8">
          <div className="overflow-hidden rounded-2xl border border-navy/10 shadow-card">
            {c?.mapEmbedUrl ? (
              <iframe
                title="Lokasi kantor di Google Maps"
                src={c.mapEmbedUrl}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="h-80 w-full border-0 md:h-96"
              />
            ) : (
              <div className="flex h-48 items-center justify-center bg-surface text-sm text-navy-muted">
                Peta lokasi belum tersedia.
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
