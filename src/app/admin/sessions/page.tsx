"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { MonitorSmartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { adminApi } from "@/lib/api/admin";
import { SessionCard } from "@/components/admin/SessionCard";

export default function AdminSessionsPage() {
  const [page, setPage] = useState(1);
  const sessions = useQuery({ queryKey: ["admin-sessions", page], queryFn: () => adminApi.sessions({ page, per_page: 20 }) });

  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-dpedia-primary/15 p-3 text-dpedia-primary"><MonitorSmartphone className="h-6 w-6" /></div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">User Sessions</h1>
          <p className="text-sm text-dpedia-muted">Pantau device, IP, dan aktivitas login user.</p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {sessions.data?.data.map((session) => <SessionCard key={session.id} session={session} />)}
        {sessions.data?.data.length === 0 && <Card className="p-5 text-dpedia-muted">Belum ada session.</Card>}
      </div>

      <div className="mt-5 flex items-center gap-3">
        <Button variant="outline" disabled={page === 1} onClick={() => setPage((v) => v - 1)}>Prev</Button>
        <span className="text-sm text-dpedia-muted">Page {page}</span>
        <Button onClick={() => setPage((v) => v + 1)} disabled={(sessions.data?.data.length || 0) < 20}>Next</Button>
      </div>
    </div>
  );
}


