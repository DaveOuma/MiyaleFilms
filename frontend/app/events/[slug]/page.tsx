type MediaItem = {
  id: number;
  media_type: "image" | "video";
  file_url: string;
  caption: string;
  order: number;
  is_cover: boolean;
};

type Category = {
  id: number;
  name: string;
  slug: string;
  order: number;
};

type EventDetail = {
  id: number;
  title: string;
  slug: string;
  date: string | null;
  location: string;
  description: string;
  featured: boolean;
  category: Category;
  media: MediaItem[];
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

function requireApiBase(): string {
  if (!API_BASE) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE is not set. Create frontend/.env.local with NEXT_PUBLIC_API_BASE=http://127.0.0.1:8000 and restart `npm run dev`."
    );
  }
  return API_BASE;
}

async function getEvent(slug: string): Promise<EventDetail> {
  const base = requireApiBase();
  const res = await fetch(`${base}/api/events/${encodeURIComponent(slug)}/`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load event");
  return res.json();
}

export default async function EventPage({
  params,
}: {
  params: { slug: string };
}) {
  const event = await getEvent(params.slug);

  return (
    <main className="mx-auto max-w-5xl p-6">
      <a href="/portfolio" className="text-sm text-gray-600 hover:underline">
        ← Back to portfolio
      </a>

      <header className="mt-4">
        <div className="text-xs text-gray-500">{event.category.name}</div>
        <h1 className="mt-2 text-3xl font-semibold">{event.title}</h1>
        <div className="mt-2 text-sm text-gray-600">
          {[event.location, event.date].filter(Boolean).join(" • ") || " "}
        </div>
        {event.description && (
          <p className="mt-4 max-w-3xl text-sm text-gray-700">
            {event.description}
          </p>
        )}
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        {event.media
          .filter((m) => m.media_type === "image")
          .map((m) => (
            <figure key={m.id} className="overflow-hidden rounded-2xl border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={m.file_url}
                alt={m.caption || event.title}
                className="h-full w-full object-cover"
              />
              {m.caption && (
                <figcaption className="p-3 text-xs text-gray-600">
                  {m.caption}
                </figcaption>
              )}
            </figure>
          ))}
      </section>
    </main>
  );
}

