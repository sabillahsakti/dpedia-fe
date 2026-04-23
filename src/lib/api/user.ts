import { api, unwrap } from "./axios";
import type { Subscription, User } from "@/types";

export const userApi = {
  me: () => unwrap<User>(api.get("/user/me")),
  subscription: () => unwrap<Subscription | null>(api.get("/user/subscription")),
};
