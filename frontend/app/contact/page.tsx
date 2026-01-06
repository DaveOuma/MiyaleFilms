"use client";

import React, { useEffect, useMemo, useState } from "react";

const WHATSAPP_NUMBER = "254724269201";

type EventItem = {
  id: number;
  title: string;
  slug: string;
};

type FormState = {
  event: number | ""; // NEW: selected event id
  name: string;
  phone: string;
  email: string;
  event_type: "wedding" | "birthday" | "public" | "other";
  event_date: string; // YYYY-MM-DD
  location: string;
  message: string;
};

function buildWhatsAppLink(payload: {
  eventTitle?: string;
  name: string;
  phone: string;
  event_type: string;
  event_date: string;
  location: string;
  message: string;
}) {
  const lines = [
    "Hello MiyaleFilms, I would like to enquire about photography/filming services.",
    "",
    payload.eventTitle ? `Selected event: ${payload.eventTitle}` : "Selected event: (General enquiry)",
    `Name: ${payload.name || "-"}`,
    `Phone: ${payload.phone || "-"}`,
    `Event type: ${payload.event_type || "-"}`,
    `Event date: ${payload.event_date || "-"}`,
    `Location: ${payload.location || "-"}`,
    "",
    `Message: ${payload.message || "-"}`,
  ];
  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

export default function ContactPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  const [events, setEvents] = useState<EventItem[]>([]);
  const [eventsLoading, setEventsLoading] = useState<boolean>(true);

  const [form, setForm] = useState<FormState>({
    event: "",
    name: "",
    phone: "",
    email: "",
    event_type: "wedding",
    event_date: "",
    location: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // Fetch events for the dropdown
  useEffect(() => {
    let mounted = true;

    async function loadEvents() {
      if (!API_BASE) {
        setEventsLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/events/`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load events");
        const data = (await res.json()) as EventItem[];
        if (mounted) setEvents(data);
      } catch {
        // Do not hard-fail the page; dropdown can remain empty
      } finally {
        if (mounted) setEventsLoading(false);
      }
    }

    loadEvents();
    return () => {
      mounted = false;
    };
  }, [API_BASE]);

  const selectedEventTitle = useMemo(() => {
    if (form.event === "") return undefined;
    return events.find((e) => e.id === form.event)?.title;
  }, [form.event, events]);

  const whatsappHref = useMemo(
    () =>
      buildWhatsAppLink({
        eventTitle: selectedEventTitle,
        name: form.name,
        phone: form.phone,
        event_type: form.event_type,
        event_date: form.event_date,
        location: form.location,
        message: form.message,
      }),
    [form, selectedEventTitle]
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    if (!API_BASE) {
      setStatus("error");
      setErrorMsg("NEXT_PUBLIC_API_BASE is not set. Add it to frontend/.env.local and restart Next.js.");
      return;
    }

    if (!form.name.trim()) {
      setStatus("error");
      setErrorMsg("Please enter your name.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/enquiries/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: form.event === "" ? null : form.event, // NEW
          name: form.name,
          phone: form.phone,
          email: form.email,
          event_type: form.event_type,
          event_date: form.event_date || null,
          location: form.location,
          message: form.message,
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed to submit enquiry");
      }

      setStatus("success");
      setForm({
        event: "",
        name: "",
        phone: "",
        email: "",
        event_type: "wedding",
        event_date: "",
        location: "",
        message: "",
      });
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Submission failed.");
    }
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      {/* Header */}
      <header className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-sm">
        <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-fuchsia-500 to-indigo-500" />
        <div className="p-8">
          <div className="inline-flex rounded-xl bg-indigo-700 px-4 py-2 text-sm text-white">
            Contact
          </div>

          <p className="mt-4 rounded-xl bg-white/5 px-4 py-3 text-sm text-white/80">
            <i>
              Note: WhatsApp is the fastest option. You can also submit the enquiry form and we will respond as soon as possible.
            </i>
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <a
              className="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-medium text-slate-950 hover:opacity-95 transition"
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
            <a
              className="rounded-xl bg-white/10 px-5 py-3 text-sm text-white hover:bg-white/15 transition"
              href="tel:+254724269201"
            >
              Call
            </a>
            <a
              className="rounded-xl bg-white/10 px-5 py-3 text-sm text-white hover:bg-white/15 transition"
              href="mailto:davidomuga@gmail.com?subject=Booking%20Enquiry"
            >
              Email
            </a>
          </div>
        </div>
      </header>

      {/* Form card */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <div className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 p-6 text-white">
          <h2 className="text-lg font-medium">Enquiry form</h2>
          <p className="mt-1 text-sm text-white/80">
            Share your event details and we will respond as soon as possible.
          </p>
        </div>

        <div className="p-6">
          <form className="grid gap-4" onSubmit={submit}>
            {/* NEW: select event */}
            <Field label="Select event (optional)">
              <select
                className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-white outline-none focus:border-fuchsia-400 focus:ring-4 focus:ring-fuchsia-400/20"
                value={form.event}
                onChange={(e) => update("event", e.target.value ? Number(e.target.value) : "")}
                disabled={eventsLoading || !API_BASE}
              >
                <option value="">General enquiry (no specific event)</option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title}
                  </option>
                ))}
              </select>
              {!API_BASE && (
                <p className="mt-2 text-xs text-rose-200">
                  API base not configured. Create <code className="text-rose-100">frontend/.env.local</code> and restart Next.
                </p>
              )}
              {API_BASE && !eventsLoading && events.length === 0 && (
                <p className="mt-2 text-xs text-white/70">
                  No events found yet. Add events in Django admin to populate this list.
                </p>
              )}
            </Field>

            <Field label="Name *">
              <input
                className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-fuchsia-400 focus:ring-4 focus:ring-fuchsia-400/20"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Your name"
                required
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Phone">
                <input
                  className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-fuchsia-400 focus:ring-4 focus:ring-fuchsia-400/20"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="e.g., 07xx xxx xxx"
                />
              </Field>

              <Field label="Email">
                <input
                  className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-fuchsia-400 focus:ring-4 focus:ring-fuchsia-400/20"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@example.com"
                  type="email"
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Event type">
                <select
                  className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-white outline-none focus:border-fuchsia-400 focus:ring-4 focus:ring-fuchsia-400/20"
                  value={form.event_type}
                  onChange={(e) => update("event_type", e.target.value as FormState["event_type"])}
                >
                  <option value="wedding">Wedding</option>
                  <option value="birthday">Birthday/Celebration</option>
                  <option value="public">Political/Public Event</option>
                  <option value="other">Other</option>
                </select>
              </Field>

              <Field label="Event date">
                <input
                  className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-white outline-none focus:border-fuchsia-400 focus:ring-4 focus:ring-fuchsia-400/20"
                  value={form.event_date}
                  onChange={(e) => update("event_date", e.target.value)}
                  type="date"
                />
              </Field>
            </div>

            <Field label="Location">
              <input
                className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-fuchsia-400 focus:ring-4 focus:ring-fuchsia-400/20"
                value={form.location}
                onChange={(e) => update("location", e.target.value)}
                placeholder="Venue / area"
              />
            </Field>

            <Field label="Message">
              <textarea
                className="min-h-[120px] w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-fuchsia-400 focus:ring-4 focus:ring-fuchsia-400/20"
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                placeholder="Tell us what you need (coverage duration, deliverables, etc.)"
              />
            </Field>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                className="rounded-xl bg-gradient-to-r from-amber-400 via-fuchsia-500 to-indigo-500 px-5 py-3 text-sm font-medium text-slate-950 shadow-sm hover:opacity-95 transition disabled:opacity-60"
                type="submit"
                disabled={status === "submitting"}
              >
                {status === "submitting" ? "Submitting..." : "Submit enquiry"}
              </button>

              <a
                className="rounded-xl border border-white/10 bg-white/10 px-5 py-3 text-sm text-white hover:bg-white/15 transition"
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
              >
                Send via WhatsApp instead
              </a>
            </div>

            {status === "success" && (
              <p className="text-sm text-emerald-300">
                Enquiry submitted successfully. We will respond as soon as possible.
              </p>
            )}

            {status === "error" && (
              <p className="text-sm text-rose-300">
                {errorMsg || "Enquiry submission failed. Please use WhatsApp as an alternative."}
              </p>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <div className="mb-2 text-xs font-medium text-white/70">{label}</div>
      {children}
      {hint && <div className="mt-2 text-xs text-white/60">{hint}</div>}
    </label>
  );
}
