import { formatCents, PRICING } from '@von-rosenberg/shared';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
        Von Rosenberg Family
      </p>
      <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
        Reunion Registration Platform
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-700">
        Welcome to the reunion registration site. Create an account, submit your bedroom
        reservation, and return anytime to update your details before the reunion.
      </p>
      <div className="mt-10 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Planning reference</h2>
        <p className="mt-2 text-sm text-gray-600">
          Informational pricing only — payment is collected at check-in.
        </p>
        <ul className="mt-4 space-y-2 text-sm text-gray-700">
          <li>Nightly lodging estimate: {formatCents(PRICING.nightlyRateCents)}</li>
          <li>Per meal estimate: {formatCents(PRICING.mealRateCents)}</li>
        </ul>
      </div>
    </main>
  );
}
