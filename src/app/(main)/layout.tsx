import { BottomNav } from "@/components/layout/BottomNav";
import { TopBar } from "@/components/layout/TopBar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-dpedia-background pb-24 text-dpedia-text md:pb-0">
      <TopBar />
      {children}
      <BottomNav />
    </div>
  );
}
