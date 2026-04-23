"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import type { Episode } from "@/types";
import { cn } from "@/lib/utils";

export function EpisodeList({ episodes, activeId }: { episodes: Episode[]; activeId?: string }) {
  if (!episodes.length) {
    return <div className="rounded-xl border border-dpedia-border bg-dpedia-surface p-5 text-sm text-dpedia-muted">Episode belum tersedia.</div>;
  }

  return (
    <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10">
      {episodes.map((episode) => {
        const active = episode.id === activeId;
        return (
          <Link
            key={episode.id}
            href={`/watch/${episode.source}/${encodeURIComponent(episode.id)}`}
            aria-label={`Episode ${episode.index}`}
            className={cn(
              "relative flex aspect-square items-center justify-center rounded-xl border text-sm font-bold transition hover:scale-105 hover:brightness-110",
              active
                ? "border-dpedia-primary bg-dpedia-primary text-white shadow-glow"
                : "border-dpedia-border bg-dpedia-surface text-white hover:border-dpedia-primary hover:bg-dpedia-elevated",
              episode.is_locked && !active && "border-dpedia-secondary/30 text-dpedia-secondary",
            )}
          >
            {episode.index}
            {episode.is_locked && <Lock className="absolute right-1.5 top-1.5 h-3 w-3" />}
          </Link>
        );
      })}
    </div>
  );
}
