# Project Summary
- Tujuan aplikasi: frontend DPedia untuk streaming drama pendek, autentikasi user/admin, browsing konten dari banyak source, menonton episode, langganan, pembayaran via Pakasir, panel admin, serta kontrol admin untuk paket dan provider konten.
- Tech stack utama: Next.js 16.2.4 App Router, React 19, TypeScript, Tailwind CSS v4, TanStack Query v5, Zustand persist, Axios, react-player, lucide-react, sonner toast.
- Runtime: Node.js untuk build/start Next.js; browser client untuk sebagian besar halaman karena data fetching, auth state, dan aksi API berada di client component.
- DB lokal frontend: Not found; data persisten client hanya `localStorage` Zustand dan cookie mirror `dpedia_access_token`.
- Queue/integrasi penting: Not found.
- Pola arsitektur singkat: `App Router page/layout -> UI component -> TanStack Query/useMutation -> lib/api module -> axios interceptor -> DPedia backend REST API`; auth state disimpan di Zustand dan proteksi route dilakukan oleh `src/middleware.ts` + `AuthGate`.

# Core Logic Flow (Function-Level Flowchart)
- Bootstrap aplikasi:
  `Next App Router -> RootLayout[RootLayout] -> QueryProvider[QueryProvider] -> page/layout tree -> UI components`
- Route protection awal:
  `Request -> middleware[middleware] -> cookie dpedia_access_token -> redirect /login atau NextResponse.next`
- Login:
  `/login -> LoginPage -> LoginForm[submit] -> authApi.login -> unwrap -> axios.post /auth/login -> useAuthStore.setAuth -> localStorage + cookie -> router.replace(next atau /)`
- Register:
  `/register -> RegisterPage -> RegisterForm[submit] -> authApi.register -> axios.post /auth/register -> useAuthStore.setAuth -> localStorage + cookie -> router.replace(/)`
- JWT auto-refresh:
  `Any api request -> axios request interceptor -> Authorization Bearer -> backend -> 401 -> axios response interceptor -> POST /auth/refresh -> useAuthStore.setTokens -> retry original request -> API`
- Logout:
  `/profile -> ProfilePage -> ProfileContent.logout -> authApi.logout -> POST /auth/logout -> useAuthStore.clearAuth -> clear localStorage/cookie -> /login`
- Home feed:
  `/ -> HomePage -> useInfiniteQuery[contentApi.feed] -> GET /content/feed -> SeriesCard -> /series/:source/:id`
- Browse:
  `/browse -> BrowsePage -> useQuery[contentApi.feed] with source/tab -> GET /content/feed -> SeriesCard`
- Series detail:
  `/series/[source]/[id] -> SeriesDetailPage -> useQuery[contentApi.series] + useQuery[contentApi.episodes] -> GET /content/series/:source/:id + /episodes -> EpisodeList -> /watch/:source/:episodeId`
- Watch episode:
  `/watch/[source]/[id] -> WatchPage -> useQuery[contentApi.episode] -> VideoPlayer[onEnded] -> if authenticated contentApi.watchHistory -> POST /content/watch-history -> auto router.push next episode`
- Subscription/payment request:
  `/subscription -> AuthGate -> SubscriptionPage -> paymentApi.plans + userApi.subscription -> PlanCard -> paymentApi.request -> POST /payment/request -> router.push /payment/:id`
- Payment history:
  `/payment -> AuthGate -> PaymentPage -> paymentApi.history -> GET /payment/history -> Payment item -> /payment/:id`
- Payment detail/gateway:
  `/payment/[id] -> AuthGate -> PaymentDetailPage -> paymentApi.detail -> PaymentDetail + countdown -> open checkout_url Pakasir -> poll GET /payment/:id until webhook confirms`
- Admin guard:
  `/admin/* -> middleware cookie check -> AdminLayout -> AuthGate[adminOnly] -> useAuthStore.user.role === admin -> render atau redirect /`
- Admin dashboard:
  `/admin -> AdminDashboardPage -> adminApi.stats -> GET /admin/stats -> stat cards`
- Admin plans:
  `/admin/plans -> AdminPlansPage -> adminApi.plans -> GET /admin/plans -> create/update plan -> POST/PATCH /admin/plans`
- Admin provider control:
  `/admin/providers -> AdminProvidersPage -> adminApi.providers -> GET /admin/providers -> toggle source -> PATCH /admin/providers/:source`
- Admin payment moderation:
  `/admin/payments -> AdminPaymentsPage -> adminApi.payments -> GET /admin/payments -> /admin/payments/:id -> AdminPaymentDetailPage -> adminApi.payment -> confirm/reject mutation -> POST /admin/payments/:id/confirm|reject`
- Admin users:
  `/admin/users -> AdminUsersPage -> adminApi.users -> GET /admin/users -> /admin/users/:id -> AdminUserDetailPage -> adminApi.user + adminApi.userSessions -> GET /admin/users/:id + /sessions`
- Admin sessions:
  `/admin/sessions -> AdminSessionsPage -> adminApi.sessions -> GET /admin/sessions -> SessionCard list`

# Clean Tree
```text
src/
  app/
    (auth)/
      login/page.tsx
      register/page.tsx
    (main)/
      browse/page.tsx
      layout.tsx
      page.tsx
      payment/
        page.tsx
        [id]/page.tsx
      profile/page.tsx
      series/[source]/[id]/page.tsx
      subscription/page.tsx
      watch/[source]/[id]/page.tsx
    admin/
      layout.tsx
      page.tsx
      plans/page.tsx
      payments/
        page.tsx
        [id]/page.tsx
      providers/page.tsx
      sessions/page.tsx
      users/
        page.tsx
        [id]/page.tsx
    error.tsx
    globals.css
    layout.tsx
    loading.tsx
  components/
    admin/SessionCard.tsx
    auth/LoginForm.tsx
    auth/RegisterForm.tsx
    content/EpisodeList.tsx
    content/SeriesCard.tsx
    content/VideoPlayer.tsx
    layout/AdminSidebar.tsx
    layout/AuthGate.tsx
    layout/BottomNav.tsx
    layout/QueryProvider.tsx
    layout/TopBar.tsx
    payment/PaymentDetail.tsx
    payment/PlanCard.tsx
    ui/badge.tsx
    ui/button.tsx
    ui/card.tsx
    ui/input.tsx
    ui/modal.tsx
    ui/skeleton.tsx
    ui/textarea.tsx
  lib/
    api/admin.ts
    api/auth.ts
    api/axios.ts
    api/content.ts
    api/payment.ts
    api/user.ts
    store/authStore.ts
    utils.ts
  types/index.ts
  middleware.ts
public/
  file.svg
  globe.svg
  next.svg
  vercel.svg
  window.svg
.env.local
eslint.config.mjs
next.config.ts
package.json
postcss.config.mjs
tailwind.config.ts
tsconfig.json
```

# Module Map (The Chapters)
- `src/app/layout.tsx`
  - Fungsi/class publik utama: `RootLayout`, `metadata`.
  - Peran modul: root shell HTML, font Inter, React Query provider, dan global toaster.
- `src/app/globals.css`
  - Fungsi/class publik utama: Not found.
  - Peran modul: definisi tema Tailwind v4, background gelap global, utility line clamp, dan shadow glow.
- `src/middleware.ts`
  - Fungsi/class publik utama: `middleware`, `config`.
  - Peran modul: proteksi route berbasis cookie `dpedia_access_token` dan redirect auth dasar sebelum render.
- `src/app/error.tsx`
  - Fungsi/class publik utama: `ErrorPage`.
  - Peran modul: error boundary global dengan tombol retry.
- `src/app/loading.tsx`
  - Fungsi/class publik utama: `Loading`.
  - Peran modul: fallback loading global.
- `src/app/(auth)/login/page.tsx`
  - Fungsi/class publik utama: `LoginPage`.
  - Peran modul: halaman login dan wrapper visual `LoginForm`.
- `src/app/(auth)/register/page.tsx`
  - Fungsi/class publik utama: `RegisterPage`.
  - Peran modul: halaman registrasi dan wrapper visual `RegisterForm`.
- `src/app/(main)/layout.tsx`
  - Fungsi/class publik utama: `MainLayout`.
  - Peran modul: layout user-facing dengan `TopBar` dan `BottomNav`.
- `src/app/(main)/page.tsx`
  - Fungsi/class publik utama: `HomePage`.
  - Peran modul: feed home dengan source switcher berbasis provider aktif dari backend, infinite query, card grid, dan load more.
- `src/app/(main)/browse/page.tsx`
  - Fungsi/class publik utama: `BrowsePage`.
  - Peran modul: browse konten berdasarkan source aktif dan tab/kata kunci.
- `src/app/(main)/series/[source]/[id]/page.tsx`
  - Fungsi/class publik utama: `SeriesDetailPage`.
  - Peran modul: detail series, hero cover, metadata, tombol tonton, dan grid episode.
- `src/app/(main)/watch/[source]/[id]/page.tsx`
  - Fungsi/class publik utama: `WatchPage`.
  - Peran modul: halaman player episode, watch-history, auto-next, dan pemilih episode.
- `src/app/(main)/profile/page.tsx`
  - Fungsi/class publik utama: `ProfilePage`, `ProfileContent`.
  - Peran modul: profil user, status subscription, link pembayaran, dan logout.
- `src/app/(main)/subscription/page.tsx`
  - Fungsi/class publik utama: `SubscriptionPage`, `SubscriptionContent`.
  - Peran modul: status langganan dan daftar plan yang dapat membuat payment request.
- `src/app/(main)/payment/page.tsx`
  - Fungsi/class publik utama: `PaymentPage`, `PaymentContent`.
  - Peran modul: riwayat pembayaran user.
- `src/app/(main)/payment/[id]/page.tsx`
  - Fungsi/class publik utama: `PaymentDetailPage`, `PaymentDetailContent`.
  - Peran modul: detail payment, countdown expiry, dan upload bukti jika pending.
- `src/app/admin/layout.tsx`
  - Fungsi/class publik utama: `AdminLayout`.
  - Peran modul: layout admin dengan guard admin dan sidebar.
- `src/app/admin/page.tsx`
  - Fungsi/class publik utama: `AdminDashboardPage`.
  - Peran modul: dashboard statistik admin.
- `src/app/admin/plans/page.tsx`
  - Fungsi/class publik utama: `AdminPlansPage`.
  - Peran modul: halaman admin untuk membuat dan mengedit paket langganan.
- `src/app/admin/providers/page.tsx`
  - Fungsi/class publik utama: `AdminProvidersPage`.
  - Peran modul: halaman admin untuk mengaktifkan atau mematikan provider konten.
- `src/app/admin/payments/page.tsx`
  - Fungsi/class publik utama: `AdminPaymentsPage`.
  - Peran modul: daftar pembayaran admin dengan filter status dan pagination sederhana.
- `src/app/admin/payments/[id]/page.tsx`
  - Fungsi/class publik utama: `AdminPaymentDetailPage`.
  - Peran modul: detail payment admin, preview bukti transfer, confirm/reject dengan modal notes.
- `src/app/admin/users/page.tsx`
  - Fungsi/class publik utama: `AdminUsersPage`.
  - Peran modul: daftar user admin dengan pagination sederhana.
- `src/app/admin/users/[id]/page.tsx`
  - Fungsi/class publik utama: `AdminUserDetailPage`.
  - Peran modul: detail user dan daftar device/session user tersebut.
- `src/app/admin/sessions/page.tsx`
  - Fungsi/class publik utama: `AdminSessionsPage`.
  - Peran modul: daftar semua session/device user untuk admin.
- `src/components/layout/QueryProvider.tsx`
  - Fungsi/class publik utama: `QueryProvider`.
  - Peran modul: konfigurasi TanStack Query client global.
- `src/components/layout/AuthGate.tsx`
  - Fungsi/class publik utama: `AuthGate`.
  - Peran modul: guard client-side untuk halaman auth-required dan admin-only.
- `src/components/layout/TopBar.tsx`
  - Fungsi/class publik utama: `TopBar`.
  - Peran modul: header user dengan logo, search/browse, dan link profile/login.
- `src/components/layout/BottomNav.tsx`
  - Fungsi/class publik utama: `BottomNav`.
  - Peran modul: navigasi mobile fixed untuk Home, Browse, Langganan, Profil.
- `src/components/layout/AdminSidebar.tsx`
  - Fungsi/class publik utama: `AdminSidebar`.
  - Peran modul: navigasi admin desktop/mobile untuk dashboard, plans, providers, payments, users, sessions.
- `src/components/auth/LoginForm.tsx`
  - Fungsi/class publik utama: `LoginForm`.
  - Peran modul: form login, mutation auth, toast error, dan sinkronisasi auth store.
- `src/components/auth/RegisterForm.tsx`
  - Fungsi/class publik utama: `RegisterForm`.
  - Peran modul: form registrasi, validasi dasar, mutation auth, dan sinkronisasi auth store.
- `src/components/content/SeriesCard.tsx`
  - Fungsi/class publik utama: `SeriesCard`.
  - Peran modul: card cover series dengan link ke detail dan optimasi priority image opsional.
- `src/components/content/EpisodeList.tsx`
  - Fungsi/class publik utama: `EpisodeList`.
  - Peran modul: grid angka episode dengan state aktif dan ikon lock.
- `src/components/content/VideoPlayer.tsx`
  - Fungsi/class publik utama: `VideoPlayer`.
  - Peran modul: wrapper dynamic `react-player` dengan autoplay dan callback ended.
- `src/components/payment/PlanCard.tsx`
  - Fungsi/class publik utama: `PlanCard`.
  - Peran modul: card paket langganan dan trigger request payment.
- `src/components/payment/PaymentDetail.tsx`
  - Fungsi/class publik utama: `PaymentDetail`.
  - Peran modul: ringkasan detail payment dan status badge.
- `src/components/admin/SessionCard.tsx`
  - Fungsi/class publik utama: `SessionCard`.
  - Peran modul: visualisasi device/session user dengan IP, user-agent, last seen, expiry, revoked.
- `src/components/ui/button.tsx`
  - Fungsi/class publik utama: `Button`.
  - Peran modul: primitive tombol dengan variant DPedia.
- `src/components/ui/input.tsx`
  - Fungsi/class publik utama: `Input`.
  - Peran modul: primitive input gelap.
- `src/components/ui/textarea.tsx`
  - Fungsi/class publik utama: `Textarea`.
  - Peran modul: primitive textarea gelap.
- `src/components/ui/card.tsx`
  - Fungsi/class publik utama: `Card`.
  - Peran modul: primitive container card.
- `src/components/ui/badge.tsx`
  - Fungsi/class publik utama: `Badge`, `StatusBadge`.
  - Peran modul: badge umum dan badge status payment.
- `src/components/ui/modal.tsx`
  - Fungsi/class publik utama: `Modal`.
  - Peran modul: modal overlay sederhana untuk konfirmasi admin.
- `src/components/ui/skeleton.tsx`
  - Fungsi/class publik utama: `Skeleton`.
  - Peran modul: placeholder loading.
- `src/lib/api/axios.ts`
  - Fungsi/class publik utama: `api`, `unwrap`.
  - Peran modul: axios instance, attach JWT, auto-refresh 401, retry request, redirect login saat refresh gagal.
- `src/lib/api/auth.ts`
  - Fungsi/class publik utama: `authApi`.
  - Peran modul: wrapper endpoint auth register/login/logout.
- `src/lib/api/content.ts`
  - Fungsi/class publik utama: `contentApi`.
  - Peran modul: wrapper endpoint content sources, feed, series, episodes, episode, languages, watch-history; daftar source mengikuti provider aktif dari backend.
- `src/lib/api/payment.ts`
  - Fungsi/class publik utama: `paymentApi`.
  - Peran modul: wrapper endpoint plans, payment request/history/detail, dan upload proof.
- `src/lib/api/user.ts`
  - Fungsi/class publik utama: `userApi`.
  - Peran modul: wrapper endpoint profile dan subscription user.
- `src/lib/api/admin.ts`
  - Fungsi/class publik utama: `adminApi`.
  - Peran modul: wrapper endpoint admin stats, plans, providers, payments, users, sessions, confirm/reject.
- `src/lib/store/authStore.ts`
  - Fungsi/class publik utama: `useAuthStore`, `authSnapshot`.
  - Peran modul: Zustand persisted auth state dan cookie mirror untuk middleware.
- `src/lib/utils.ts`
  - Fungsi/class publik utama: `cn`, `formatRupiah`, `formatDate`, `apiErrorMessage`, `statusLabel`.
  - Peran modul: utility styling, format, dan normalisasi error.
- `src/types/index.ts`
  - Fungsi/class publik utama: `ApiEnvelope`, `PaginatedEnvelope`, `User`, `UserSession`, `AuthResult`, `Plan`, `Subscription`, `Payment`, `Series`, `Episode`, `FeedItem`, `AdminStats`, `ProviderStatus`.
  - Peran modul: kontrak TypeScript response/API domain frontend.
- `tailwind.config.ts`
  - Fungsi/class publik utama: `config`.
  - Peran modul: konfigurasi warna, font, dan shadow DPedia untuk Tailwind.
- `next.config.ts`
  - Fungsi/class publik utama: `nextConfig`.
  - Peran modul: konfigurasi Next.js; saat ini kosong/default.

# Data & Config
- Lokasi `.env*` / config utama:
  - `.env.local`: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_UPLOADS_URL`.
  - `tailwind.config.ts`: palet DPedia dan font family.
  - `src/app/globals.css`: tema Tailwind v4 dan global style.
  - `next.config.ts`: Not found untuk config khusus.
  - `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`: config TypeScript/lint/PostCSS.
- Skema data singkat:
  - DB lokal: Not found.
  - Entity TypeScript inti: `User`, `UserSession`, `Plan`, `Subscription`, `Payment`, `Series`, `Episode`, `Subtitle`, `FeedItem`, `AdminStats`, `ProviderStatus`.
  - Relasi data di frontend bersifat referensial dari API: `Payment.user_id/plan_id`, `Subscription.user_id/plan_id`, `Episode.series_id/source`, `UserSession.user_id`.
- Lokasi migration/seed:
  - Migration frontend: Not found.
  - Seed frontend: Not found.
- State/storage client:
  - `localStorage` key `dpedia-auth` via Zustand persist.
  - Cookie `dpedia_access_token` untuk middleware route protection.
  - TanStack Query in-memory cache untuk API response.
- Folder output/runtime artifacts:
  - `.next`: build output Next.js, wajib diabaikan.
  - `node_modules`: dependency, wajib diabaikan.
  - `package-lock.json`: npm lockfile/artifact dependency resolution.
  - Public static assets: `public/*.svg`.

# External Integrations
- DPedia Backend REST API: dikonfigurasi oleh `NEXT_PUBLIC_API_URL`, dipanggil melalui `src/lib/api/*.ts`.
- Upload/static backend: dikonfigurasi oleh `NEXT_PUBLIC_UPLOADS_URL`, dipakai admin payment detail untuk preview proof image.
- Auth/JWT backend: `authApi` dan `axios` interceptor untuk login/register/logout/refresh.
- Content provider indirect: frontend tidak memanggil provider upstream langsung; semua lewat backend `/content/*`.
- Provider control: frontend admin mengelola status source lewat `/admin/providers`, sedangkan halaman user hanya menerima source aktif dari `/content/sources`.
- Payment gateway redirect: `checkout_url` dari backend dipakai frontend untuk membuka checkout Pakasir.
- React Player media loading: `VideoPlayer` memuat stream URL dari backend episode response.
- Google Fonts melalui `next/font/google` untuk Inter.
- Browser APIs: `localStorage`, `document.cookie`, `document.fullscreenEnabled`, `requestFullscreen`.
- Sonner toast: feedback aksi auth/payment/admin.

# Risks / Blind Spots
- `middleware.ts` hanya mengecek keberadaan cookie token, bukan validitas/role token; validasi admin sebenarnya terjadi di `AuthGate` client-side dan backend API.
- Cookie token dibuat dari client store dan bukan `HttpOnly`, sehingga lebih mudah diakses JavaScript dibanding cookie server-side.
- `AuthGate` bergantung pada `user.role` dari Zustand; jika state stale/tampered, UI bisa sempat render guard state, tetapi backend tetap harus menolak API non-admin.
- Frontend tidak punya server-side data fetching untuk halaman utama; sebagian besar halaman client-rendered dan bergantung pada API availability setelah hydration.
- `requestFullscreen` di auto-next bisa diblokir browser karena bukan selalu dipicu gesture user.
- `react-player` di-load dynamic; behavior spesifik stream bergantung browser dan format URL dari backend.
- `NEXT_PUBLIC_*` dievaluasi saat build; perubahan env produksi perlu rebuild frontend.
- `next.config.ts` belum mengatur image remote domains karena image external memakai `unoptimized`; optimasi image Next tidak dipakai penuh.
- Pagination admin memakai tombol Prev/Next sederhana tanpa membaca total secara lengkap untuk disabled state kecuali sessions length.
- Tidak ditemukan test frontend unit/e2e.
- `package-lock.json` ada di repo kerja tetapi diabaikan dalam peta karena termasuk artifact dependency resolution untuk tujuan navigasi source.
