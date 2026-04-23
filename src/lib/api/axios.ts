import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { authSnapshot, useAuthStore } from "@/lib/store/authStore";
import type { ApiEnvelope } from "@/types";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export const api = axios.create({ baseURL });

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

api.interceptors.request.use((config) => {
  const token = authSnapshot().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryConfig | undefined;
    if (error.response?.status !== 401 || !original || original._retry || original.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    const refreshToken = authSnapshot().refreshToken;
    if (!refreshToken) {
      authSnapshot().clearAuth();
      if (typeof window !== "undefined") window.location.href = "/login";
      return Promise.reject(error);
    }

    original._retry = true;
    try {
      const res = await axios.post<ApiEnvelope<{ access_token: string; refresh_token: string }>>(`${baseURL}/auth/refresh`, {
        refresh_token: refreshToken,
      });
      useAuthStore.getState().setTokens(res.data.data);
      original.headers.Authorization = `Bearer ${res.data.data.access_token}`;
      return api(original);
    } catch (refreshError) {
      authSnapshot().clearAuth();
      if (typeof window !== "undefined") window.location.href = "/login";
      return Promise.reject(refreshError);
    }
  },
);

export async function unwrap<T>(request: Promise<{ data: ApiEnvelope<T> }>) {
  const response = await request;
  return response.data.data;
}
