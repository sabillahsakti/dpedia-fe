"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, CreditCard, Menu, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/users", label: "Users", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, hydrated } = useAuthStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (hydrated && user && user.role !== "admin") router.replace("/");
  }, [hydrated, router, user]);

  const nav = (
    <div className="flex h-full flex-col gap-6 p-5">
      <Link href="/admin" className="text-2xl font-black tracking-tight">
        D<span className="text-dpedia-primary">Pedia</span> Admin
      </Link>
      <div className="space-y-2">
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={cn("flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition", active ? "bg-dpedia-primary text-white" : "text-dpedia-muted hover:bg-white/10 hover:text-white")}>
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      <button className="fixed left-4 top-4 z-50 rounded-full border border-dpedia-border bg-dpedia-surface p-3 md:hidden" onClick={() => setOpen(true)} aria-label="Buka menu admin">
        <Menu className="h-5 w-5" />
      </button>
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-dpedia-border bg-dpedia-surface md:block">{nav}</aside>
      {open && <div className="fixed inset-0 z-40 bg-black/70 md:hidden" onClick={() => setOpen(false)} />}
      <aside className={cn("fixed inset-y-0 left-0 z-50 w-72 border-r border-dpedia-border bg-dpedia-surface transition md:hidden", open ? "translate-x-0" : "-translate-x-full")}>{nav}</aside>
    </>
  );
}
