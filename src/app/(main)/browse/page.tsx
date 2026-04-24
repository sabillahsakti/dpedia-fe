"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { SeriesCard } from "@/components/content/SeriesCard";
import { Skeleton } from "@/components/ui/skeleton";
import { contentApi } from "@/lib/api/content";

export default function BrowsePage() {
  const [source, setSource] = useState("dramabite");
  const [tab, setTab] = useState("");
  const sources = useQuery({ queryKey: ["sources"], queryFn: contentApi.sources });
  const sourceList = useMemo(() => sources.data ?? [], [sources.data]);
  const selectedSource = sourceList.includes(source) ? source : sourceList[0] || source;
  const feed = useQuery({
    queryKey: ["browse", selectedSource, tab],
    queryFn: () => contentApi.feed({ source: selectedSource, tab, page: 1, lang: "id" }),
    enabled: sourceList.length > 0,
  });

  if (!sourceList.length && !sources.isLoading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="text-3xl font-black tracking-tight">Browse</h1>
        <p className="mt-2 text-dpedia-muted">Belum ada provider aktif saat ini.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-3xl font-black tracking-tight">Browse</h1>
      <p className="mt-2 text-dpedia-muted">Filter berdasarkan sumber dan genre/kata kunci.</p>
      <div className="my-5 grid gap-3 md:grid-cols-[240px_1fr]">
        <select value={selectedSource} onChange={(e) => setSource(e.target.value)} className="h-12 rounded-xl border border-dpedia-border bg-dpedia-elevated px-4 text-sm outline-none">
          {sourceList.map((item) => <option key={item}>{item}</option>)}
        </select>
        <Input placeholder="Genre atau kata kunci, contoh: trending" value={tab} onChange={(e) => setTab(e.target.value)} />
      </div>
      {feed.isLoading ? <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">{Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="aspect-[2/3]" />)}</div> : <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">{feed.data?.map((item, index) => <SeriesCard key={`${item.series.source}-${item.series.id}`} series={item.series} priority={index < 2} />)}</div>}
    </main>
  );
}
