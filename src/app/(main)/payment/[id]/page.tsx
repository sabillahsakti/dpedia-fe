"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { AuthGate } from "@/components/layout/AuthGate";
import { PaymentDetail } from "@/components/payment/PaymentDetail";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { paymentApi } from "@/lib/api/payment";

export default function PaymentDetailPage() {
  return <AuthGate><PaymentDetailContent /></AuthGate>;
}

function PaymentDetailContent() {
  const params = useParams<{ id: string }>();
  const payment = useQuery({
    queryKey: ["payment", params.id],
    queryFn: () => paymentApi.detail(params.id),
    refetchInterval: (query) => query.state.data?.status === "pending" ? 5000 : false,
  });
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const remaining = payment.data ? Math.max(0, new Date(payment.data.expires_at).getTime() - now) : 0;
  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  return (
    <main className="mx-auto max-w-3xl space-y-5 px-4 py-6">
      <h1 className="text-3xl font-black tracking-tight">Detail Pembayaran</h1>
      {payment.data && <PaymentDetail payment={payment.data} />}
      {payment.data?.status === "pending" && (
        <Card className="p-4 text-center text-dpedia-secondary">
          Sisa waktu: {minutes}m {seconds}s
        </Card>
      )}
      {payment.data?.status === "pending" && payment.data.checkout_url && (
        <Card className="space-y-4 p-5">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Bayar via Pakasir</h2>
            <p className="mt-1 text-sm text-dpedia-muted">
              Selesaikan pembayaran melalui checkout Pakasir. Halaman ini akan refresh otomatis selama status masih menunggu.
            </p>
          </div>
          <a href={payment.data.checkout_url} target="_blank" rel="noreferrer">
            <Button className="w-full">
              <ExternalLink className="mr-2 h-4 w-4" />
              Buka Checkout Pakasir
            </Button>
          </a>
        </Card>
      )}
    </main>
  );
}
