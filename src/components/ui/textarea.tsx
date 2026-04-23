import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-xl border border-dpedia-border bg-dpedia-elevated px-4 py-3 text-sm text-white outline-none transition placeholder:text-dpedia-muted focus:border-dpedia-primary focus:ring-2 focus:ring-dpedia-primary/20",
        className,
      )}
      {...props}
    />
  );
}
