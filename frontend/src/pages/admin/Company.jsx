import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Save, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { AdminPageHeader } from "../../components/admin/bits";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { ImageUpload } from "../../components/ui/ImageUpload";
import { Input, Select, Textarea } from "../../components/ui/Input";
import { ErrorState, LoadingState } from "../../components/ui/States";
import { SOCIAL_LABELS } from "../../components/shared";
import { companyApi } from "../../lib/api";
import { companySchema } from "../../lib/schemas";
import { usePageTitle } from "../../lib/usePageTitle";
import { getErrorMessage } from "../../lib/utils";

const toForm = (c) => ({
  name: c.name,
  tagline: c.tagline,
  description: c.description,
  history: c.history,
  vision: c.vision,
  mission: (c.mission?.length ? c.mission : [""]).map((value) => ({ value })),
  address: c.address,
  phone: c.phone,
  email: c.email,
  operatingHours: c.operatingHours ?? "",
  foundedYear: c.foundedYear ? String(c.foundedYear) : "",
  mapEmbedUrl: c.mapEmbedUrl ?? "",
  logoUrl: c.logoUrl ?? "",
  heroImageUrl: c.heroImageUrl ?? "",
  aboutImageUrl: c.aboutImageUrl ?? "",
  stats: (c.stats ?? []).map((s) => ({
    ...s,
    value: String(s.value),
    suffix: s.suffix ?? "",
  })),
  coreValues: c.coreValues ?? [],
  team: (c.team ?? []).map((t) => ({ ...t, photoUrl: t.photoUrl ?? "" })),
  legality: (c.legality ?? []).map((l) => ({
    ...l,
    description: l.description ?? "",
  })),
  socials: c.socials ?? [],
});

const toBody = (v) => ({
  ...v,
  mission: v.mission.map((m) => m.value),
  foundedYear: v.foundedYear ? Number(v.foundedYear) : null,
  stats: v.stats.map((s) => ({ ...s, value: Number(s.value) })),
});

function Section({ title, description, children, action }) {
  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg">{title}</h2>
          {description && (
            <p className="mt-0.5 text-sm text-navy-muted">{description}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </Card>
  );
}

function ListSection({
  title,
  description,
  name,
  control,
  empty,
  addLabel,
  render,
}) {
  const { fields, append, remove } = useFieldArray({ control, name });
  return (
    <Section
      title={title}
      description={description}
      action={
        <Button variant="outline" size="sm" onClick={() => append(empty)}>
          <Plus className="h-4 w-4" /> {addLabel}
        </Button>
      }
    >
      {fields.length === 0 && (
        <p className="rounded-lg bg-surface px-4 py-6 text-center text-sm text-navy-muted">
          Belum ada data. Klik “{addLabel}”.
        </p>
      )}
      <div className="space-y-4">
        {fields.map((f, i) => (
          <div
            key={f.id}
            className="flex items-start gap-3 rounded-xl border border-navy/10 p-4"
          >
            <div className="grid flex-1 gap-4 sm:grid-cols-2">{render(i)}</div>
            <Button
              variant="ghost"
              size="icon"
              className="!text-red-600 hover:!bg-red-50"
              onClick={() => remove(i)}
              aria-label={`Hapus item ${i + 1}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </Section>
  );
}

export default function Company() {
  usePageTitle("Profil Perusahaan");
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["admin-company"],
    queryFn: companyApi.get,
    select: (r) => r.data,
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({ resolver: zodResolver(companySchema) });
  useEffect(() => {
    if (q.data) reset(toForm(q.data));
  }, [q.data, reset]);

  const {
    fields: missions,
    append: addMission,
    remove: removeMission,
  } = useFieldArray({ control, name: "mission" });

  const save = useMutation({
    mutationFn: (v) => companyApi.update(toBody(v)),
    onSuccess: (res) => {
      toast.success(res.message);
      qc.invalidateQueries({ queryKey: ["company"] });
      qc.setQueryData(["admin-company"], res);
      reset(toForm(res.data));
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  if (q.isPending) return <LoadingState />;
  if (q.isError)
    return <ErrorState error={q.error} onRetry={() => q.refetch()} />;

  const e = errors;
  const onInvalid = () =>
    toast.error("Periksa kembali isian formulir yang ditandai merah.");

  return (
    <form onSubmit={handleSubmit((v) => save.mutate(v), onInvalid)} noValidate>
      <AdminPageHeader
        title="Profil Perusahaan"
        description="Perubahan langsung tampil di halaman Beranda, Tentang, Kontak, dan Footer."
        action={
          <Button type="submit" loading={save.isPending} disabled={!isDirty}>
            <Save className="h-4 w-4" /> Simpan Perubahan
          </Button>
        }
      />

      <div className="space-y-6">
        <Section title="Informasi Umum">
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Nama perusahaan"
              required
              error={e.name?.message}
              {...register("name")}
            />
            <Input
              label="Tahun berdiri"
              inputMode="numeric"
              placeholder="2010"
              error={e.foundedYear?.message}
              {...register("foundedYear")}
            />
            <Input
              wrapperClassName="sm:col-span-2"
              label="Tagline"
              required
              error={e.tagline?.message}
              {...register("tagline")}
            />
            <Textarea
              wrapperClassName="sm:col-span-2"
              label="Deskripsi singkat"
              required
              rows={3}
              error={e.description?.message}
              {...register("description")}
            />
            <Textarea
              wrapperClassName="sm:col-span-2"
              label="Sejarah perusahaan"
              required
              rows={7}
              hint="Pisahkan paragraf dengan satu baris kosong."
              error={e.history?.message}
              {...register("history")}
            />
          </div>
        </Section>

        <Section title="Visi & Misi">
          <Textarea
            label="Visi"
            required
            rows={3}
            error={e.vision?.message}
            {...register("vision")}
          />
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">
                Misi{" "}
                <span className="text-primary-dark" aria-hidden>
                  *
                </span>
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addMission({ value: "" })}
              >
                <Plus className="h-4 w-4" /> Tambah misi
              </Button>
            </div>
            <div className="space-y-3">
              {missions.map((f, i) => (
                <div key={f.id} className="flex items-start gap-2">
                  <Input
                    wrapperClassName="flex-1"
                    aria-label={`Misi ${i + 1}`}
                    placeholder={`Misi ${i + 1}`}
                    error={e.mission?.[i]?.value?.message}
                    {...register(`mission.${i}.value`)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mt-0.5 !text-red-600"
                    onClick={() => removeMission(i)}
                    disabled={missions.length === 1}
                    aria-label={`Hapus misi ${i + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            {e.mission?.message && (
              <p role="alert" className="mt-1 text-xs font-medium text-red-600">
                {e.mission.message}
              </p>
            )}
          </div>
        </Section>

        <Section title="Kontak">
          <div className="grid gap-5 sm:grid-cols-2">
            <Textarea
              wrapperClassName="sm:col-span-2"
              label="Alamat"
              required
              rows={2}
              error={e.address?.message}
              {...register("address")}
            />
            <Input
              label="Telepon"
              required
              error={e.phone?.message}
              {...register("phone")}
            />
            <Input
              label="Email"
              type="email"
              required
              error={e.email?.message}
              {...register("email")}
            />
            <Input
              wrapperClassName="sm:col-span-2"
              label="Jam operasional"
              placeholder="Senin – Jumat, 08.00 – 17.00 WIB"
              error={e.operatingHours?.message}
              {...register("operatingHours")}
            />
            <Input
              wrapperClassName="sm:col-span-2"
              label="URL embed Google Maps"
              placeholder="https://www.google.com/maps/embed?pb=…"
              hint="Google Maps → Bagikan → Sematkan peta → salin nilai atribut src."
              error={e.mapEmbedUrl?.message}
              {...register("mapEmbedUrl")}
            />
          </div>
        </Section>

        <Section title="Gambar">
          <div className="grid gap-6 lg:grid-cols-3">
            <Controller
              control={control}
              name="logoUrl"
              render={({ field }) => (
                <ImageUpload
                  label="Logo"
                  aspect="aspect-square"
                  value={field.value}
                  onChange={field.onChange}
                  error={e.logoUrl?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="heroImageUrl"
              render={({ field }) => (
                <ImageUpload
                  label="Banner hero (Beranda)"
                  value={field.value}
                  onChange={field.onChange}
                  error={e.heroImageUrl?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="aboutImageUrl"
              render={({ field }) => (
                <ImageUpload
                  label="Foto Tentang Kami"
                  value={field.value}
                  onChange={field.onChange}
                  error={e.aboutImageUrl?.message}
                />
              )}
            />
          </div>
        </Section>

        <ListSection
          title="Statistik Perusahaan"
          description="Angka yang tampil di Beranda."
          name="stats"
          control={control}
          empty={{ label: "", value: "", suffix: "" }}
          addLabel="Tambah statistik"
          render={(i) => (
            <>
              <Input
                label="Label"
                placeholder="Klien Perusahaan"
                error={e.stats?.[i]?.label?.message}
                {...register(`stats.${i}.label`)}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Angka"
                  inputMode="decimal"
                  placeholder="450"
                  error={e.stats?.[i]?.value?.message}
                  {...register(`stats.${i}.value`)}
                />
                <Input
                  label="Akhiran"
                  placeholder="+ atau %"
                  {...register(`stats.${i}.suffix`)}
                />
              </div>
            </>
          )}
        />

        <ListSection
          title="Nilai-Nilai Inti"
          name="coreValues"
          control={control}
          empty={{ title: "", description: "" }}
          addLabel="Tambah nilai"
          render={(i) => (
            <>
              <Input
                label="Judul"
                error={e.coreValues?.[i]?.title?.message}
                {...register(`coreValues.${i}.title`)}
              />
              <Input
                label="Deskripsi"
                error={e.coreValues?.[i]?.description?.message}
                {...register(`coreValues.${i}.description`)}
              />
            </>
          )}
        />

        <ListSection
          title="Tim / Struktur Organisasi"
          name="team"
          control={control}
          empty={{ name: "", position: "", photoUrl: "" }}
          addLabel="Tambah anggota"
          render={(i) => (
            <>
              <Input
                label="Nama"
                error={e.team?.[i]?.name?.message}
                {...register(`team.${i}.name`)}
              />
              <Input
                label="Jabatan"
                error={e.team?.[i]?.position?.message}
                {...register(`team.${i}.position`)}
              />
              <Controller
                control={control}
                name={`team.${i}.photoUrl`}
                render={({ field }) => (
                  <div className="sm:col-span-2">
                    <ImageUpload
                      label="Foto"
                      aspect="aspect-square"
                      value={field.value}
                      onChange={field.onChange}
                      error={e.team?.[i]?.photoUrl?.message}
                    />
                  </div>
                )}
              />
            </>
          )}
        />

        <ListSection
          title="Legalitas"
          name="legality"
          control={control}
          empty={{ title: "", number: "", description: "" }}
          addLabel="Tambah dokumen"
          render={(i) => (
            <>
              <Input
                label="Nama dokumen"
                error={e.legality?.[i]?.title?.message}
                {...register(`legality.${i}.title`)}
              />
              <Input
                label="Nomor"
                error={e.legality?.[i]?.number?.message}
                {...register(`legality.${i}.number`)}
              />
              <Input
                wrapperClassName="sm:col-span-2"
                label="Keterangan (opsional)"
                {...register(`legality.${i}.description`)}
              />
            </>
          )}
        />

        <ListSection
          title="Sosial Media"
          name="socials"
          control={control}
          empty={{ platform: "instagram", url: "" }}
          addLabel="Tambah tautan"
          render={(i) => (
            <>
              <Select label="Platform" {...register(`socials.${i}.platform`)}>
                {Object.entries(SOCIAL_LABELS).map(([k, l]) => (
                  <option key={k} value={k}>
                    {l}
                  </option>
                ))}
              </Select>
              <Input
                label="URL"
                placeholder="https://…"
                error={e.socials?.[i]?.url?.message}
                {...register(`socials.${i}.url`)}
              />
            </>
          )}
        />
      </div>

      <div className="sticky bottom-0 -mx-4 mt-6 flex justify-end border-t border-navy/10 bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <Button type="submit" loading={save.isPending} disabled={!isDirty}>
          <Save className="h-4 w-4" /> Simpan Perubahan
        </Button>
      </div>
    </form>
  );
}
