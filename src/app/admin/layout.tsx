import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AuthGate } from "@/components/layout/AuthGate";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate adminOnly>
      <div className="min-h-screen bg-dpedia-background text-dpedia-text">
        <AdminSidebar />
        <main className="px-4 py-20 md:ml-72 md:px-8 md:py-8">{children}</main>
      </div>
    </AuthGate>
  );
}
