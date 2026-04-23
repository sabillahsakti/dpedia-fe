"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { adminApi } from "@/lib/api/admin";
import { formatDate } from "@/lib/utils";

export default function AdminUserDetailPage() {
  const params = useParams<{ id: string }>();
  const user = useQuery({ queryKey: ["admin-user", params.id], queryFn: () => adminApi.user(params.id) });
  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-black tracking-tight">Detail User</h1>
      {user.data && <Card className="mt-5 space-y-3 p-5"><h2 className="text-2xl font-bold">{user.data.name}</h2><Info label="ID" value={user.data.id} /><Info label="Email" value={user.data.email} /><div className="flex gap-2"><Badge>{user.data.role}</Badge><Badge className={user.data.is_active ? "text-green-300" : "text-red-300"}>{user.data.is_active ? "aktif" : "nonaktif"}</Badge></div><Info label="Dibuat" value={formatDate(user.data.created_at)} /><Info label="Diupdate" value={formatDate(user.data.updated_at)} /></Card>}
    </div>
  );
}
function Info({ label, value }: { label: string; value: string }) { return <div className="rounded-xl bg-dpedia-elevated p-3"><p className="text-xs text-dpedia-muted">{label}</p><p className="break-all font-semibold">{value}</p></div>; }
