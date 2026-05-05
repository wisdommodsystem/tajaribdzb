import { SOCIAL_LINKS } from "@/constants/social";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0f111a] py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
        <p className="text-sm text-slate-400">
          © {new Date().getFullYear()} Wisdom Circle Community
        </p>

        <div className="flex items-center gap-4">
          {SOCIAL_LINKS.map(({ name, href, icon: Icon }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-white/10 bg-[#1a1d2e] p-2 text-slate-300 transition hover:border-[#5865F2]/40 hover:text-[#5865F2]"
            >
              <span className="sr-only">{name}</span>
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
