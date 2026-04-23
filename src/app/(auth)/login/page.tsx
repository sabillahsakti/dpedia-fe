import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-dpedia-background px-4">
      <section className="w-full max-w-[430px] rounded-3xl border border-dpedia-border bg-dpedia-surface p-6 shadow-2xl">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.35em] text-dpedia-primary">DPedia</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">Masuk</h1>
          <p className="mt-2 text-sm text-dpedia-muted">Lanjutkan streaming drama favoritmu.</p>
        </div>
        <LoginForm />
      </section>
    </main>
  );
}
