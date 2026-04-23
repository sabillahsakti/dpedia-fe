"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthResult, User } from "@/types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  hydrated: boolean;
  setAuth: (payload: AuthResult) => void;
  setTokens: (tokens: { access_token: string; refresh_token: string }) => void;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
  setHydrated: (hydrated: boolean) => void;
}

function mirrorAccessCookie(token: string | null) {
  if (typeof document === "undefined") return;
  if (token) {
    document.cookie = `dpedia_access_token=${token}; path=/; max-age=604800; SameSite=Lax`;
  } else {
    document.cookie = "dpedia_access_token=; path=/; max-age=0; SameSite=Lax";
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      hydrated: false,
      setAuth: (payload) => {
        mirrorAccessCookie(payload.access_token);
        set({ user: payload.user, accessToken: payload.access_token, refreshToken: payload.refresh_token });
      },
      setTokens: (tokens) => {
        mirrorAccessCookie(tokens.access_token);
        set({ accessToken: tokens.access_token, refreshToken: tokens.refresh_token });
      },
      setUser: (user) => set({ user }),
      clearAuth: () => {
        mirrorAccessCookie(null);
        set({ user: null, accessToken: null, refreshToken: null });
      },
      setHydrated: (hydrated) => set({ hydrated }),
    }),
    {
      name: "dpedia-auth",
      partialize: (state) => ({ user: state.user, accessToken: state.accessToken, refreshToken: state.refreshToken }),
      onRehydrateStorage: () => (state) => state?.setHydrated(true),
    },
  ),
);

export function authSnapshot() {
  return useAuthStore.getState();
}

