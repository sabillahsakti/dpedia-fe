"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { UserSession } from "@/types";

export function SessionCard({ session }: { session: UserSession }) {
  return (
    <Card className="p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-bold">{session.device_name}</h2>
            <Badge className={session.is_active ? "border-green-500/30 bg-green-500/15 text-green-300" : "border-zinc-500/30 bg-zinc-500/15 text-zinc-300"}>{session.is_active ? "Aktif" : "Nonaktif"}</Badge>
          </div>
          <p className="mt-1 text-sm text-dpedia-muted">{session.user_name || "-"} · {session.user_email || "-"}</p>
          <p className="mt-2 break-all text-xs text-dpedia-muted">{session.user_agent}</p>
        </div>
        <div className="grid min-w-64 gap-2 text-sm md:text-right">
          <Info label="IP" value={session.ip_address} />
          <Info label="Last seen" value={formatDate(session.last_seen_at)} />
          <Info label="Expires" value={formatDate(session.expires_at)} />
          {session.revoked_at && <Info label="Revoked" value={formatDate(session.revoked_at)} />}
        </div>
      </div>
    </Card>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <p><span className="text-dpedia-muted">{label}: </span><span className="font-semibold">{value}</span></p>;
}
