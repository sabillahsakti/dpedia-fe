import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Series } from "@/types";

export function SeriesCard({ series, priority = false }: { series: Series; priority?: boolean }) {
  return (
    <Link href={`/series/${series.source}/${encodeURIComponent(series.id)}`} className="group block overflow-hidden rounded-xl border border-dpedia-border bg-dpedia-surface transition duration-300 hover:scale-105 hover:brightness-110">
      <div className="relative aspect-[2/3] overflow-hidden bg-dpedia-elevated">
        {series.cover_url ? (
          <Image src={series.cover_url} alt={series.title} fill sizes="(max-width: 430px) 50vw, (max-width: 1024px) 25vw, 220px" className="object-cover" unoptimized priority={priority} loading={priority ? "eager" : "lazy"} />
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center text-sm text-dpedia-muted">Tanpa gambar</div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/60 to-transparent p-3 pt-16">
          <h3 className="line-clamp-2 text-sm font-bold tracking-tight text-white">{series.title}</h3>
        </div>
        <Badge className="absolute right-2 top-2 border-dpedia-primary/40 bg-dpedia-primary/80 text-white">{series.episode_count} eps</Badge>
      </div>
      <div className="flex gap-1 overflow-hidden p-3">
        {(series.tags || []).slice(0, 2).map((tag) => (
          <Badge key={tag} className="shrink-0 px-2 py-0.5 text-[10px]">{tag}</Badge>
        ))}
      </div>
    </Link>
  );
}
