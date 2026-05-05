import { Header } from "@/components/layout/Header";
import { About } from "@/components/sections/About";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { ServerOverview } from "@/components/sections/ServerOverview";
import { Stats } from "@/components/sections/Stats";
import { TopTicker } from "@/components/sections/TopTicker";
import { ServerRules } from "@/components/sections/ServerRules";
import { getDiscordServerStats } from "@/lib/discordServer";
import { getLandingStats } from "@/lib/landingData";
import { YouTubePopup } from "@/components/YouTubePopup";
import { YouTubeFeed } from "@/components/sections/YouTubeFeed";

export default async function HomePage() {
  const discordServerStats = await getDiscordServerStats();
  const landingStats = await getLandingStats(discordServerStats);
  const statsItems = [
    { label: "Active Scholars", value: landingStats.activeScholars },
    { label: "Weekly Dialogues", value: landingStats.weeklyDialogues },
    { label: "Mentorship Sessions", value: landingStats.mentorshipSessions }
  ];

  return (
    <main className="min-h-screen">
      <YouTubePopup />
      <TopTicker />
      <Header />
      <ServerOverview stats={discordServerStats} />
      <Hero topChampion={landingStats.topChampion} />
      <About />
      <YouTubeFeed />
      <ServerRules />
      <Stats stats={statsItems} />
      <Footer />
    </main>
  );
}
