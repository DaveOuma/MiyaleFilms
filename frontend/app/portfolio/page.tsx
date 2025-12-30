import EventCard from "../_components/EventCard";

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

async function getEvents(category?: string): Promise<EventItem[]> {
  const base = requireApiBase();
  const url = category
    ? `${base}/api/events/?category=${encodeURIComponent(category)}`
    : `${base}/api/events/`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load events");
  return res.json();
}

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const category = searchParams.category;
  const [categories, events] = await Promise.all([
    getCategories(),
    getEvents(category),
  ]);

  return (
    <main>
      <header className="mb-6">
        <h1 className="text-4xl font-semibold tracking-tight text-white">
          Portfolio
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-white/70">
          Browse events by category.
        </p>
      </header>

      <nav className="mb-8 flex flex-wrap gap-2">
        <a
          className={[
            "rounded-full border px-4 py-2 text-sm transition",
            !category
              ? "border-white/10 bg-gradient-to-r from-amber-400 via-fuchsia-500 to-indigo-500 text-slate-950 font-medium"
              : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10",
          ].join(" ")}
          href="/portfolio"
        >
          All
        </a>

        {categories.map((c) => {
          const isActive = category === c.slug;
          return (
            <a
              key={c.id}
              className={[
                "rounded-full border px-4 py-2 text-sm transition",
                isActive
                  ? "border-white/10 bg-emerald-400 text-slate-950 font-medium hover:opacity-95"
                  : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10",
              ].join(" ")}
              href={`/portfolio?category=${c.slug}`}
            >
              {c.name}
            </a>
          );
        })}
      </nav>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((e) => (
  <EventCard key={e.id} e={e} />
))}
      </section>

      {events.length === 0 && (
        <p className="mt-10 text-sm text-white/70">
          No events found. Add events in Django admin.
        </p>
      )}
    </main>
  );
}
