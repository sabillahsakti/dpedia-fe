"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";

export function AuthGate({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const router = useRouter();
  const { accessToken, user, hydrated } = useAuthStore();

  useEffect(() => {
    if (!hydrated) return;
    if (!accessToken) router.replace("/login");
    if (adminOnly && user && user.role !== "admin") router.replace("/");
  }, [accessToken, adminOnly, hydrated, router, user]);

  if (!hydrated || !accessToken || (adminOnly && user?.role !== "admin")) {
    return <div className="flex min-h-screen items-center justify-center bg-dpedia-background text-dpedia-muted">Memuat...</div>;
  }

  return <>{children}</>;
}
