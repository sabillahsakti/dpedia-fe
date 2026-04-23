"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { adminApi } from "@/lib/api/admin";
import { formatDate, formatRupiah } from "@/lib/utils";

const statuses = ["", "pending", "confirmed", "rejected"];

export default function AdminPaymentsPage() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const payments = useQuery({ queryKey: ["admin-payments", status, page], queryFn: () => adminApi.payments({ status: status || undefined, page, per_page: 20 }) });
  return (
    <div>
      <h1 className="text-3xl font-black tracking-tight">Payments</h1>
      <div className="my-5 flex gap-2 overflow-x-auto">{statuses.map((item) => <button key={item || "all"} onClick={() => { setStatus(item); setPage(1); }} className={`rounded-full border px-4 py-2 text-sm ${status === item ? "border-dpedia-primary bg-dpedia-primary" : "border-dpedia-border bg-dpedia-surface text-dpedia-muted"}`}>{item || "all"}</button>)}</div>
      <div className="space-y-3">{payments.data?.data.map((payment) => <Link key={payment.id} href={`/admin/payments/${payment.id}`}><Card className="mb-3 grid gap-3 p-4 transition hover:border-dpedia-primary md:grid-cols-4"><p className="font-semibold">{payment.id.slice(0, 8)}</p><p>{formatRupiah(payment.total_amount)}</p><p className="text-dpedia-muted">{formatDate(payment.created_at)}</p><StatusBadge status={payment.status} /></Card></Link>)}</div>
      <div className="mt-5 flex gap-3"><Button variant="outline" disabled={page === 1} onClick={() => setPage((v) => v - 1)}>Prev</Button><Button onClick={() => setPage((v) => v + 1)}>Next</Button></div>
    </div>
  );
}
