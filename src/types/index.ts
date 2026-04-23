export type Role = "user" | "admin";

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: { code: string; message: string };
}

export interface PaginatedEnvelope<T> {
  success: boolean;
  data: T[];
  meta: { page: number; per_page: number; total: number };
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResult {
  user: User;
  access_token: string;
  refresh_token: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  duration_days: number;
  is_active: boolean;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  started_at: string;
  expires_at: string;
  status: string;
  created_at: string;
}

export interface PaymentRequestResult {
  payment_id: string;
  amount: number;
  unique_code: number;
  total_amount: number;
  qris_info: string;
  expires_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  plan_id: string;
  amount: number;
  unique_code: number;
  total_amount: number;
  status: "pending" | "confirmed" | "rejected" | "expired";
  proof_image_url?: string | null;
  notes?: string | null;
  expires_at: string;
  confirmed_at?: string | null;
  confirmed_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Series {
  id: string;
  source: string;
  title: string;
  description: string;
  cover_url: string;
  tags: string[];
  episode_count: number;
  view_count: number;
}

export interface Episode {
  id: string;
  series_id: string;
  source: string;
  name: string;
  cover_url: string;
  index: number;
  duration: number;
  is_locked: boolean;
  video_url?: string;
  subtitle_list: Subtitle[];
}

export interface Subtitle {
  language: string;
  display_name: string;
  vtt_url: string;
  srt_url: string;
}

export interface FeedItem {
  series: Series;
}

export interface AdminStats {
  total_users: number;
  active_subscriptions: number;
  pending_payments: number;
  total_revenue: number;
}
