import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
}

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  const variants = {
    primary: "bg-dpedia-primary text-white hover:bg-red-700",
    secondary: "bg-dpedia-secondary text-black hover:brightness-110",
    ghost: "bg-transparent text-dpedia-text hover:bg-white/10",
    danger: "bg-red-700 text-white hover:bg-red-800",
    outline: "border border-dpedia-border bg-dpedia-surface text-dpedia-text hover:border-dpedia-primary",
  };

  return (
    <button
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
