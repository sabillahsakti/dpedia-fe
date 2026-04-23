import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRupiah(amount?: number | null) {
  return `Rp ${(amount ?? 0).toLocaleString("id-ID")}`;
}

export function formatDate(value?: string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function apiErrorMessage(error: unknown) {
  if (typeof error === "object" && error && "response" in error) {
    const response = (error as { response?: { data?: { error?: { message?: string }; message?: string } } }).response;
    return response?.data?.error?.message || response?.data?.message || "Terjadi kesalahan";
  }
  if (error instanceof Error) return error.message;
  return "Terjadi kesalahan";
}

export function statusLabel(status?: string) {
  switch (status) {
    case "pending":
      return "Menunggu";
    case "confirmed":
      return "Dikonfirmasi";
    case "rejected":
      return "Ditolak";
    case "expired":
      return "Kedaluwarsa";
    default:
      return status || "-";
  }
}
