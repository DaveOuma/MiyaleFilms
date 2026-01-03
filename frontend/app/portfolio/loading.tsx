function SkeletonChip() {
  return (
    <div className="h-9 w-24 rounded-full border border-white/10 bg-white/5 animate-pulse" />
  );
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <div className="aspect-[4/3] w-full bg-white/5 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-3 w-24 rounded bg-white/10 animate-pulse" />
          <div className="h-5 w-16 rounded-full bg-white/10 animate-pulse" />
        </div>
        <div className="h-5 w-3/4 rounded bg-white/10 animate-pulse" />
        <div className="h-4 w-1/2 rounded bg-white/10 animate-pulse" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <main>
      <header className="mb-6">
        <div className="h-10 w-48 rounded bg-white/10 animate-pulse" />
        <div className="mt-3 h-4 w-72 rounded bg-white/10 animate-pulse" />
      </header>

      <nav className="mb-8 flex flex-wrap gap-2">
        <SkeletonChip />
        <SkeletonChip />
        <SkeletonChip />
        <SkeletonChip />
        <SkeletonChip />
      </nav>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </section>
    </main>
  );
}

