"use client";

import { useQuery } from "@tanstack/react-query";
import { AuthGate } from "@/components/layout/AuthGate";
import { Card } from "@/components/ui/card";
import { PlanCard } from "@/components/payment/PlanCard";
import { paymentApi } from "@/lib/api/payment";
import { userApi } from "@/lib/api/user";
import { formatDate } from "@/lib/utils";

export default function SubscriptionPage() {
  return <AuthGate><SubscriptionContent /></AuthGate>;
}

function SubscriptionContent() {
  const plans = useQuery({ queryKey: ["plans"], queryFn: paymentApi.plans });
  const sub = useQuery({ queryKey: ["subscription"], queryFn: userApi.subscription });
  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="text-3xl font-black tracking-tight">Langganan</h1>
      <Card className="mt-5 p-5"><p className="text-sm text-dpedia-muted">Status saat ini</p><h2 className="mt-1 text-xl font-bold">{sub.data ? "Aktif" : "Tidak aktif"}</h2>{sub.data && <p className="text-sm text-dpedia-muted">Berakhir: {formatDate(sub.data.expires_at)}</p>}</Card>
      <div className="mt-5 grid gap-4 md:grid-cols-3">{plans.data?.map((plan, index) => <PlanCard key={plan.id} plan={plan} featured={index === 0} />)}</div>
    </main>
  );
}
