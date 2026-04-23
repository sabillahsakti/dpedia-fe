"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { paymentApi } from "@/lib/api/payment";
import { apiErrorMessage } from "@/lib/utils";

export function ProofUpload({ paymentId }: { paymentId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => {
      if (!file) throw new Error("Pilih file bukti transfer");
      return paymentApi.uploadProof(paymentId, file);
    },
    onSuccess: () => {
      toast.success("Bukti transfer diupload");
      queryClient.invalidateQueries({ queryKey: ["payment", paymentId] });
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  return (
    <div className="rounded-xl border border-dpedia-border bg-dpedia-surface p-5">
      <h3 className="mb-3 font-bold">Upload Bukti Transfer</h3>
      <Input type="file" accept="image/*" onChange={(event) => setFile(event.target.files?.[0] || null)} />
      <Button className="mt-4 w-full" onClick={() => mutation.mutate()} disabled={mutation.isPending || !file}>
        {mutation.isPending ? "Mengupload..." : "Upload Bukti"}
      </Button>
    </div>
  );
}
