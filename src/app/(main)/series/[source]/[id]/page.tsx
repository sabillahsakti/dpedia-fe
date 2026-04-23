"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Eye, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EpisodeList } from "@/components/content/EpisodeList";
import { contentApi } from "@/lib/api/content";

export default function SeriesDetailPage() {
  const params = useParams<{ source: string; id: string }>();
  const source = params.source;
  const id = decodeURIComponent(params.id);
  const series = useQuery({ queryKey: ["series", source, id], queryFn: () => contentApi.series(source, id) });
  const episodes = useQuery({ queryKey: ["episodes", source, id], queryFn: () => contentApi.episodes(source, id) });
  const firstEpisode = episodes.data?.[0];

  if (series.isLoading) return <main className="mx-auto max-w-5xl px-4 py-6"><Skeleton className="h-[520px]" /></main>;
  if (!series.data) return <main className="p-6 text-dpedia-muted">Series tidak ditemukan.</main>;

  return (
    <main className="mx-auto max-w-5xl pb-8">
      <section className="relative min-h-[520px] overflow-hidden md:rounded-b-3xl">
        {series.data.cover_url && <Image src={series.data.cover_url} alt={series.data.title} fill className="object-cover" unoptimized priority />}
        <div className="absolute inset-0 bg-gradient-to-t from-dpedia-background via-black/65 to-black/20" />
        <div className="absolute inset-x-0 bottom-0 p-5 md:p-8">
          <Badge className="mb-3 border-dpedia-primary/40 text-dpedia-primary">{series.data.source}</Badge>
          <h1 className="text-4xl font-black tracking-tight md:text-6xl">{series.data.title}</h1>
          <p className="mt-3 line-clamp-3 max-w-2xl text-dpedia-muted">{series.data.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">{series.data.tags?.slice(0, 5).map((tag) => <Badge key={tag}>{tag}</Badge>)}</div>
          <div className="mt-4 flex items-center gap-4 text-sm text-dpedia-muted"><span>{series.data.episode_count} episode</span><span className="flex items-center gap-1"><Eye className="h-4 w-4" />{series.data.view_count.toLocaleString("id-ID")}</span></div>
          {firstEpisode && <Link href={`/watch/${source}/${encodeURIComponent(firstEpisode.id)}`}><Button className="mt-6"><Play className="mr-2 h-4 w-4" />Tonton Sekarang</Button></Link>}
        </div>
      </section>
      <section className="px-4 py-6">
        <h2 className="mb-4 text-xl font-bold tracking-tight">Daftar Episode</h2>
        {episodes.isLoading ? <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10">{Array.from({ length: 20 }).map((_, i) => <Skeleton key={i} className="aspect-square" />)}</div> : <EpisodeList episodes={episodes.data || []} />}
      </section>
    </main>
  );
}

