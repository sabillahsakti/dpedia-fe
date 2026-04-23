import { api, unwrap } from "./axios";
import type { AuthResult } from "@/types";

export const authApi = {
  register: (payload: { email: string; password: string; name: string }) => unwrap<AuthResult>(api.post("/auth/register", payload)),
  login: (payload: { email: string; password: string }) => unwrap<AuthResult>(api.post("/auth/login", payload)),
  logout: (refreshToken: string) => unwrap<{ logged_out: boolean }>(api.post("/auth/logout", { refresh_token: refreshToken })),
};
