"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { AuthGate } from "@/components/layout/AuthGate";
import { PaymentDetail } from "@/components/payment/PaymentDetail";
import { ProofUpload } from "@/components/payment/ProofUpload";
import { Card } from "@/components/ui/card";
import { paymentApi } from "@/lib/api/payment";

export default function PaymentDetailPage() { return <AuthGate><PaymentDetailContent /></AuthGate>; }
function PaymentDetailContent() {
  const params = useParams<{ id: string }>();
  const payment = useQuery({ queryKey: ["payment", params.id], queryFn: () => paymentApi.detail(params.id) });
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const remaining = payment.data ? Math.max(0, new Date(payment.data.expires_at).getTime() - now) : 0;
  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  return (
    <main className="mx-auto max-w-3xl space-y-5 px-4 py-6">
      <h1 className="text-3xl font-black tracking-tight">Detail Pembayaran</h1>
      {payment.data && <PaymentDetail payment={payment.data} qrisInfo="Scan QRIS sesuai instruksi backend, lalu transfer sesuai total amount." />}
      {payment.data?.status === "pending" && <Card className="p-4 text-center text-dpedia-secondary">Sisa waktu: {minutes}m {seconds}s</Card>}
      {payment.data?.status === "pending" && <ProofUpload paymentId={params.id} />}
    </main>
  );
}

