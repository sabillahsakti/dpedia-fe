"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { adminApi } from "@/lib/api/admin";
import { apiErrorMessage, formatDate } from "@/lib/utils";

export default function AdminProvidersPage() {
  const queryClient = useQueryClient();
  const providers = useQuery({ queryKey: ["admin-providers"], queryFn: adminApi.providers });
  const mutation = useMutation({
    mutationFn: ({ source, is_enabled }: { source: string; is_enabled: boolean }) => adminApi.updateProvider(source, { is_enabled }),
    onSuccess: (_, variables) => {
      toast.success(`${variables.source} ${variables.is_enabled ? "diaktifkan" : "dimatikan"}`);
      queryClient.invalidateQueries({ queryKey: ["admin-providers"] });
      queryClient.invalidateQueries({ queryKey: ["sources"] });
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  return (
    <div>
      <div>
        <h1 className="text-3xl font-black tracking-tight">Providers</h1>
        <p className="mt-1 text-sm text-dpedia-muted">Kontrol provider konten mana yang aktif untuk user.</p>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {providers.data?.map((item) => (
          <Card key={item.source} className="space-y-4 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-dpedia-muted">Source</p>
                <h2 className="mt-1 text-xl font-bold">{item.source}</h2>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.is_enabled ? "bg-green-500/15 text-green-300" : "bg-red-500/15 text-red-300"}`}>
                {item.is_enabled ? "Aktif" : "Mati"}
              </span>
            </div>
            <div className="rounded-xl bg-dpedia-elevated p-3 text-sm">
              <p className="text-xs text-dpedia-muted">Update terakhir</p>
              <p className="font-semibold">{formatDate(item.updated_at)}</p>
            </div>
            <Button
              variant={item.is_enabled ? "danger" : "secondary"}
              className="w-full"
              onClick={() => mutation.mutate({ source: item.source, is_enabled: !item.is_enabled })}
              disabled={mutation.isPending}
            >
              {item.is_enabled ? "Matikan Provider" : "Aktifkan Provider"}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
