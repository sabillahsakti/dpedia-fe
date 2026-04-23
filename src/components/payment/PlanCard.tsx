"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { paymentApi } from "@/lib/api/payment";
import { apiErrorMessage, formatRupiah } from "@/lib/utils";
import type { Plan } from "@/types";

export function PlanCard({ plan, featured }: { plan: Plan; featured?: boolean }) {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: () => paymentApi.request(plan.id),
    onSuccess: (data) => {
      toast.success("Payment dibuat");
      router.push(`/payment/${data.payment_id}`);
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  return (
    <Card className={featured ? "border-dpedia-secondary bg-dpedia-secondary/10 p-5" : "p-5"}>
      <div className="mb-5">
        <p className="text-sm text-dpedia-muted">Paket</p>
        <h3 className="text-2xl font-bold tracking-tight">{plan.name}</h3>
      </div>
      <p className="text-3xl font-black text-dpedia-secondary">{formatRupiah(plan.price)}</p>
      <p className="mt-2 text-sm text-dpedia-muted">Aktif selama {plan.duration_days} hari</p>
      <Button className="mt-6 w-full" variant={featured ? "secondary" : "primary"} onClick={() => mutation.mutate()} disabled={mutation.isPending}>
        {mutation.isPending ? "Memproses..." : "Pilih"}
      </Button>
    </Card>
  );
}
