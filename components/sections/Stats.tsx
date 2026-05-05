interface StatsProps {
  stats: Array<{ label: string; value: string }>;
}

export function Stats({ stats }: StatsProps) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((item) => (
          <article
            key={item.label}
            className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#1a1f33] to-[#111320] p-6 text-center shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
          >
            <p className="text-3xl font-bold text-[#00B0F4]">{item.value}</p>
            <p className="mt-2 text-sm uppercase tracking-wider text-slate-400">
              {item.label}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
