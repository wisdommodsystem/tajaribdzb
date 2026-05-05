import type { DiscordServerStats } from "@/lib/discordServer";

export interface LandingStats {
  activeScholars: string;
  weeklyDialogues: string;
  mentorshipSessions: string;
  topChampion: string;
}

export async function getLandingStats(
  discordStats: DiscordServerStats
): Promise<LandingStats> {
  return {
    activeScholars: formatNumber(discordStats.memberCount),
    weeklyDialogues: formatNumber(discordStats.onlineCount),
    mentorshipSessions: "1,240+", // Static or from another source
    topChampion: "Wisdom Champion"
  };
}

function formatNumber(value: number): string {
  return value.toLocaleString();
}
