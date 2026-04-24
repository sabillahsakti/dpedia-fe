"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { adminApi } from "@/lib/api/admin";
import { apiErrorMessage, formatRupiah } from "@/lib/utils";
import type { Plan } from "@/types";

type FormState = {
  name: string;
  price: string;
  duration_days: string;
  is_active: boolean;
};

const emptyForm: FormState = {
  name: "",
  price: "",
  duration_days: "",
  is_active: true,
};

export default function AdminPlansPage() {
  const queryClient = useQueryClient();
  const plans = useQuery({ queryKey: ["admin-plans"], queryFn: adminApi.plans });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Plan | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name.trim(),
        price: Number(form.price),
        duration_days: Number(form.duration_days),
        is_active: form.is_active,
      };
      if (editing) return adminApi.updatePlan(editing.id, payload);
      return adminApi.createPlan(payload);
    },
    onSuccess: () => {
      toast.success(editing ? "Paket diperbarui" : "Paket dibuat");
      setOpen(false);
      setEditing(null);
      setForm(emptyForm);
      queryClient.invalidateQueries({ queryKey: ["admin-plans"] });
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  const sortedPlans = useMemo(
    () => [...(plans.data ?? [])].sort((a, b) => Number(b.is_active) - Number(a.is_active) || a.price - b.price),
    [plans.data],
  );

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(plan: Plan) {
    setEditing(plan);
    setForm({
      name: plan.name,
      price: String(plan.price),
      duration_days: String(plan.duration_days),
      is_active: plan.is_active,
    });
    setOpen(true);
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Plans</h1>
          <p className="mt-1 text-sm text-dpedia-muted">Kelola paket langganan dan harga yang tampil di frontend.</p>
        </div>
        <Button onClick={openCreate}>Tambah Paket</Button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sortedPlans.map((plan) => (
          <Card key={plan.id} className="space-y-4 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-dpedia-muted">Paket</p>
                <h2 className="mt-1 text-xl font-bold">{plan.name}</h2>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${plan.is_active ? "bg-green-500/15 text-green-300" : "bg-white/10 text-dpedia-muted"}`}>
                {plan.is_active ? "Aktif" : "Nonaktif"}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <Info label="Harga" value={formatRupiah(plan.price)} />
              <Info label="Durasi" value={`${plan.duration_days} hari`} />
              <Info label="ID" value={plan.id} mono />
            </div>
            <Button variant="outline" className="w-full" onClick={() => openEdit(plan)}>
              Edit Paket
            </Button>
          </Card>
        ))}
      </div>

      <Modal open={open} title={editing ? "Edit Paket" : "Tambah Paket"} onClose={() => !mutation.isPending && setOpen(false)}>
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-dpedia-muted">Nama Paket</label>
            <Input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Bulanan" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-dpedia-muted">Harga</label>
            <Input type="number" min="1" value={form.price} onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))} placeholder="25000" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-dpedia-muted">Durasi</label>
            <Input type="number" min="1" value={form.duration_days} onChange={(event) => setForm((current) => ({ ...current, duration_days: event.target.value }))} placeholder="30" />
          </div>
          <label className="flex items-center gap-3 rounded-xl border border-dpedia-border bg-dpedia-elevated px-4 py-3 text-sm">
            <input type="checkbox" checked={form.is_active} onChange={(event) => setForm((current) => ({ ...current, is_active: event.target.checked }))} className="h-4 w-4 accent-red-600" />
            Paket aktif dan tampil di halaman langganan
          </label>
          <Button className="w-full" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            {mutation.isPending ? "Menyimpan..." : editing ? "Simpan Perubahan" : "Buat Paket"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function Info({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-xl bg-dpedia-elevated p-3">
      <p className="text-xs text-dpedia-muted">{label}</p>
      <p className={mono ? "break-all font-mono text-xs text-white" : "font-semibold"}>{value}</p>
    </div>
  );
}
