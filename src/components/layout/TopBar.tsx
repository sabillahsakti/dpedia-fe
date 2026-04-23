"use client";

import Link from "next/link";
import { Search, User } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";

export function TopBar() {
  const user = useAuthStore((s) => s.user);
  return (
    <header className="sticky top-0 z-30 border-b border-dpedia-border bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-2xl font-black tracking-tight text-white">
          D<span className="text-dpedia-primary">Pedia</span>
        </Link>
        <div className="flex items-center gap-3 text-dpedia-muted">
          <Link href="/browse" aria-label="Cari">
            <Search className="h-5 w-5" />
          </Link>
          <Link href={user ? "/profile" : "/login"} aria-label="Profil" className="rounded-full border border-dpedia-border bg-dpedia-surface p-2">
            <User className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
