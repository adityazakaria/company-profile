import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Mail, MailOpen, Newspaper, Package } from "lucide-react";
import { AdminPageHeader } from "../../components/admin/bits";
import { Badge, Card } from "../../components/ui/Card";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "../../components/ui/States";
import { statsApi } from "../../lib/api";
import { usePageTitle } from "../../lib/usePageTitle";
import { formatDateTime } from "../../lib/utils";

function StatCard({ icon: Icon, label, value, sub, to, tone }) {
  return (
    <Link to={to} className="group block">
      <Card hover className="flex items-center gap-4 p-5">
        <span
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${tone}`}
        >
          <Icon className="h-6 w-6" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="text-sm text-navy-muted">{label}</p>
          <p className="font-heading text-3xl font-extrabold">{value}</p>
          <p className="text-xs text-navy-muted">{sub}</p>
        </div>
      </Card>
    </Link>
  );
}

export default function Dashboard() {
  usePageTitle("Dashboard");
  const q = useQuery({
    queryKey: ["admin-stats"],
    queryFn: statsApi.get,
    select: (r) => r.data,
  });

  if (q.isPending) return <LoadingState />;
  if (q.isError)
    return <ErrorState error={q.error} onRetry={() => q.refetch()} />;
  const s = q.data;

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="Ringkasan aktivitas website Anda."
      />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Package}
          label="Total Produk"
          value={s.products}
          sub={`${s.activeProducts} aktif`}
          to="/admin/products"
          tone="bg-navy text-white"
        />
        <StatCard
          icon={Newspaper}
          label="Total Berita"
          value={s.news}
          sub={`${s.publishedNews} terbit, ${s.news - s.publishedNews} draft`}
          to="/admin/news"
          tone="bg-primary text-white"
        />
        <StatCard
          icon={Mail}
          label="Total Pesan"
          value={s.messages}
          sub="seluruh pesan masuk"
          to="/admin/messages"
          tone="bg-navy/10 text-navy"
        />
        <StatCard
          icon={MailOpen}
          label="Belum Dibaca"
          value={s.unreadMessages}
          sub="perlu ditindaklanjuti"
          to="/admin/messages"
          tone="bg-primary-light text-primary-dark"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg">Pesan Terbaru</h2>
            <Link
              to="/admin/messages"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary-dark"
            >
              Semua <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {s.recentMessages.length === 0 ? (
            <EmptyState title="Belum ada pesan" className="py-8" />
          ) : (
            <ul className="divide-y divide-navy/10">
              {s.recentMessages.map((m) => (
                <li key={m.id} className="py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate font-semibold">{m.name}</p>
                    {!m.isRead && <Badge>Baru</Badge>}
                  </div>
                  <p className="truncate text-sm">{m.subject}</p>
                  <p className="text-xs text-navy-muted">
                    {formatDateTime(m.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg">Berita Terbaru</h2>
            <Link
              to="/admin/news"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary-dark"
            >
              Kelola <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {s.recentNews.length === 0 ? (
            <EmptyState title="Belum ada berita" className="py-8" />
          ) : (
            <ul className="divide-y divide-navy/10">
              {s.recentNews.map((n) => (
                <li
                  key={n.id}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{n.title}</p>
                    <p className="text-xs text-navy-muted">
                      {formatDateTime(n.createdAt)}
                    </p>
                  </div>
                  <Badge tone={n.published ? "green" : "gray"}>
                    {n.published ? "Terbit" : "Draft"}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
