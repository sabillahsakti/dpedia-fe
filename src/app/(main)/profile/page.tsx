"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { AuthGate } from "@/components/layout/AuthGate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { authApi } from "@/lib/api/auth";
import { userApi } from "@/lib/api/user";
import { useAuthStore } from "@/lib/store/authStore";
import { apiErrorMessage, formatDate } from "@/lib/utils";

export default function ProfilePage() {
  return <AuthGate><ProfileContent /></AuthGate>;
}

function ProfileContent() {
  const router = useRouter();
  const { user, refreshToken, clearAuth } = useAuthStore();
  const me = useQuery({ queryKey: ["me"], queryFn: userApi.me });
  const sub = useQuery({ queryKey: ["subscription"], queryFn: userApi.subscription });
  const logout = useMutation({
    mutationFn: () => refreshToken ? authApi.logout(refreshToken) : Promise.resolve({ logged_out: true }),
    onSettled: () => { clearAuth(); router.replace("/login"); },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });
  const profile = me.data || user;

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-3xl font-black tracking-tight">Profil</h1>
      <Card className="mt-5 p-5">
        <p className="text-sm text-dpedia-muted">Nama</p><h2 className="text-2xl font-bold">{profile?.name}</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2"><Info label="Email" value={profile?.email} /><Info label="Role" value={profile?.role} /><Info label="Status" value={profile?.is_active ? "Aktif" : "Nonaktif"} /><Info label="Langganan" value={sub.data ? `Aktif sampai ${formatDate(sub.data.expires_at)}` : "Tidak aktif"} /></div>
      </Card>
      <div className="mt-5 grid gap-3"><Link href="/subscription"><Button className="w-full">Kelola Langganan</Button></Link><Link href="/payment"><Button variant="outline" className="w-full">Riwayat Pembayaran</Button></Link><Button variant="danger" onClick={() => logout.mutate()}>Logout</Button></div>
    </main>
  );
}
function Info({ label, value }: { label: string; value?: string }) { return <div className="rounded-xl bg-dpedia-elevated p-3"><p className="text-xs text-dpedia-muted">{label}</p><p className="font-semibold">{value || "-"}</p></div>; }
