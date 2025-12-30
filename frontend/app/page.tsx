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
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

function requireApiBase(): string {
  if (!API_BASE) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE is not set. Create frontend/.env.local with NEXT_PUBLIC_API_BASE=http://localhost:8000 and restart `npm run dev`."
    );
  }
  return API_BASE;
}

async function getCategories(): Promise<Category[]> {
  const base = requireApiBase();
  const res = await fetch(`${base}/api/categories/`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load categories");
  return res.json();
}

async function getFeaturedEvents(): Promise<EventItem[]> {
  const base = requireApiBase();
  const res = await fetch(`${base}/api/events/?featured=true`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load featured events");
  return res.json();
}

export default async function HomePage() {
  const [categories, featured] = await Promise.all([
    getCategories(),
    getFeaturedEvents(),
  ]);

  return (
    <main>
      {/* Hero: same idea as yours, but cinematic-tuned */}
      <header className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-sm">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-amber-500 opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/70" />
          <div className="relative p-8">
            <h1 className="text-4xl font-semibold tracking-tight text-white">
              MiyaleFilms
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-white/80">
              Event photography and filmmaking for weddings, birthdays and
              celebrations, and political/public events.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                className="rounded-xl bg-white/15 px-5 py-3 text-sm text-white hover:bg-white/20 transition"
                href="/portfolio"
              >
                View portfolio
              </a>
              <a
                className="rounded-xl bg-white/15 px-5 py-3 text-sm text-white hover:bg-white/20 transition"
                href="/contact"
              >
                Book/Contact
              </a>
              <a
                className="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-medium text-slate-950 hover:opacity-95 transition"
                href="https://wa.me/254724269201"
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp enquiry
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Categories: same placement/idea, styled for dark */}
      <section className="mt-10">
        <h2 className="text-xl font-medium text-white">Categories</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((c) => (
            <a
              key={c.id}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition"
              href={`/portfolio?category=${c.slug}`}
            >
              {c.name}
            </a>
          ))}
        </div>
      </section>

      {/* Featured: same layout, cards styled for dark */}
      <section className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-xl font-medium text-white">Featured work</h2>
          <a
            className="text-sm text-white/70 hover:text-white hover:underline transition"
            href="/portfolio"
          >
            View all →
          </a>
        </div>

        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((e) => (
            <a
              key={e.id}
              href={`/events/${e.slug}`}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-sm hover:bg-white/10 transition"
            >
              <div className="aspect-[4/3] w-full bg-white/5">
                {e.cover?.media_type === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={e.cover.file_url}
                    alt={e.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-white/60">
                    Open event
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="text-xs text-white/60">{e.category.name}</div>
                <h3 className="mt-1 text-lg font-medium text-white">
                  {e.title}
                </h3>
                <div className="mt-2 text-sm text-white/70">
                  {e.location || "Location not set"}
                </div>
              </div>
            </a>
          ))}
        </div>

        {featured.length === 0 && (
          <p className="mt-6 text-sm text-white/70">
            No featured events yet. Mark one or two events as featured in Django
            admin.
          </p>
        )}
      </section>
    </main>
  );
}
