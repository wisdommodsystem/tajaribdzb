import { getDiscordServerStats } from "@/lib/discordServer";
import { getLandingStats } from "@/lib/landingData";

export interface WebsiteInsights {
  totalMembers: string;
  onlineNow: string;
  topChampion: string;
  engagementScore: string;
}

export async function getWebsiteInsights(): Promise<WebsiteInsights> {
  const discordStats = await getDiscordServerStats();
  const landingStats = await getLandingStats(discordStats);

  const engagementScore = Math.max(
    0,
    discordStats.onlineCount * 3 + discordStats.onlineMembers.length * 5
  );

  return {
    totalMembers: discordStats.memberCount.toLocaleString(),
    onlineNow: discordStats.onlineCount.toLocaleString(),
    topChampion: landingStats.topChampion,
    engagementScore: engagementScore.toLocaleString()
  };
}
