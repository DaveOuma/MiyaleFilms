const WHATSAPP_NUMBER = "254724269201"; // international format, no +
const WHATSAPP_TEXT =
  "Hello MiyaleFilms, I would like to enquire about photography/filming services. My event date is ____ and location is ____.";

function waLink() {
  const text = encodeURIComponent(WHATSAPP_TEXT);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <header className="rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold">Contact</h1>
        <p className="mt-3 text-sm text-gray-600">
          For bookings and enquiries, WhatsApp is the fastest option. You can also
          reach us by phone or email.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            className="rounded-xl bg-black px-5 py-3 text-sm text-white"
            href={waLink()}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp enquiry
          </a>

          <a className="rounded-xl border px-5 py-3 text-sm" href="tel:+254724269201">
            Call
          </a>

          <a
            className="rounded-xl border px-5 py-3 text-sm"
            href="mailto:hello@miyalefilms.com?subject=Booking%20Enquiry"
          >
            Email
          </a>
        </div>
      </header>

      <section className="mt-8 rounded-2xl border bg-white p-6">
        <h2 className="text-lg font-medium">What to include</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
          <li>Event type (wedding, birthday, political/public event)</li>
          <li>Date and time</li>
          <li>Location/venue</li>
          <li>Coverage duration (e.g., four hours, full day)</li>
          <li>Deliverables (photos only, video only, or both)</li>
        </ul>
      </section>

      <section className="mt-8 rounded-2xl border bg-white p-6">
        <h2 className="text-lg font-medium">Quick enquiry template</h2>
        <p className="mt-2 text-sm text-gray-600">
          Copy this into WhatsApp to get a quick response:
        </p>

        <pre className="mt-4 whitespace-pre-wrap rounded-xl border bg-gray-50 p-4 text-sm text-gray-800">
{`Hello MiyaleFilms,

Event type:
Date:
Location:
Coverage duration:
Photos / Video / Both:
Any special requests:`}
        </pre>

        <div className="mt-4">
          <a
            className="inline-block rounded-xl bg-black px-5 py-3 text-sm text-white"
            href={waLink()}
            target="_blank"
            rel="noreferrer"
          >
            Open WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}

