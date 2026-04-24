import { api, unwrap } from "./axios";
import type { AdminStats, PaginatedEnvelope, Payment, Plan, ProviderStatus, User, UserSession } from "@/types";

async function unwrapPaginated<T>(request: Promise<{ data: PaginatedEnvelope<T> }>) {
  const response = await request;
  return { data: response.data.data, meta: response.data.meta };
}

export const adminApi = {
  stats: () => unwrap<AdminStats>(api.get("/admin/stats")),
  plans: () => unwrap<Plan[]>(api.get("/admin/plans")),
  createPlan: (payload: { name: string; price: number; duration_days: number; is_active: boolean }) =>
    unwrap<Plan>(api.post("/admin/plans", payload)),
  updatePlan: (id: string, payload: { name: string; price: number; duration_days: number; is_active: boolean }) =>
    unwrap<Plan>(api.patch(`/admin/plans/${id}`, payload)),
  providers: () => unwrap<ProviderStatus[]>(api.get("/admin/providers")),
  updateProvider: (source: string, payload: { is_enabled: boolean }) =>
    unwrap<ProviderStatus>(api.patch(`/admin/providers/${source}`, payload)),
  payments: (params: { status?: string; page?: number; per_page?: number }) =>
    unwrapPaginated<Payment>(api.get("/admin/payments", { params })),
  payment: (id: string) => unwrap<Payment>(api.get(`/admin/payments/${id}`)),
  confirmPayment: (id: string, notes?: string) => unwrap<{ payment: Payment; subscription: unknown }>(api.post(`/admin/payments/${id}/confirm`, { notes })),
  rejectPayment: (id: string, notes?: string) => unwrap<Payment>(api.post(`/admin/payments/${id}/reject`, { notes })),
  users: (params: { page?: number; per_page?: number }) => unwrapPaginated<User>(api.get("/admin/users", { params })),
  user: (id: string) => unwrap<User>(api.get(`/admin/users/${id}`)),
  sessions: (params: { page?: number; per_page?: number }) => unwrapPaginated<UserSession>(api.get("/admin/sessions", { params })),
  userSessions: (id: string) => unwrap<UserSession[]>(api.get(`/admin/users/${id}/sessions`)),
};
