import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-dpedia-border bg-white/5 px-3 py-1 text-xs font-medium text-dpedia-muted",
        className,
      )}
      {...props}
    />
  );
}

export function StatusBadge({ status }: { status?: string }) {
  const style =
    status === "confirmed"
      ? "border-green-500/30 bg-green-500/15 text-green-300"
      : status === "pending"
        ? "border-yellow-500/30 bg-yellow-500/15 text-yellow-300"
        : status === "rejected"
          ? "border-red-500/30 bg-red-500/15 text-red-300"
          : "border-zinc-500/30 bg-zinc-500/15 text-zinc-300";
  return <Badge className={style}>{status || "-"}</Badge>;
}
