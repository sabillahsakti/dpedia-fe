"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-dpedia-background px-4 text-center">
      <h1 className="text-2xl font-black tracking-tight">Terjadi kesalahan</h1>
      <p className="mt-2 text-dpedia-muted">Silakan coba muat ulang halaman.</p>
      <Button className="mt-5" onClick={() => reset()}>Coba Lagi</Button>
    </main>
  );
}
