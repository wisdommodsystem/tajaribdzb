import { LeaderboardEntry } from "@/types/leaderboard";
import { unstable_cache } from 'next/cache';
import connectToDatabase from "./mongodb";
import MongoDBUser from "@/models/MongoDBUser";
import UserProfile from "@/models/UserProfile";

async function getEnrichedMongoLeaderboardData(limit: number = 50, sortBy: "voice" | "text" = "voice"): Promise<LeaderboardEntry[]> {
  try {
    await connectToDatabase();
    
    // 1. Determine sort criteria (Default to voiceLevel as requested)
    const sortCriteria = sortBy === "voice" 
      ? { voiceLevel: -1, totalVoiceMinutes: -1 } 
      : { textLevel: -1, totalXP: -1 };

    // 2. Get stats from 'test/users' collection
    const topUsersStats = await MongoDBUser.find({})
      .sort(sortCriteria as any)
      .limit(limit)
      .lean();

    if (!topUsersStats.length) return [];

    const userIds = topUsersStats.map((u: any) => String(u.userId));

    // 3. Get names/avatars from our 'UserProfile' collection
    const dbProfiles = await UserProfile.find({ discordId: { $in: userIds } });
    const profileMap = new Map(dbProfiles.map(p => [p.discordId, p]));

    const botToken = process.env.DISCORD_BOT_TOKEN;

    // 4. Merge and Enrich
    const enrichedLeaderboard = await Promise.all(topUsersStats.map(async (u: any, index: number) => {
      const userId = String(u.userId);
      const profile = profileMap.get(userId);

      let username = profile?.username;
      let avatar = profile?.avatar;

      if (!username || !avatar) {
        if (botToken) {
          try {
            const discordRes = await fetch(`https://discord.com/api/v10/users/${userId}`, {
              headers: { Authorization: `Bot ${botToken.trim()}` },
            });
            if (discordRes.ok) {
              const userData = await discordRes.json();
              username = userData.global_name || userData.username;
              if (userData.avatar) {
                const isGif = userData.avatar.startsWith('a_');
                avatar = `https://cdn.discordapp.com/avatars/${userId}/${userData.avatar}.${isGif ? 'gif' : 'png'}?size=128`;
              } else {
                avatar = `https://cdn.discordapp.com/embed/avatars/${parseInt(userId.slice(-1)) % 5}.png`;
              }

              await UserProfile.findOneAndUpdate(
                { discordId: userId },
                { username, avatar, lastSeen: new Date() },
                { upsert: true }
              );
            }
          } catch (err) {}
        }
      }

      return {
        rank: index + 1,
        id: userId,
        username: username || `Scholar #${userId.slice(-4)}`,
        avatar: avatar || `https://cdn.discordapp.com/embed/avatars/${parseInt(userId.slice(-1)) % 5}.png`,
        level: u.textLevel || 0,
        xp: u.totalXP || 0,
        voiceLevel: u.voiceLevel || 0,
        voiceMinutes: u.totalVoiceMinutes || 0,
        combinedScore: sortBy === "voice" ? (u.voiceLevel * 1000 + u.totalVoiceMinutes) : (u.textLevel * 1000 + u.totalXP)
      };
    }));

    return enrichedLeaderboard;
  } catch (error) {
    console.error("[Leaderboard] Hybrid Fetch Error:", error);
    return [];
  }
}

export const fetchLeaderboard = unstable_cache(
  async (limit: number = 50, sortBy: "voice" | "text" = "voice") => getEnrichedMongoLeaderboardData(limit, sortBy),
  [`leaderboard-hybrid-v5-refresh-${Date.now()}`], 
  { revalidate: 18000, tags: ['leaderboard'] }
);
