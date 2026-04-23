"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Crown, Grid2X2, Home, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/browse", label: "Browse", icon: Grid2X2 },
  { href: "/subscription", label: "Langganan", icon: Crown },
  { href: "/profile", label: "Profil", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-dpedia-border bg-black/75 backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-[430px] grid-cols-4 px-2 py-2">
        {items.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className={cn("flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] transition", active ? "text-dpedia-primary" : "text-dpedia-muted")}>
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
