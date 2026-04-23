"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/ui/badge";
import { adminApi } from "@/lib/api/admin";
import { apiErrorMessage, formatDate, formatRupiah } from "@/lib/utils";

const uploads = process.env.NEXT_PUBLIC_UPLOADS_URL || "http://localhost:8080/uploads";

export default function AdminPaymentDetailPage() {
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [action, setAction] = useState<"confirm" | "reject" | null>(null);
  const [notes, setNotes] = useState("");
  const payment = useQuery({ queryKey: ["admin-payment", params.id], queryFn: () => adminApi.payment(params.id) });
  const mutation = useMutation({
    mutationFn: async () => {
      if (action === "confirm") return adminApi.confirmPayment(params.id, notes || undefined);
      return adminApi.rejectPayment(params.id, notes || undefined);
    },
    onSuccess: () => { toast.success("Payment diperbarui"); setAction(null); queryClient.invalidateQueries({ queryKey: ["admin-payment", params.id] }); },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });
  const proof = payment.data?.proof_image_url ? `${uploads}/${payment.data.proof_image_url.split("/").pop()}` : null;
  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-black tracking-tight">Detail Payment</h1>
      {payment.data && <Card className="mt-5 space-y-3 p-5"><div className="flex justify-between"><p className="font-mono text-sm">{payment.data.id}</p><StatusBadge status={payment.data.status} /></div><Info label="Total" value={formatRupiah(payment.data.total_amount)} /><Info label="User" value={payment.data.user_id} /><Info label="Plan" value={payment.data.plan_id} /><Info label="Expires" value={formatDate(payment.data.expires_at)} />{proof && <div className="relative mt-4 aspect-video overflow-hidden rounded-xl bg-dpedia-elevated"><Image src={proof} alt="Bukti transfer" fill className="object-contain" unoptimized /></div>}{payment.data.status === "pending" && <div className="flex gap-3"><Button className="bg-green-700 hover:bg-green-800" onClick={() => setAction("confirm")}>Konfirmasi</Button><Button variant="danger" onClick={() => setAction("reject")}>Tolak</Button></div>}</Card>}
      <Modal open={!!action} title={action === "confirm" ? "Konfirmasi Payment" : "Tolak Payment"} onClose={() => setAction(null)}><Textarea placeholder="Catatan opsional" value={notes} onChange={(e) => setNotes(e.target.value)} /><Button className="mt-4 w-full" variant={action === "reject" ? "danger" : "primary"} onClick={() => mutation.mutate()} disabled={mutation.isPending}>Submit</Button></Modal>
    </div>
  );
}
function Info({ label, value }: { label: string; value: string }) { return <div className="rounded-xl bg-dpedia-elevated p-3"><p className="text-xs text-dpedia-muted">{label}</p><p className="break-all font-semibold">{value}</p></div>; }


