"use client";

import { useState } from "react";

const WHATSAPP_NUMBER = "254724269201";

function buildWhatsAppLink(payload: {
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

  const [form, setForm] = useState({
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

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

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

    // Send to Django
    try {
      const res = await fetch(`${API_BASE}/api/enquiries/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          event_date: form.event_date || null,
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed to submit enquiry");
      }

      setStatus("success");
      setForm({
        name: "",
        phone: "",
        email: "",
        event_type: "wedding",
        event_date: "",
        location: "",
        message: "",
      });
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err?.message || "Submission failed.");
    }
  }

  const whatsappHref = buildWhatsAppLink({
    name: form.name,
    phone: form.phone,
    event_type: form.event_type,
    event_date: form.event_date,
    location: form.location,
    message: form.message,
  });

  return (
    <main className="mx-auto max-w-3xl p-6">
      <header className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-sm"
>
        <h4 className="rounded-xl bg-gradient-to-r from-indigo-700 px-4 py-3 text-sm">Contact</h4>
        <p className="rounded-xl px-4 py-3 text-sm"
>
          <i> Note: WhatsApp is the fastest option. You can also send an enquiry form and we will respond as soon as possible.</i>
        </p>

        <div className="rounded-xl px-4 py-3 text-sm font-medium text-slate-950 hover:opacity-95 transition">
          <a className="rounded-xl bg-gradient-to-r from-emerald-300 px-4 py-3 text-sm hover:bg-white/15 transition"
 href={whatsappHref} target="_blank" rel="noreferrer">
            WhatsApp
          </a> 
          <a className="rounded-xl bg-gradient-to-r from-emerald-200 px-5 py-3 text-sm hover:bg-white/15 transition" href="tel:+254724269201">
            Call
          </a>
          <a className="rounded-xl bg-gradient-to-r from-emerald-100 px-5 py-3 text-sm hover:bg-white/15 transition" href="mailto:davidomuga@gmail.com?subject=Booking%20Enquiry">
            Email
          </a>
        </div>
      </header>

      <section className="mt-8 overflow-hidden rounded-2xl border bg-white">
  <div className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 p-6 text-white">
    <h2 className="text-lg font-medium">Enquiry form</h2>
    <p className="mt-1 text-sm text-white/80">
      Share your event details and we will respond as soon as possible.
    </p>
  </div>
  <section className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
  <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-fuchsia-500 to-indigo-500" />
<div className="p-6">
        <form className="mt-4 grid gap-4" onSubmit={submit}>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-black">Name *</label>
            <input
              className="rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-fuchsia-400 focus:ring-4 focus:ring-fuchsia-400/20"

              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Your name"
              required
            />
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-black">Phone</label>
              <input
                className="rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-black placeholder:text-white/40 outline-none focus:border-fuchsia-400 focus:ring-4 focus:ring-fuchsia-400/20"


                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="e.g., 07xx xxx xxx"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-black">Email</label>
              <input
                className="rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-black placeholder:text-white/40 outline-none focus:border-fuchsia-400 focus:ring-4 focus:ring-fuchsia-400/20"

                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="you@example.com"
                type="email"
              />
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-black">Event type</label>
              <select
               className="rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-black placeholder:text-white/40 outline-none focus:border-fuchsia-400 focus:ring-4 focus:ring-fuchsia-400/20"

                value={form.event_type}
                onChange={(e) => update("event_type", e.target.value)}
              >
                <option value="wedding">Wedding</option>
                <option value="birthday">Birthday/Celebration</option>
                <option value="public">Political/Public Event</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-black">Event date</label>
              <input
                className="rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-black placeholder:text-white/40 outline-none focus:border-fuchsia-400 focus:ring-4 focus:ring-fuchsia-400/20"

                value={form.event_date}
                onChange={(e) => update("event_date", e.target.value)}
                type="date"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-black">Location</label>
            <input
              className="rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-black placeholder:text-white/40 outline-none focus:border-fuchsia-400 focus:ring-4 focus:ring-fuchsia-400/20"


              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="Venue / area"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-black"
>Message</label>
            <textarea
              className="rounded-xl border px-4 py-3 text-sm text-black"

              value={form.message}
              onChange={(e) => update("message", e.target.value)}
              placeholder="Tell us what you need (coverage duration, deliverables, etc.)"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              className="rounded-xl bg-gradient-to-r from-indigo-400 px-5 py-3 text-sm font-medium text-slate-950 shadow-sm hover:opacity-95 transition disabled:opacity-60"

              type="submit"
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "Submitting..." : "Submit enquiry"}
            </button>

            <a className="rounded-xl border border-emerald-100 bg-gradient-to-r from-emerald-300 px-5 py-3 text-sm text-emerald-800 hover:bg-emerald-100"
 href={whatsappHref} target="_blank" rel="noreferrer">
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
      </section>
    </main>
  );
}

function Field({
  label, 
  children,
} : {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block"> 
     <div className="mb-2 text-xs font-medium text-white/70">{label}</div>
    </label>
  );
}

