"use client";

import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { adminApi } from "@/lib/api/admin";
import { formatRupiah } from "@/lib/utils";

export default function AdminDashboardPage() {
  const stats = useQuery({ queryKey: ["admin-stats"], queryFn: adminApi.stats });
  const items = [
    ["Total User", stats.data?.total_users, "text-dpedia-primary"],
    ["Subscription Aktif", stats.data?.active_subscriptions, "text-green-400"],
    ["Payment Pending", stats.data?.pending_payments, "text-yellow-300"],
    ["Total Revenue", formatRupiah(stats.data?.total_revenue), "text-dpedia-secondary"],
  ];
  return (
    <div>
      <h1 className="text-3xl font-black tracking-tight">Dashboard</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-4">{items.map(([label, value, color]) => <Card key={label as string} className="p-5"><p className="text-sm text-dpedia-muted">{label}</p><p className={`mt-2 text-3xl font-black ${color}`}>{value ?? "-"}</p></Card>)}</div>
    </div>
  );
}
