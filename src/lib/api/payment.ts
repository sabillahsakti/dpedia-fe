import { api, unwrap } from "./axios";
import type { Payment, PaymentRequestResult, Plan } from "@/types";

export const paymentApi = {
  plans: () => unwrap<Plan[]>(api.get("/plans")),
  request: (planId: string) => unwrap<PaymentRequestResult>(api.post("/payment/request", { plan_id: planId })),
  history: () => unwrap<Payment[]>(api.get("/payment/history")),
  detail: (id: string) => unwrap<Payment>(api.get(`/payment/${id}`)),
};
