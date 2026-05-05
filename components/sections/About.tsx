import {
  ABOUT_INTRO,
  CORE_PILLARS,
  EXCLUSIVE_FEATURES,
  WHY_JOIN
} from "@/constants/aboutContent";

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-12">
      <div className="about-shell rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a1f33] to-[#0f1424] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
        <h2 className="text-2xl font-semibold text-[#D4AF37] md:text-3xl">
          Vision & Wisdom Management
        </h2>
        <div className="mt-5 space-y-4 text-slate-300">
          {ABOUT_INTRO.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-white">Our Core Pillars</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {CORE_PILLARS.map((pillar) => (
              <article
                key={pillar.title}
                className="about-card rounded-xl border border-white/10 bg-[#111320]/90 p-5"
              >
                <h4 className="mb-2 text-base font-semibold text-[#9aa7ff]">
                  {pillar.title}
                </h4>
                <p className="text-sm leading-6 text-slate-300">{pillar.text}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-white">
            Exclusive Features & Experience
          </h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {EXCLUSIVE_FEATURES.map((feature) => (
              <article
                key={feature.title}
                className="about-card rounded-xl border border-white/10 bg-[#111320]/90 p-5"
              >
                <h4 className="mb-2 text-base font-semibold text-[#D4AF37]">
                  {feature.title}
                </h4>
                <p className="text-sm leading-6 text-slate-300">{feature.text}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-[#5865F2]/35 bg-[#101420] p-5">
          <h3 className="text-xl font-semibold text-white">Why Join the Circle?</h3>
          <p className="mt-3 text-slate-300">
            The Wisdom Circle is not for everyone. It is for the seeker, the
            skeptic, the builder, and the dreamer. It is for those who find
            beauty in a galaxy, complexity in an atom, and potential in the
            human brain.
          </p>
          <ul className="mt-4 space-y-2">
            {WHY_JOIN.map((item) => (
              <li key={item} className="flex items-start gap-2 text-slate-200">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
