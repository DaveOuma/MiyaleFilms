import { use } from "react";
import EventGallery from "./_components/EventGallery";

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

export default function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  return <EventPageInner slug={slug} />;
}

async function EventPageInner({ slug }: { slug: string }) {
  const event = await getEvent(slug);

  const cover =
  event.media.find((m) => m.media_type === "image" && m.is_cover) ??
  event.media.find((m) => m.media_type === "image");

  return (
    <main className="max-w-5xl">
      <a href="/portfolio" className="text-sm text-black hover:underline">
        ← Back to portfolio
      </a>

{cover && (
  <div className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-black">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src={cover.file_url}
      alt={cover.caption || event.title}
      className="h-[320px] w-full object-cover sm:h-[420px]"
      loading="eager"
    />
    <div className="p-4 text-xs text-white/70">
      {cover.caption || event.category.name}
    </div>
  </div>
)}


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

    <EventGallery items={event.media} eventTitle={event.title} />
      <section className="mt-10 rounded-2xl bg-gradient-to-r from-indigo-600 p-6">
  <h2 className="text-lg font-medium text-black">Enquiries</h2>
  <p className="mt-2 text-sm text-white">
    Interested in similar coverage? Send an enquiry and share your event date and venue.
  </p>
  <div className="mt-4 flex flex-wrap gap-3">
    <a className="rounded-xl bg-gradient-to-r from-emerald-400 px-5 py-3 text-sm text-black" href="/contact">
      Contact
    </a>
    <a
      className="rounded-xl bg-gradient-to-r from-emerald-400 px-5 py-3 text-sm text-black"
      href="https://wa.me/254724269201"
      target="_blank"
      rel="noreferrer"
    >
      WhatsApp
    </a>
  </div>
</section>

    </main>
  );
}

