import { Users, Activity, Sparkles } from "lucide-react";
import type { DiscordServerStats } from "@/lib/discordServer";

interface ServerOverviewProps {
  stats: DiscordServerStats;
}

export function ServerOverview({ stats }: ServerOverviewProps) {
  const tickerMembers =
    stats.onlineMembers.length > 0
      ? [...stats.onlineMembers, ...stats.onlineMembers]
      : [];

  return (
    <section className="mx-auto mt-8 max-w-6xl px-6">
      <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-[#151a2b] via-[#121729] to-[#0f1424] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.45)]">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#5865F2]/40 bg-[#161b30] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#9aa7ff]">
              <Sparkles className="h-3.5 w-3.5" />
              Discord Intelligence Panel
            </p>
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              {stats.serverName}
            </h2>
            <p className="mt-2 text-slate-300">
              Live server pulse for Wisdom Circle Community.
            </p>
          </div>

          <a
            href={stats.inviteUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-fit items-center justify-center rounded-lg bg-[#5865F2] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4953c6]"
          >
            Join Official Discord
          </a>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="rounded-xl border border-white/10 bg-[#111523] p-4">
            <p className="mb-2 inline-flex items-center gap-2 text-sm text-slate-400">
              <Users className="h-4 w-4 text-[#D4AF37]" />
              Total Members
            </p>
            <p className="text-3xl font-bold text-[#D4AF37]">
              {stats.memberCount.toLocaleString()}
            </p>
          </article>

          <article className="rounded-xl border border-white/10 bg-[#111523] p-4">
            <p className="mb-2 inline-flex items-center gap-2 text-sm text-slate-400">
              <Activity className="h-4 w-4 text-emerald-400" />
              Online Now
            </p>
            <p className="text-3xl font-bold text-emerald-400">
              {stats.onlineCount.toLocaleString()}
            </p>
          </article>
        </div>

        <div className="mt-6 rounded-xl border border-white/10 bg-[#101420] p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#9aa7ff]">
            Online members
          </p>

          {tickerMembers.length > 0 ? (
            <div className="online-members-mask">
              <div className="online-members-track">
                {tickerMembers.map((member, index) => (
                  <span
                    key={`${member.name}-${index}`}
                    className="mx-2 inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#1a1f33] px-3 py-1.5 text-sm text-slate-200"
                  >
                    {member.avatarUrl ? (
                      <img
                        src={member.avatarUrl}
                        alt={member.name}
                        className="h-5 w-5 rounded-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#5865F2] text-[10px] font-bold text-white">
                        {member.name[0]?.toUpperCase() ?? "U"}
                      </span>
                    )}
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    {member.name}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400">
              Enable Discord Server Widget to display live online members.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
