"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Crown } from "lucide-react";
import { useEffect, useRef } from "react";
import { EpisodeList } from "@/components/content/EpisodeList";
import { Skeleton } from "@/components/ui/skeleton";
import { VideoPlayer } from "@/components/content/VideoPlayer";
import { contentApi } from "@/lib/api/content";
import { useAuthStore } from "@/lib/store/authStore";

export default function WatchPage() {
  const params = useParams<{ source: string; id: string }>();
  const source = params.source;
  const id = decodeURIComponent(params.id);
  const hasToken = !!useAuthStore((s) => s.accessToken);
  const episode = useQuery({ queryKey: ["episode", source, id, hasToken], queryFn: () => contentApi.episode(source, id), retry: false });
  const siblings = useQuery({ queryKey: ["episodes", source, episode.data?.series_id], queryFn: () => contentApi.episodes(source, episode.data!.series_id), enabled: !!episode.data?.series_id });
  const savedHistoryId = useRef<string | null>(null);
  const saveHistory = useMutation({ mutationFn: () => contentApi.watchHistory({ series_id: episode.data!.series_id, episode_id: episode.data!.id, source }) });

  useEffect(() => {
    if (!episode.data?.video_url || !hasToken || savedHistoryId.current === episode.data.id) return;
    savedHistoryId.current = episode.data.id;
    saveHistory.mutate();
  }, [episode.data?.id, episode.data?.video_url, hasToken, saveHistory]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <VideoPlayer url={episode.data?.video_url} />
      {episode.isError && <div className="mt-4 rounded-xl border border-dpedia-secondary/30 bg-dpedia-secondary/10 p-4 text-dpedia-secondary"><Crown className="mb-2 h-5 w-5" />Berlangganan untuk menonton episode premium. <Link className="font-bold underline" href="/subscription">Lihat paket</Link></div>}
      <section className="mt-5 rounded-xl border border-dpedia-border bg-dpedia-surface p-5">
        <p className="text-sm text-dpedia-muted">Sedang menonton</p>
        <h1 className="text-2xl font-bold tracking-tight">Episode {episode.data?.index || "-"}</h1>
        {episode.data?.is_locked && !episode.data.video_url && <div className="mt-4 rounded-xl bg-dpedia-primary/10 p-4 text-sm text-dpedia-primary">Episode ini butuh subscription aktif.</div>}
      </section>
      <section className="mt-5 rounded-xl border border-dpedia-border bg-dpedia-elevated p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight">Pilih Episode</h2>
          <span className="text-xs text-dpedia-muted">Tap angka untuk lompat</span>
        </div>
        {siblings.isLoading ? <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10">{Array.from({ length: 20 }).map((_, i) => <Skeleton key={i} className="aspect-square" />)}</div> : <EpisodeList episodes={siblings.data || []} activeId={id} />}
      </section>
    </main>
  );
}
