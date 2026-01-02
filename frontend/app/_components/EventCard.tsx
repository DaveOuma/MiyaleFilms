import Link from "next/link";

type Category = {
  id: number;
  name: string;
  slug: string;
  order: number;
};

type Cover = null | {
  media_type: "image" | "video";
  file_url: string;
  caption: string;
};

type EventItem = {
  id: number;
  title: string;
  slug: string;
  date: string | null;
  location: string;
  featured: boolean;
  category: Category;
  cover: Cover;
  has_video: boolean;
};

export default function EventCard({ e }: { e: EventItem }) {
  const showVideoOverlay = e.cover?.media_type === "video" || e.has_video;

  return (
    <Link
      href={`/events/${e.slug}`}
      className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-sm hover:bg-white/10 transition"
    >
      <div className="relative aspect-[4/3] w-full bg-white/5">
        {e.cover?.media_type === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={e.cover.file_url}
            alt={e.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : e.cover?.media_type === "video" ? (
          <div className="flex h-full w-full items-center justify-center">
            <div className="rounded-2xl border border-white/20 bg-black/40 px-4 py-3 text-sm text-white/80">
              Video
            </div>
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-white/60">
            Open event
          </div>
        )}

        {showVideoOverlay && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm text-white backdrop-blur">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400 text-slate-950">
                ▶
              </span>
              <span className="text-white/90">Play</span>
            </div>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0" />
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs text-white/60">{e.category.name}</div>
          {e.featured && (
            <span className="rounded-full bg-amber-400/20 px-2 py-1 text-[11px] text-amber-200">
              Featured
            </span>
          )}
        </div>

        <h3 className="mt-1 text-lg font-medium text-white">{e.title}</h3>
        <div className="mt-2 text-sm text-white/70">
          {e.location || "Location not set"}
        </div>
      </div>
    </Link>
  );
}
