import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { formatDate, formatRupiah } from "@/lib/utils";
import type { Payment } from "@/types";

export function PaymentDetail({ payment, qrisInfo }: { payment: Payment; qrisInfo?: string }) {
  return (
    <Card className="space-y-4 p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">Detail Payment</h2>
        <StatusBadge status={payment.status} />
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <Info label="Amount" value={formatRupiah(payment.amount)} />
        <Info label="Kode Unik" value={payment.unique_code} />
        <Info label="Total Transfer" value={formatRupiah(payment.total_amount)} highlight />
        <Info label="Kedaluwarsa" value={formatDate(payment.expires_at)} />
        <Info label="Dibuat" value={formatDate(payment.created_at)} />
        <Info label="Catatan" value={payment.notes || "-"} />
      </div>
      {qrisInfo && <div className="rounded-xl border border-dpedia-secondary/30 bg-dpedia-secondary/10 p-4 text-sm text-dpedia-secondary">{qrisInfo}</div>}
    </Card>
  );
}

function Info({ label, value, highlight }: { label: string; value: React.ReactNode; highlight?: boolean }) {
  return (
    <div className="rounded-xl bg-dpedia-elevated p-3">
      <p className="text-xs text-dpedia-muted">{label}</p>
      <p className={highlight ? "font-bold text-dpedia-secondary" : "font-semibold"}>{value}</p>
    </div>
  );
}
