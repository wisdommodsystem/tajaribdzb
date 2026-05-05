import { getServerSession } from "next-auth";
import { DiscordDashboard } from "@/components/discord/DiscordDashboard";
import { authOptions } from "@/lib/auth";
import { getDiscordMemberProfile } from "@/lib/discordMember";
import { getWebsiteInsights } from "@/lib/insights";

export default async function DiscordPage() {
  const session = await getServerSession(authOptions);
  const profile = await getDiscordMemberProfile(session?.user?.discordId);
  const insights = await getWebsiteInsights();

  return <DiscordDashboard profile={profile} insights={insights} />;
}
