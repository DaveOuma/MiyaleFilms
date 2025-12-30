"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

type MediaItem = {
  id: number;
  media_type: "image" | "video";
  file_url: string;
  caption: string;
  order: number;
  is_cover: boolean;
};

export default function EventGallery({
  items,
  eventTitle,
}: {
  items: MediaItem[];
  eventTitle: string;
}) {
  const ordered = useMemo(
    () => [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [items]
  );

  const images = ordered.filter((m) => m.media_type === "image");
  const videos = ordered.filter((m) => m.media_type === "video");

  const [lightbox, setLightbox] = useState<null | MediaItem>(null);

  return (
    <section className="mt-8 space-y-10">
      {videos.length > 0 && (
        <div>
          <h2 className="text-lg font-medium">Video</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {videos.map((v) => (
              <figure
                key={v.id}
                className="overflow-hidden rounded-2xl border bg-white"
              >
                <video
                  controls
                  preload="metadata"
                  className="h-full w-full"
                  src={v.file_url}
                />
                {v.caption && (
                  <figcaption className="p-3 text-xs text-gray-600">
                    {v.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-medium">Gallery</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {images.map((m) => (
            <figure
              key={m.id}
              className="overflow-hidden rounded-2xl border bg-white"
            >
              <Image
                src={m.file_url}
                alt={m.caption || eventTitle}
                width={1600}
                height={1200}
                className="h-full w-full cursor-zoom-in object-cover"
                onClick={() => setLightbox(m)}
              />

              {m.caption && (
                <figcaption className="p-3 text-xs text-gray-600">
                  {m.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
        >
          <div className="w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm text-white/80">
                {lightbox.caption || eventTitle}
              </div>
              <button
                className="rounded-lg border border-white/30 px-3 py-2 text-sm text-white hover:bg-white/10"
                onClick={() => setLightbox(null)}
                type="button"
              >
                Close
              </button>
            </div>

            <div className="overflow-hidden rounded-2xl bg-black">
              <Image
                src={lightbox.file_url}
                alt={lightbox.caption || eventTitle}
                width={2400}
                height={1600}
                className="h-auto w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
