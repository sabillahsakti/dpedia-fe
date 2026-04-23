"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AuthGate } from "@/components/layout/AuthGate";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { paymentApi } from "@/lib/api/payment";
import { formatDate, formatRupiah } from "@/lib/utils";

export default function PaymentPage() { return <AuthGate><PaymentContent /></AuthGate>; }
function PaymentContent() {
  const payments = useQuery({ queryKey: ["payment-history"], queryFn: paymentApi.history });
  return (
    <main className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="text-3xl font-black tracking-tight">Riwayat Pembayaran</h1>
      <div className="mt-5 space-y-3">{payments.data?.map((payment) => <Link key={payment.id} href={`/payment/${payment.id}`}><Card className="mb-3 flex items-center justify-between p-4 transition hover:border-dpedia-primary"><div><p className="font-bold">{formatRupiah(payment.total_amount)}</p><p className="text-sm text-dpedia-muted">{formatDate(payment.created_at)}</p></div><StatusBadge status={payment.status} /></Card></Link>)}</div>
    </main>
  );
}
