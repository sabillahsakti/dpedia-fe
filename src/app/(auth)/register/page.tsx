import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-dpedia-background px-4">
      <section className="w-full max-w-[430px] rounded-3xl border border-dpedia-border bg-dpedia-surface p-6 shadow-2xl">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.35em] text-dpedia-primary">DPedia</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">Buat Akun</h1>
          <p className="mt-2 text-sm text-dpedia-muted">Daftar untuk menyimpan progres dan berlangganan.</p>
        </div>
        <RegisterForm />
      </section>
    </main>
  );
}
