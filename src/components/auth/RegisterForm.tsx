"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/store/authStore";
import { apiErrorMessage } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function RegisterForm() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const mutation = useMutation({
    mutationFn: () => authApi.register({ name, email, password }),
    onSuccess: (data) => {
      setAuth(data);
      toast.success("Akun dibuat");
      router.replace("/");
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!name || !email || password.length < 6) return toast.error("Nama, email, dan password minimal 6 karakter wajib diisi");
    mutation.mutate();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <Input placeholder="Nama" value={name} onChange={(e) => setName(e.target.value)} />
      <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button className="w-full" disabled={mutation.isPending}>{mutation.isPending ? "Mendaftar..." : "Daftar"}</Button>
      <p className="text-center text-sm text-dpedia-muted">Sudah punya akun? <Link className="text-dpedia-primary" href="/login">Masuk</Link></p>
    </form>
  );
}
