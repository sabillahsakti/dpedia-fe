"use client";

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SeriesCard } from "@/components/content/SeriesCard";
import { contentApi } from "@/lib/api/content";

const fallbackSources = ["dramabite", "dramabox", "dotdrama", "melolo", "netshort", "reelife", "stardusttv"];

export default function HomePage() {
  const [source, setSource] = useState("dramabite");
  const sources = useQuery({ queryKey: ["sources"], queryFn: contentApi.sources });
  const feed = useInfiniteQuery({
    queryKey: ["feed", source],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => contentApi.feed({ source, page: pageParam, lang: "id" }),
    getNextPageParam: (_lastPage, pages) => pages.length + 1,
  });
  const sourceList = sources.data?.length ? sources.data : fallbackSources;
  const items = feed.data?.pages.flat() || [];

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <section className="mb-8 overflow-hidden rounded-3xl border border-dpedia-border bg-gradient-to-br from-dpedia-elevated via-black to-dpedia-primary/20 p-6 shadow-glow md:p-10">
        <Badge className="border-dpedia-primary/40 text-dpedia-primary">Streaming drama pendek</Badge>
        <h1 className="mt-4 max-w-2xl text-4xl font-black tracking-tight md:text-6xl">Drama premium dari banyak sumber dalam satu tempat.</h1>
        <p className="mt-4 max-w-xl text-dpedia-muted">Jelajahi episode gratis, lanjutkan dengan langganan untuk membuka episode premium.</p>
      </section>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
        {sourceList.map((item) => (
          <button key={item} onClick={() => setSource(item)} className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${source === item ? "border-dpedia-primary bg-dpedia-primary text-white" : "border-dpedia-border bg-dpedia-surface text-dpedia-muted"}`}>
            {item}
          </button>
        ))}
      </div>

      {feed.isLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">{Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="aspect-[2/3]" />)}</div>
      ) : feed.isError ? (
        <div className="rounded-xl border border-dpedia-border bg-dpedia-surface p-5 text-dpedia-muted">Gagal memuat feed.</div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">{items.map((item, index) => <SeriesCard key={`${item.series.source}-${item.series.id}-${index}`} series={item.series} priority={index < 2} />)}</div>
          <div className="mt-8 flex justify-center"><Button onClick={() => feed.fetchNextPage()} disabled={feed.isFetchingNextPage}>{feed.isFetchingNextPage ? "Memuat..." : "Load More"}</Button></div>
        </>
      )}
    </main>
  );
}

