"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-xl font-medium text-white">Portfolio unavailable</h1>
        <p className="mt-2 text-sm text-white/70">
          {error.message || "An unexpected error occurred while loading the portfolio."}
        </p>

        <button
          type="button"
          onClick={() => reset()}
          className="mt-4 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-medium text-slate-950 hover:opacity-95 transition"
        >
          Try again
        </button>
      </div>
    </main>
  );
}

