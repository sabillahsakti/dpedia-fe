"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { adminApi } from "@/lib/api/admin";

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const users = useQuery({ queryKey: ["admin-users", page], queryFn: () => adminApi.users({ page, per_page: 20 }) });
  return (
    <div>
      <h1 className="text-3xl font-black tracking-tight">Users</h1>
      <div className="mt-5 space-y-3">{users.data?.data.map((user) => <Link key={user.id} href={`/admin/users/${user.id}`}><Card className="mb-3 grid gap-3 p-4 transition hover:border-dpedia-primary md:grid-cols-4"><p className="font-semibold">{user.name}</p><p className="text-dpedia-muted">{user.email}</p><Badge>{user.role}</Badge><Badge className={user.is_active ? "text-green-300" : "text-red-300"}>{user.is_active ? "aktif" : "nonaktif"}</Badge></Card></Link>)}</div>
      <div className="mt-5 flex gap-3"><Button variant="outline" disabled={page === 1} onClick={() => setPage((v) => v - 1)}>Prev</Button><Button onClick={() => setPage((v) => v + 1)}>Next</Button></div>
    </div>
  );
}
