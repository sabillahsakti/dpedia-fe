import { api, unwrap } from "./axios";
import type { FeedItem, Episode, Series } from "@/types";

export const contentApi = {
  sources: () => unwrap<string[]>(api.get("/content/sources")),
  feed: (params: { source: string; tab?: string; page?: number; lang?: string }) =>
    unwrap<FeedItem[]>(api.get("/content/feed", { params: { lang: "id", page: 1, ...params } })),
  series: (source: string, id: string) => unwrap<Series>(api.get(`/content/series/${source}/${encodeURIComponent(id)}`)),
  episodes: (source: string, id: string) => unwrap<Episode[]>(api.get(`/content/series/${source}/${encodeURIComponent(id)}/episodes`)),
  episode: (source: string, id: string) => unwrap<Episode>(api.get(`/content/episode/${source}/${encodeURIComponent(id)}`)),
  languages: (source: string) => unwrap<string[]>(api.get(`/content/languages/${source}`)),
  watchHistory: (payload: { series_id: string; episode_id: string; source: string }) =>
    unwrap<{ saved: boolean }>(api.post("/content/watch-history", payload)),
};
