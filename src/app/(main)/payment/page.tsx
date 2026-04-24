"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AuthGate } from "@/components/layout/AuthGate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { paymentApi } from "@/lib/api/payment";
import { formatDate, formatRupiah } from "@/lib/utils";

export default function PaymentPage() {
  return <AuthGate><PaymentContent /></AuthGate>;
}

function PaymentContent() {
  const payments = useQuery({ queryKey: ["payment-history"], queryFn: paymentApi.history });

  return (
    <main className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="text-3xl font-black tracking-tight">Riwayat Pembayaran</h1>
      <div className="mt-5 space-y-3">
        {payments.data?.map((payment) => (
          <Card key={payment.id} className="mb-3 p-4 transition hover:border-dpedia-primary">
            <div className="flex items-start justify-between gap-4">
              <Link href={`/payment/${payment.id}`} className="min-w-0 flex-1">
                <p className="font-bold">{formatRupiah(payment.total_amount)}</p>
                <p className="text-sm text-dpedia-muted">{formatDate(payment.created_at)}</p>
                {payment.status === "pending" && <p className="mt-2 text-sm text-dpedia-secondary">Menunggu pembayaran via Pakasir</p>}
              </Link>
              <StatusBadge status={payment.status} />
            </div>
            {payment.status === "pending" && payment.checkout_url && (
              <a href={payment.checkout_url} target="_blank" rel="noreferrer" className="mt-4 block">
                <Button variant="outline" className="w-full">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Lanjut Bayar
                </Button>
              </a>
            )}
          </Card>
        ))}
      </div>
    </main>
  );
}
