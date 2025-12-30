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
      "NEXT_PUBLIC_API_BASE is not set. Create frontend/.env.local with NEXT_PUBLIC_API_BASE=http://127.0.0.1:8000 and restart `npm run dev`."
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
    <main className="mx-auto max-w-6xl p-6">
      <header className="mb-6">
        <h1 className="text-4xl font-semibold text-black">Portfolio</h1>
        <p className="round-xl p-4 p-3 mt-2 text-sm text-white">
          Browse events by category.
        </p>
      </header>

      <nav className="mb-8 flex flex-wrap gap-2">
        <a
          className={`rounded-full bg-gradient-to-r from-emerald-400 px-5 py-3 text-sm ${
            !category ? "bg-white text-black" : "bg-white"
          }`}
          href="/portfolio"
        >
          All
        </a>

        {categories.map((c) => (
          <a
            key={c.id}
            className={`rounded-full bg-gradient-to-r from-emerald-300 px-4 py-3 text-black text-sm ${
              category === c.slug ? "bg-black text-black" : "bg-white"
            }`}
            href={`/portfolio?category=${c.slug}`}
          >
            {c.name}
          </a>
        ))}
      </nav>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((e) => (
          <a
            key={e.id}
            href={`/events/${e.slug}`}
            className="group overflow-hidden rounded-2xl border bg-white shadow-sm"
          >
            <div className="aspect-[4/3] w-full bg-gray-100">
              {e.cover?.media_type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={e.cover.file_url}
                  alt={e.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-gray-600">
                  Click me
                </div>
              )}
            </div>

            <div className="p-4">
              <div className="text-xs text-gray-500">{e.category.name}</div>
              <h2 className="mt-1 text-lg font-medium">{e.title}</h2>
              <div className="mt-2 text-sm text-gray-600">
                {e.location || "Location not set"}
              </div>
            </div>
          </a>
        ))}
      </section>

      {events.length === 0 && (
        <p className="mt-10 text-sm text-gray-600">
          No events found. Add events in Django admin.
        </p>
      )}
    </main>
  );
}

