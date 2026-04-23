"use client";

import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

export function VideoPlayer({ url, onEnded, autoPlay = true }: { url?: string; onEnded?: () => void; autoPlay?: boolean }) {
  if (!url) {
    return <div className="flex aspect-video items-center justify-center rounded-2xl border border-dpedia-border bg-dpedia-surface p-6 text-center text-dpedia-muted">Video belum tersedia atau akses terkunci.</div>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-dpedia-border bg-black shadow-2xl">
      <div className="aspect-video">
        <ReactPlayer src={url} width="100%" height="100%" controls playsInline playing={autoPlay} onEnded={onEnded} />
      </div>
    </div>
  );
}
