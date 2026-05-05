interface HeroProps {
  topChampion: string;
}

export function Hero({ topChampion }: HeroProps) {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.25em] text-[#00B0F4]">
          Philosophical Leadership Community
        </p>
        <h1 className="bg-gradient-to-r from-[#5865F2] via-slate-100 to-[#D4AF37] bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
          Wisdom Circle Community
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
          Wisdom is not information. It is disciplined clarity in motion.
          Enter a cinematic space where thinkers, strategists, and creators
          elevate each other through meaningful dialogue.
        </p>
        <div className="mx-auto mt-8 inline-flex items-center gap-2 rounded-full border border-[#5865F2]/40 bg-[#111320] px-5 py-2 text-sm text-slate-200">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Current top champion: <strong className="text-[#D4AF37]">{topChampion}</strong>
        </div>
      </div>
    </section>
  );
}
